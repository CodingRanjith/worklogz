import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiPlay, FiClock, FiThumbsUp, FiEye } from 'react-icons/fi';

// IMPORTANT: Replace with your YouTube Data API v3 key
// Get your API key from: https://console.cloud.google.com/apis/credentials
// Enable "YouTube Data API v3" in Google Cloud Console
const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY_HERE';
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

const WorklogzTube = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trendingVideos, setTrendingVideos] = useState([]);
  const searchInputRef = useRef(null);

  // Fetch trending videos on component mount
  useEffect(() => {
    fetchTrendingVideos();
  }, []);

  const fetchTrendingVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${YOUTUBE_API_URL}/videos?part=snippet,statistics&chart=mostPopular&maxResults=20&regionCode=US&key=${YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending videos');
      }
      
      const data = await response.json();
      setTrendingVideos(data.items || []);
      setVideos(data.items || []);
    } catch (err) {
      console.error('Error fetching trending videos:', err);
      setError('Unable to load videos. Please check your API key.');
      // Use mock data for demonstration
      setTrendingVideos(getMockVideos());
      setVideos(getMockVideos());
    } finally {
      setLoading(false);
    }
  };

  const searchVideos = async (query) => {
    if (!query.trim()) {
      setVideos(trendingVideos);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${YOUTUBE_API_URL}/search?part=snippet&maxResults=20&q=${encodeURIComponent(query)}&type=video&key=${YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search videos');
      }
      
      const data = await response.json();
      setVideos(data.items || []);
    } catch (err) {
      console.error('Error searching videos:', err);
      setError('Unable to search videos. Please check your API key.');
      // Use mock data for demonstration
      setVideos(getMockVideos().filter(v => 
        v.snippet.title.toLowerCase().includes(query.toLowerCase())
      ));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchVideos(searchQuery);
  };

  const formatViewCount = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getVideoId = (video) => {
    return video.id?.videoId || video.id;
  };

  const getMockVideos = () => {
    return [
      {
        id: { videoId: 'dQw4w9WgXcQ' },
        snippet: {
          title: 'Sample Video 1 - Technology Trends',
          description: 'Explore the latest technology trends in 2024',
          thumbnails: {
            medium: { url: 'https://via.placeholder.com/320x180?text=Video+1' }
          },
          channelTitle: 'Tech Channel',
          publishedAt: new Date().toISOString()
        },
        statistics: { viewCount: '1234567', likeCount: '12345' }
      },
      {
        id: { videoId: 'jNQXAC9IVRw' },
        snippet: {
          title: 'Sample Video 2 - Programming Tutorial',
          description: 'Learn programming fundamentals',
          thumbnails: {
            medium: { url: 'https://via.placeholder.com/320x180?text=Video+2' }
          },
          channelTitle: 'Code Academy',
          publishedAt: new Date().toISOString()
        },
        statistics: { viewCount: '2345678', likeCount: '23456' }
      },
      {
        id: { videoId: 'kJQP7kiw5Fk' },
        snippet: {
          title: 'Sample Video 3 - Design Tips',
          description: 'UI/UX design best practices',
          thumbnails: {
            medium: { url: 'https://via.placeholder.com/320x180?text=Video+3' }
          },
          channelTitle: 'Design Studio',
          publishedAt: new Date().toISOString()
        },
        statistics: { viewCount: '3456789', likeCount: '34567' }
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white p-2 rounded-lg">
                <FiPlay className="text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">WorklogzTube</h1>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            {selectedVideo ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-video bg-black">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${getVideoId(selectedVideo)}`}
                    title={selectedVideo.snippet?.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {selectedVideo.snippet?.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <FiEye className="text-gray-400" />
                      {formatViewCount(selectedVideo.statistics?.viewCount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiThumbsUp className="text-gray-400" />
                      {formatViewCount(selectedVideo.statistics?.likeCount)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="text-gray-400" />
                      {formatDate(selectedVideo.snippet?.publishedAt)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {selectedVideo.snippet?.channelTitle}
                    </h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedVideo.snippet?.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <FiPlay className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Select a video to start watching</p>
              </div>
            )}
          </div>

          {/* Video List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {searchQuery ? 'Search Results' : 'Trending Videos'}
              </h3>
              
              {error && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 aspect-video rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {videos.map((video, index) => {
                    const videoId = getVideoId(video);
                    return (
                      <div
                        key={videoId || index}
                        onClick={() => setSelectedVideo(video)}
                        className="cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                      >
                        <div className="flex gap-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={video.snippet?.thumbnails?.medium?.url || 'https://via.placeholder.com/320x180'}
                              alt={video.snippet?.title}
                              className="w-40 h-24 object-cover rounded"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                              <FiPlay className="text-white text-xl" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                              {video.snippet?.title}
                            </h4>
                            <p className="text-xs text-gray-600 mb-1">
                              {video.snippet?.channelTitle}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{formatViewCount(video.statistics?.viewCount)} views</span>
                              <span>•</span>
                              <span>{formatDate(video.snippet?.publishedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {!loading && videos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FiSearch className="text-4xl mx-auto mb-2 text-gray-300" />
                  <p>No videos found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorklogzTube;

