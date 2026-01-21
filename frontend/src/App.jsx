import { useState, useRef } from 'react'
import axios from 'axios'

function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0]
    validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (f) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f)
      setPreview(URL.createObjectURL(f))
      setError(null)
      setResult(null)
    } else {
      setError('Please upload a valid image file.')
    }
  }

  const analyzeImage = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      // Use the environment variable if available, otherwise fallback to localhost
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiUrl}/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setResult(response.data)
    } catch (err) {
      console.error(err)
      setError('Failed to analyze image. Is the backend running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              B
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Babyard<span className="font-light text-gray-400">-Vision</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-wider border border-indigo-100 uppercase">Lite</span>
          </div>
          <a
            href="https://github.com/Vijayarvind10/Babyard"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
            GitHub
          </a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Toast */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-red-900">Analysis Error</h4>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {!preview ? (
          /* Empty State / Upload */
          <div className="max-w-2xl mx-auto text-center mt-12">
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl mb-4">
              AI Landscape <span className="text-indigo-600">Estimation</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10">
              Upload your architectural blueprints to automatically detect and count generic assets using our computer vision prototype.
            </p>

            <div
              className="group relative border-2 border-dashed border-slate-300 rounded-3xl bg-white p-12 transition-all duration-300 hover:border-indigo-500 hover:bg-slate-50/50 hover:shadow-xl hover:shadow-indigo-100 cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute inset-0 bg-indigo-50/0 group-hover:bg-indigo-50/50 rounded-3xl transition-colors duration-300 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Upload Blueprint</h3>
                <p className="text-slate-500">Drag and drop your file here, or click to browse</p>
                <div className="mt-8 flex items-center gap-4">
                  <span className="px-3 py-1 rounded bg-slate-100 text-xs font-semibold text-slate-500">JPG</span>
                  <span className="px-3 py-1 rounded bg-slate-100 text-xs font-semibold text-slate-500">PNG</span>
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Analysis Results</h2>
                <p className="text-slate-500 text-sm mt-1">Found {result ? Object.values(result.summary).reduce((a, b) => a + b, 0) : 0} items in your blueprint</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                >
                  Upload New
                </button>
                {!result && (
                  <button
                    onClick={analyzeImage}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 transition-all flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Run Analysis
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Images Column */}
              <div className="lg:col-span-2 space-y-6">

                {/* Result Image (First if available) */}
                <div className={`relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-slate-900/5 transition-all duration-500 ${result ? 'order-1' : 'order-2 opacity-50 grayscale'}`}>
                  <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/10 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${result ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`}></div>
                    {result ? 'AI Annotated' : 'Pending Analysis'}
                  </div>

                  {result ? (
                    <img src={`data:image/jpeg;base64,${result.annotated_image}`} alt="Analyzed" className="w-full h-auto object-contain bg-slate-800" />
                  ) : (
                    <div className="w-full aspect-video bg-slate-800 flex items-center justify-center text-slate-600 font-medium">
                      Waiting for analysis...
                    </div>
                  )}
                </div>

                {/* Original Image (Secondary) */}
                <div className={`relative rounded-xl overflow-hidden bg-white shadow-lg border border-slate-100 ${result ? 'order-2' : 'order-1'}`}>
                  <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-white/90 backdrop-blur text-slate-600 text-xs font-bold rounded-lg shadow-sm">
                    Original
                  </div>
                  <img src={preview} alt="Original" className="w-full h-auto max-h-96 object-contain bg-slate-50" />
                </div>

              </div>

              {/* Stats Column */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Asset Summary
                  </h3>

                  {!result ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-sm">Run analysis to see asset counts</p>
                    </div>
                  ) : Object.keys(result.summary).length === 0 ? (
                    <div className="p-4 bg-slate-50 rounded-lg text-center text-slate-500 text-sm">
                      No objects detected.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(result.summary).sort((a, b) => b[1] - a[1]).map(([name, count], idx) => (
                        <div key={name} className="group">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-700 capitalize">{name}</span>
                            <span className="text-sm font-bold text-slate-900">{count}</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out group-hover:bg-indigo-600"
                              style={{ width: `${Math.min((count / Object.values(result.summary).reduce((a, b) => Math.max(a, b), 0)) * 100, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}

                      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-end">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total</span>
                        <span className="text-4xl font-extrabold text-slate-900 leading-none">
                          {Object.values(result.summary).reduce((a, b) => a + b, 0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
