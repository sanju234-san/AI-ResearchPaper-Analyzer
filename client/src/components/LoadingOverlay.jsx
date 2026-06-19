import React, { useState, useEffect } from 'react';

const LoadingOverlay = ({ uploadProgress, fileName }) => {
  const [stage, setStage] = useState('upload');

  useEffect(() => {
    if (uploadProgress < 25) setStage('upload');
    else if (uploadProgress < 50) setStage('extracting');
    else if (uploadProgress < 75) setStage('analyzing');
    else setStage('finalizing');
  }, [uploadProgress]);

  const stages = {
    upload: { title: 'Uploading Document', icon: '📤', sub: 'Securely transferring your paper' },
    extracting: { title: 'Extracting Content', icon: '📖', sub: 'Parsing document structure' },
    analyzing: { title: 'AI Analysis', icon: '🧠', sub: 'Groq Llama 3 70B processing' },
    finalizing: { title: 'Finalizing', icon: '✨', sub: 'Building vector embeddings' },
  };

  const info = stages[stage];

  return (
    <div className="fixed inset-0 bg-primary/95 backdrop-blur-lg flex items-center justify-center z-50">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-mint/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-mint/40 rounded-full particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              '--duration': `${4 + Math.random() * 4}s`,
              '--delay': `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-lg w-full mx-auto px-8 text-center">
        {/* Central orb */}
        <div className="relative w-40 h-40 mx-auto mb-10">
          <div className="absolute inset-0 rounded-full border-2 border-mint/20 animate-spin" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-3 rounded-full border-2 border-purple/20 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-mint/20 to-purple/20 animate-pulse flex items-center justify-center">
            <span className="text-5xl">{info.icon}</span>
          </div>
        </div>

        {/* Status */}
        <h2 className="font-display text-3xl font-bold text-white mb-2">{info.title}</h2>
        <p className="text-gray-400 mb-2">{info.sub}</p>
        <p className="text-xs text-muted font-mono truncate mb-8">📄 {fileName}</p>

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-gray-400">Analysis Progress</span>
            <span className="text-mint font-mono font-bold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-mint to-mint-dim rounded-full transition-all duration-500 relative"
              style={{ width: `${uploadProgress}%` }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 blur-sm animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stage indicators */}
        <div className="mt-8 grid grid-cols-4 gap-3">
          {Object.entries(stages).map(([key, s], i) => {
            const stageOrder = ['upload', 'extracting', 'analyzing', 'finalizing'];
            const currentStageIndex = stageOrder.indexOf(stage);
            const thisStageIndex = stageOrder.indexOf(key);
            const isActive = thisStageIndex <= currentStageIndex;
            const isCurrent = stage === key;
            return (
              <div key={key} className={`flex flex-col items-center transition-all ${isActive ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs ${
                  isCurrent ? 'bg-mint/20 border border-mint/50 text-mint' :
                  isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-600'
                }`}>
                  {isActive ? '✓' : (i + 1)}
                </div>
                <span className="text-[10px] text-gray-500 capitalize">{key}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 glass-card px-4 py-3">
          <p className="text-xs text-gray-500">
            Powered by <span className="text-mint font-mono">Groq Llama 3 70B</span> — 800B inference tokens/day
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
