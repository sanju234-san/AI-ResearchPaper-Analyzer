#!/usr/bin/env python3
"""
Benchmark script to measure performance differences between sequential and
concurrent LLM summary generation in the RAG pipeline.
"""

import os
import sys
# Reconfigure stdout/stderr to use UTF-8 to prevent UnicodeEncodeError on Windows
if sys.version_info >= (3, 7):
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')
import time
import json
import asyncio
import argparse
import statistics
from datetime import datetime
from dotenv import load_dotenv

# Add the script's directory to the python path so app imports work
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

# Fallback text (~3800 characters) to use if no file is provided
FALLBACK_TEXT = """
Abstract—Retrieval-Augmented Generation (RAG) has emerged as a powerful framework to address the inherent limitations of Large Language Models (LLMs), such as factual hallucination, knowledge staleness, and lack of domain-specific expertise. By fetching relevant document excerpts from external knowledge bases and incorporating them into the prompt context, RAG systems ground model responses in verifiable evidence. However, deploying RAG systems in production environments introduces significant engineering challenges, particularly regarding the latency of downstream LLM generation. When generating multi-perspective analyses or structured evaluations of long documents, developers often issue multiple independent LLM calls. Doing so sequentially introduces unacceptable latencies while executing them fully concurrently risks exceeding the strict Rate Limits (e.g., Requests Per Minute and Tokens Per Minute) of third-party API providers. In this paper, we propose a balanced concurrency model utilizing asynchronous programming, semaphore-based rate-limiting, and client-side exponential backoff. We demonstrate that this approach restores parallel execution capabilities without sacrificing rate limit resilience.

I. INTRODUCTION
Large Language Models (LLMs) such as Llama 3 and GPT-4 have demonstrated remarkable capabilities in natural language understanding, text generation, and reasoning. Despite these successes, LLMs are fundamentally constrained by the static nature of their training data. They cannot access real-time information or proprietary databases, and they are prone to generating plausible-sounding but factually incorrect assertions—a phenomenon widely referred to as hallucination.

To mitigate these issues, Retrieval-Augmented Generation (RAG) has become the de facto architecture for knowledge-intensive AI applications. A standard RAG pipeline operates by encoding a user query, retrieving semantically similar text chunks from a vectorized database (such as FAISS or Pinecone), and appending these chunks to the LLM's prompt. This ensures that the generated output is conditioned directly on the retrieved source material.

While standard question-answering RAG pipelines are effective for short queries, complex analysis tasks—such as summarizing academic papers or comparing medical reports—often require multiple distinct angles of analysis. For instance, an academic paper analyzer might generate three distinct summaries:
1. A detailed academic breakdown focusing on methodology and contributions.
2. An implementation-oriented summary focusing on software architecture, hyperparameters, and reproducibility.
3. An aspect-oriented review analyzing novelty, technical rigor, clarity, and overall verdict.

Generating these summaries sequentially requires three consecutive API requests. Under typical network latencies and generation times, this process can take 15 to 30 seconds. To improve user experience, developer teams seek to run these requests concurrently using asynchronous constructs like `asyncio.gather`. 

However, concurrent execution poses a severe challenge when interacting with API providers (such as Groq, OpenAI, or Anthropic), which enforce strict rate-limiting policies. Groq's free-tier API, for example, imposes low limits on both Requests Per Minute (RPM) and Tokens Per Minute (TPM). Simultaneously launching three intensive prompt analyses of a 6,000-character text easily triggers a HTTP 429 (Too Many Requests) error. If the client does not gracefully handle these errors, the entire generation process fails.

This paper evaluates a hybrid client-side concurrency control system. We implement a semaphore-based throttling mechanism that allows a controlled level of concurrency (e.g., maximum of 2 active requests) combined with individual, localized exponential backoff retry logic. By decoupling the rate-limit handling per-request and capping the concurrent request volume, we achieve substantial speedups compared to sequential execution while maintaining high robustness against transient rate-limit errors.
"""

