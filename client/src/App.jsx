// src/App.jsx
function App() {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">AI Research Paper Analyzer</h1>
        <p className="text-xl mb-8">Upload and analyze research papers with AI-powered insights</p>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>PDF document analysis</li>
            <li>Image-based paper processing</li>
            <li>Q&A with research content</li>
            <li>AI-powered insights</li>
          </ul>
        </div>

        <button className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200">
          Upload Research Paper
        </button>
      </div>
    </div>
  );
}

export default App;
