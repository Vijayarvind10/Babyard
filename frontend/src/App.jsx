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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600 tracking-tight">Babyard-Vision Lite</h1>
          <nav>
            <a href="https://github.com/Vijayarvind10/Babyard" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-indigo-600 transition-colors">GitHub</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* content area */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Display Area */}
          <div className="flex-1 w-full">
            {!preview ? (
              // Drag & Drop Zone
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl bg-white p-12 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all cursor-pointer shadow-sm h-96 flex flex-col items-center justify-center group"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="h-16 w-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Drop blueprint here</h3>
                <p className="text-gray-500 mt-1">or click to upload image</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              // Results View
              <div className="space-y-6">

                {/* Controls */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Analysis Results</h2>
                  <button
                    onClick={reset}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Upload different file
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full mb-3">Original Blueprint</span>
                    <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded overflow-hidden">
                      <img src={preview} alt="Original" className="object-cover w-full h-full" />
                    </div>
                  </div>

                  {/* Processed */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative min-h-[300px] flex flex-col">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-600 text-xs font-semibold rounded-full mb-3">AI Analyzed</span>

                    {loading ? (
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                        <p className="text-gray-500 animate-pulse">Detecting assets...</p>
                      </div>
                    ) : result ? (
                      <div className="aspect-w-4 aspect-h-3 bg-gray-100 rounded overflow-hidden">
                        <img src={`data:image/jpeg;base64,${result.annotated_image}`} alt="Analyzed" className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-300">
                        <div className="text-center">
                          <p className="text-gray-400 text-sm mb-4">Ready to analyze</p>
                          <button
                            onClick={analyzeImage}
                            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                          >
                            Run Analysis
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Sidebar / Stats */}
          {result && (
            <div className="w-full lg:w-80 flex-shrink-0 animate-fade-in-up">
              <div className="bg-white rounded-xl shadow-lg border border-indigo-50 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Summary
                </h3>
                <div className="space-y-3">
                  {Object.keys(result.summary).length === 0 ? (
                    <p className="text-gray-500 italic text-sm">No assets detected.</p>
                  ) : (
                    Object.entries(result.summary).map(([name, count]) => (
                      <div key={name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition-colors">
                        <span className="text-gray-700 capitalize font-medium">{name}</span>
                        <span className="bg-white text-indigo-600 py-1 px-3 rounded-md text-sm font-bold shadow-sm border border-gray-100">{count}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Total Assets</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {Object.values(result.summary).reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