# Trackers for metrics
class TimingAndTrackingWrapper:
    def __init__(self, target_llm):
        self.target_llm = target_llm
        self.call_count = 0
        self.retry_count = 0
        self.error_count = 0

    async def ainvoke(self, prompt, *args, **kwargs):
        self.call_count += 1
        try:
            resp = await self.target_llm.ainvoke(prompt, *args, **kwargs)
            return resp
        except Exception as e:
            # Check for rate limits (429 or rate_limit)
            if "429" in str(e) or "rate_limit" in str(e).lower():
                self.retry_count += 1
            else:
                self.error_count += 1
            raise

    def invoke(self, *args, **kwargs):
        return self.target_llm.invoke(*args, **kwargs)

# Mock LLM for dry-runs
class MockLLMResponse:
    def __init__(self, prompt):
        # Determine the label based on prompt content
        if "comprehensive academic breakdown" in prompt:
            label = "detailed"
        elif "implementation perspective" in prompt:
            label = "code_based"
        elif "evaluate this paper as a peer reviewer" in prompt:
            label = "aspect_oriented"
        else:
            label = "unknown"
        self.content = f"Mocked summary response content for label: {label}."

class MockLLM:
    def __init__(self, simulate_rate_limit=False):
        self.simulate_rate_limit = simulate_rate_limit
        self.failed_labels = set()

    async def ainvoke(self, prompt, *args, **kwargs):
        # Identify label for rate-limit simulation
        label = "unknown"
        if "comprehensive academic breakdown" in prompt:
            label = "detailed"
        elif "implementation perspective" in prompt:
            label = "code_based"
        elif "evaluate this paper as a peer reviewer" in prompt:
            label = "aspect_oriented"

        # Simulating a single 429 rate limit error for code_based if requested
        if self.simulate_rate_limit and label == "code_based" and label not in self.failed_labels:
            self.failed_labels.add(label)
            print(f"   [Mock LLM] Simulating 429 Rate Limit on '{label}' to test backoff & recovery...")
            raise Exception("Mock 429: Too Many Requests (Rate Limit Sim)")

        # Mock standard latency (2 seconds)
        await asyncio.sleep(2)
        return MockLLMResponse(prompt)

    def invoke(self, *args, **kwargs):
        class MockResponse:
            content = "Mock response"
        return MockResponse()

async def generate_summary_sequential(text: str) -> dict:
    """Generate structured summary sequentially (original pre-fix implementation)."""
    from app.rag_system import get_llm, _get_prompts
    llm = get_llm()
    prompts = _get_prompts()
    truncated = text[:6000]

    async def _invoke_with_retry(prompt_text, label, max_retries=3):
        """Invoke LLM with exponential backoff on rate limit errors (no semaphore)."""
        for attempt in range(max_retries):
            try:
                resp = await llm.ainvoke(prompt_text)
                return resp
            except Exception as e:
                if "429" in str(e) or "rate_limit" in str(e).lower():
                    wait = (attempt + 1) * 15  # 15s, 30s, 45s
                    print(f"⏳ Rate limited on {label}, retrying in {wait}s (attempt {attempt+1}/{max_retries})")
                    await asyncio.sleep(wait)
                else:
                    raise
        # Final attempt — let it raise if it fails
        return await llm.ainvoke(prompt_text)

    # Run sequentially with 5s pause in between
    detailed_resp = await _invoke_with_retry(
        prompts["detailed"].format(context=truncated), "detailed"
    )
    await asyncio.sleep(5)  # Brief pause between calls

    code_based_resp = await _invoke_with_retry(
        prompts["code_based"].format(context=truncated), "code_based"
    )
    await asyncio.sleep(5)

    aspect_oriented_resp = await _invoke_with_retry(
        prompts["aspect_oriented"].format(context=truncated), "aspect_oriented"
    )

    return {
        "success": True,
        "detailed": detailed_resp.content,
        "code_based": code_based_resp.content,
        "aspect_oriented": aspect_oriented_resp.content,
        "summary": detailed_resp.content
    }

