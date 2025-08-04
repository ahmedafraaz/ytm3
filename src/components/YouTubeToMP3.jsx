import React, { useState } from 'react';
import { Loader2, Download, Youtube, Music, Headphones, Play } from 'lucide-react';

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;


const extractVideoId = (urlOrId) => {
  try {
    const url = new URL(urlOrId);
    if (url.hostname.includes('youtube.com') && url.searchParams.get('v')) {
      return url.searchParams.get('v');
    } else if (url.hostname.includes('youtu.be')) {
      return url.pathname.split('/')[1];
    }
  } catch {
    return urlOrId;
  }
};

const YouTubeToMP3 = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    const id = extractVideoId(input.trim());
    if (!id) return setError('Please enter a valid YouTube URL or video ID');

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${id}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': API_HOST,
          'x-rapidapi-key': API_KEY
        }
      });

      const data = await res.json();

      if (data.status === 'ok') {
        setResult(data);
      } else {
        setError('Conversion failed. Please try a different video.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error occurred. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-40 h-40 bg-cyan-400 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-400 rounded-full opacity-10 blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Main container */}
        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse scale-110"></div>
                <div className="relative bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full">
                  <Youtube className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-pink-200 to-cyan-200 bg-clip-text text-transparent">
              YouTube to MP3
            </h1>
            <p className="text-xl text-white/80 font-light">
              Transform any YouTube video into high-quality MP3 audio
            </p>
          </div>

          {/* Input section */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Paste your YouTube URL here..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-4 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all text-lg"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Music className="w-5 h-5 text-white/40" />
                    </div>
                  </div>
                  <button
                    onClick={handleConvert}
                    disabled={loading || !input}
                    className="relative group bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 min-w-[140px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-400 rounded-xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative flex items-center gap-3">
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Convert
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-4">
              <p className="text-red-200 text-center flex items-center justify-center gap-2">
                <span className="text-red-300">⚠️</span>
                {error}
              </p>
            </div>
          )}

          {/* Success result */}
          {result && (
            <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl p-6 animate-in slide-in-from-bottom duration-500">
              <div className="flex items-start gap-4">
                <div className="bg-green-500/30 p-3 rounded-full">
                  <Headphones className="w-6 h-6 text-green-200" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    ✨ Ready to Download!
                  </h3>
                  <p className="text-green-200 mb-4 leading-relaxed">
                    {result.title}
                  </p>
                  <a
                    href={result.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    <Download className="w-5 h-5" />
                    Download Your MP3
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Music className="w-8 h-8 text-cyan-300" />
              </div>
              <p className="text-white/80">High Quality Audio</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Download className="w-8 h-8 text-pink-300" />
              </div>
              <p className="text-white/80">Fast Downloads</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Youtube className="w-8 h-8 text-red-300" />
              </div>
              <p className="text-white/80">Any YouTube Video</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeToMP3;