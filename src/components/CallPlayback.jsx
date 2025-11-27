import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Download, Share2, Volume2 } from 'lucide-react';

if (!process.env.REACT_APP_API_URL && process.env.NODE_ENV === 'production') {
  throw new Error('❌ CRITICAL: REACT_APP_API_URL environment variable is required in production. Check your .env.production file.');
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Call Playback Component - Audio playback with synchronized transcript
export const CallPlayback = ({ callId }) => {
  const audioRef = useRef(null);
  const [callData, setCallData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [loading, setLoading] = useState(true);
  const [activeTranscriptIdx, setActiveTranscriptIdx] = useState(0);

  useEffect(() => {
    if (callId) {
      fetchCallData();
    }
  }, [callId]);

  const fetchCallData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/calls/${callId}/playback`);
      const data = await res.json();
      setCallData(data);
      if (data.recording_url && audioRef.current) {
        audioRef.current.src = data.recording_url;
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching call data:', error);
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
      // Update active transcript line based on current time
      if (callData?.transcript_timeline) {
        const activeIdx = callData.transcript_timeline.findIndex(
          t => t.timestamp <= audioRef.current.currentTime
        );
        if (activeIdx !== -1) {
          setActiveTranscriptIdx(activeIdx);
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading call data...</div>
      </div>
    );
  }

  if (!callData) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Call data not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">📞 Call Playback</h1>
        <p className="text-gray-600">{callData.phone_from} • {new Date(callData.start_ts).toLocaleString()}</p>
      </div>

      {/* Audio Player */}
      <div className="bg-white rounded-lg border shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-lg">🎵 Recording</h2>
        
        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Player Controls */}
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                setCurrentTime(newTime);
                if (audioRef.current) {
                  audioRef.current.currentTime = newTime;
                }
              }}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-600" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => {
                setVolume(e.target.value);
                if (audioRef.current) {
                  audioRef.current.volume = e.target.value / 100;
                }
              }}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <button className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>

      {/* Transcript Timeline */}
      {callData.transcript_timeline && (
        <div className="bg-white rounded-lg border shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-lg">💬 Transcript Timeline</h2>
          
          <div className="max-h-96 overflow-y-auto space-y-3">
            {callData.transcript_timeline.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = item.timestamp;
                    setCurrentTime(item.timestamp);
                  }
                }}
                className={`p-4 rounded-lg cursor-pointer transition-all border ${
                  idx === activeTranscriptIdx
                    ? 'bg-blue-50 border-blue-300 shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex gap-3">
                  <div className="min-w-fit">
                    <span className="text-xs font-semibold text-gray-600 bg-gray-200 px-2 py-1 rounded">
                      {item.role === 'user' ? '👤 Customer' : '🤖 Agent'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{formatTime(item.timestamp)}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">{item.text}</p>
                    {item.intent && (
                      <p className="text-xs text-blue-600 mt-2">📌 Intent: {item.intent}</p>
                    )}
                    {item.action && (
                      <p className="text-xs text-green-600 mt-2">✓ Action: {item.action}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Call Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Duration</p>
          <p className="text-2xl font-bold mt-1">{formatTime(duration)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Resolution</p>
          <p className="text-2xl font-bold mt-1">{callData.resolved ? '✅ Resolved' : '❌ Escalated'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Automation</p>
          <p className="text-2xl font-bold mt-1">{callData.automation_rate || 0}%</p>
        </div>
      </div>
    </div>
  );
};

export default CallPlayback;