async def run_benchmark():
    parser = argparse.ArgumentParser(description="Benchmark RAG summary generation concurrency.")
    parser.add_argument("--dry-run", action="store_true", help="Use Mock LLM instead of real Groq API.")
    parser.add_argument("--simulate-rate-limit", action="store_true", help="Simulate a 429 error in dry-run mode.")
    parser.add_argument("--file", type=str, help="Path to a PDF or text file to use as the input paper.")
    parser.add_argument("--runs", type=int, default=3, help="Number of benchmark iterations to run for each approach.")
    parser.add_argument("--delay", type=int, default=20, help="Seconds to delay between runs to avoid compounding rate limits (skipped/shortened in dry-run).")
    args = parser.parse_args()

    print("==================================================")
    print("🚀 STARTING SUMMARY CONCURRENCY BENCHMARK")
    print(f"📅 Timestamp: {datetime.now().isoformat()}")
    print(f"⚙️ Mode: {'DRY RUN (Mocked LLM)' if args.dry_run else 'REAL RUN (Groq API)'}")
    if args.dry_run and args.simulate_rate_limit:
        print("⚠️ Simulating a transient 429 rate limit error in dry run.")
    print("==================================================")

    # 1. Load input text
    text = FALLBACK_TEXT
    if args.file:
        if not os.path.exists(args.file):
            print(f"❌ Specified file not found: {args.file}. Falling back to default abstract.")
        else:
            ext = os.path.splitext(args.file)[1].lower()
            if ext == ".pdf":
                try:
                    from app.pdf_processor import PDFProcessor
                    processor = PDFProcessor()
                    text = processor.extract_text(args.file)
                    print(f"📄 Successfully loaded PDF: {args.file} ({len(text)} characters)")
                except Exception as e:
                    print(f"❌ Failed to extract PDF text: {e}. Falling back to default abstract.")
            else:
                try:
                    with open(args.file, "r", encoding="utf-8") as f:
                        text = f.read()
                    print(f"📄 Successfully loaded text file: {args.file} ({len(text)} characters)")
                except Exception as e:
                    print(f"❌ Failed to read text file: {e}. Falling back to default abstract.")
    else:
        print("📄 Using fallback research paper text (default abstract).")

    # Import the concurrent generation method
    from app.rag_system import rag_system

    # Setup the monkeypatch function to control get_llm
    import app.rag_system
    original_get_llm = app.rag_system.get_llm

    def setup_benchmarked_llm():
        if args.dry_run:
            base_llm = MockLLM(simulate_rate_limit=args.simulate_rate_limit)
        else:
            base_llm = original_get_llm()
        tracker = TimingAndTrackingWrapper(base_llm)
        app.rag_system.get_llm = lambda: tracker
        return tracker

    results = {
        "sequential": {"times": [], "success_count": 0, "retry_count": 0, "error_count": 0},
        "concurrent": {"times": [], "success_count": 0, "retry_count": 0, "error_count": 0}
    }

    # Helper function to run the benchmark steps
    async def measure_approach(name, func):
        print(f"\n--- Running Benchmark for: {name.upper()} ---")
        for run_idx in range(args.runs):
            print(f"▶️ Run {run_idx + 1}/{args.runs}...")
            
            # Setup fresh tracker for this run
            tracker = setup_benchmarked_llm()
            
            # Measure time
            start = time.perf_counter()
            try:
                summary_data = await func(text)
                elapsed = time.perf_counter() - start
                
                # Double check return format
                expected_keys = {"success", "detailed", "code_based", "aspect_oriented", "summary"}
                if not expected_keys.issubset(summary_data.keys()):
                    print(f"   ⚠️ Warning: return dict keys missing. Got: {list(summary_data.keys())}")
                
                results[name]["times"].append(elapsed)
                results[name]["success_count"] += 1
                print(f"   ✅ Completed in {elapsed:.2f}s (calls={tracker.call_count}, retries={tracker.retry_count}, errors={tracker.error_count})")
            except Exception as e:
                elapsed = time.perf_counter() - start
                results[name]["error_count"] += 1
                print(f"   ❌ Failed after {elapsed:.2f}s with error: {e}")

            # Keep track of aggregated retries
            results[name]["retry_count"] += tracker.retry_count
            
            # Sleep between iterations to avoid hitting rate limits
            if run_idx < args.runs - 1:
                sleep_time = 0.1 if args.dry_run else args.delay
                if sleep_time > 0:
                    print(f"   😴 Sleeping {sleep_time}s to cool down API...")
                    await asyncio.sleep(sleep_time)

    # 2. Run Sequential Approach
    await measure_approach("sequential", generate_summary_sequential)

    # Sleep between sequential and concurrent stages
    inter_stage_sleep = 0.1 if args.dry_run else args.delay
    if inter_stage_sleep > 0:
        print(f"\n😴 Sleeping {inter_stage_sleep}s between stages to cool down API...")
        await asyncio.sleep(inter_stage_sleep)

    # 3. Run Concurrent Approach
    await measure_approach("concurrent", rag_system.generate_summary)

    # Restore the original get_llm in app.rag_system to be clean
    app.rag_system.get_llm = original_get_llm

    # 4. Calculate Stats
    stats = {}
    for name in ["sequential", "concurrent"]:
        times = results[name]["times"]
        if times:
            stats[name] = {
                "min": min(times),
                "max": max(times),
                "mean": statistics.mean(times),
                "median": statistics.median(times),
                "success_count": results[name]["success_count"],
                "retry_count": results[name]["retry_count"],
                "error_count": results[name]["error_count"]
            }
        else:
            stats[name] = {
                "min": 0, "max": 0, "mean": 0, "median": 0,
                "success_count": 0, "retry_count": 0, "error_count": 0
            }

    # Calculate Speedup
    seq_mean = stats["sequential"]["mean"]
    con_mean = stats["concurrent"]["mean"]
    if seq_mean > 0:
        speedup = (seq_mean - con_mean) / seq_mean * 100
        speedup_str = f"{speedup:.1f}% faster" if speedup >= 0 else f"{abs(speedup):.1f}% slower"
    else:
        speedup = 0.0
        speedup_str = "N/A"

    # 5. Output ASCII Table
    print("\n" + "=" * 65)
    print("📊 BENCHMARK SUMMARY RESULTS")
    print("=" * 65)
    print(f"{'Approach':<12} | {'Min':<8} | {'Max':<8} | {'Mean':<8} | {'Median':<8} | {'Speedup':<15}")
    print("-" * 65)
    
    seq_stats = stats["sequential"]
    con_stats = stats["concurrent"]
    
    print(f"{'Sequential':<12} | {seq_stats['min']:>6.1f}s | {seq_stats['max']:>6.1f}s | {seq_stats['mean']:>6.1f}s | {seq_stats['median']:>6.1f}s | {'baseline':<15}")
    print(f"{'Concurrent':<12} | {con_stats['min']:>6.1f}s | {con_stats['max']:>6.1f}s | {con_stats['mean']:>6.1f}s | {con_stats['median']:>6.1f}s | {speedup_str:<15}")
    print("=" * 65)
    
    # Detail on retries/errors
    print(f"Sequential: {seq_stats['success_count']} successes, {seq_stats['retry_count']} retries, {seq_stats['error_count']} errors")
    print(f"Concurrent: {con_stats['success_count']} successes, {con_stats['retry_count']} retries, {con_stats['error_count']} errors")
    print("=" * 65)

    # 6. Save JSON Report
    report_data = {
        "timestamp": datetime.now().isoformat(),
        "config": {
            "dry_run": args.dry_run,
            "simulate_rate_limit": args.simulate_rate_limit,
            "runs": args.runs,
            "delay": args.delay
        },
        "results": {
            "sequential": {
                "times": results["sequential"]["times"],
                **stats["sequential"]
            },
            "concurrent": {
                "times": results["concurrent"]["times"],
                **stats["concurrent"]
            }
        },
        "speedup_percentage": speedup
    }

    report_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "benchmark_results.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report_data, f, indent=2)
    print(f"\n💾 Raw results written to: {report_path}\n")

if __name__ == "__main__":
    asyncio.run(run_benchmark())
