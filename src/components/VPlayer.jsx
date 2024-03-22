import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
// Import only the used icons
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ArrowsPointingInIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid';
import { useVideoContext } from '../context/VideoContext';


const PlaybackSpeedDropdown = memo(({ onChange }) => {
    const speeds = ['0.25x', '0.5x', '0.75x', 'Normal', '1.25x', '1.5x', '1.75x', '2x'];

    const handleChange = useCallback((e) => {
        const value = e.target.value;
        onChange(value === 'Normal' ? 1 : parseFloat(value));
    }, [onChange]);

    return (
        <select className='bg-black' onChange={handleChange}>
            {speeds.map((speed, index) => (
                <option key={index} value={speed}>{speed}</option>
            ))}
        </select>
    );
});

const Vplayer = ({ src }) => {
    const { currentVideo } = useVideoContext();
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMute, setIsMute] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [hoverTime, setHoverTime] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const toggleFullScreen = useCallback(() => {
        // Check if containerRef.current is not null before calling requestFullscreen
        if (containerRef.current) {
            if (!document.fullscreenElement) {
                containerRef.current.requestFullscreen().catch((err) => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }
    }, []);

    useEffect(() => {
        const changeHandler = () => {
            // It's important to check for document.fullscreenElement here, as it's possible
            // for the fullscreen change event to be called when exiting fullscreen as well.
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', changeHandler);

        return () => document.removeEventListener('fullscreenchange', changeHandler);
    }, []);


    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (video.paused || video.ended) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    }, []);

    const toggleMute = useCallback(() => {
        const video = videoRef.current;
        video.muted = !video.muted;
        setIsMute(video.muted);
    }, []);

    const changeVolume = useCallback((e) => {
        const video = videoRef.current;
        video.volume = e.target.value;
        setVolume(video.volume);
    }, []);

    const changePlaybackSpeed = useCallback((speed) => {
        const video = videoRef.current;
        video.playbackRate = speed;
        setPlaybackSpeed(speed);
    }, []);

    const handleProgressClick = useCallback((e) => {
        const progress = progressRef.current;
        const rect = progress.getBoundingClientRect();
        const clickedPos = e.clientX - rect.left;
        const clickedRatio = clickedPos / rect.width;
        const newTime = clickedRatio * duration;
        videoRef.current.currentTime = newTime;
    }, [duration]);

    const handleMouseMove = useCallback((e) => {
        const progress = progressRef.current;
        const rect = progress.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const time = (mouseX / rect.width) * duration;
        setTooltipPosition(mouseX);
        setHoverTime(time);
        setShowTooltip(true);
    }, [duration]);

    const handleMouseLeave = useCallback(() => {
        setShowTooltip(false);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        const updateCurrentTime = () => setCurrentTime(video.currentTime);
        const updateDuration = () => setDuration(video.duration);

        video.addEventListener('timeupdate', updateCurrentTime);
        video.addEventListener('loadedmetadata', updateDuration);

        return () => {
            video.removeEventListener('timeupdate', updateCurrentTime);
            video.removeEventListener('loadedmetadata', updateDuration);
        };
    }, []);

    const formatTime = (seconds) => {
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, "0");
        return hh ? `${hh}:${mm.toString().padStart(2, "0")}:${ss}` : `${mm}:${ss}`;
    };

    const progress = (currentTime / duration) * 100;

    return (
        <div className='border border-blue-500 relative bg-black w-9/10 max-w-[1000px] max-h-[400px] mt-2 flex mx-auto gap-2 group'>
            <div className='absolute left-0 right-0 bottom-0 text-white z-50 opacity-0 transition-opacity duration-150 ease-in-out p-1 group-hover:opacity-100 group-focus-within:opacity-100'>
                <div className="flex justify-between w-full px-5 pt-3">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="relative mx-6 bg-gray-200 rounded-full h-2 mt-2 cursor-pointer" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleProgressClick} ref={progressRef}>
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    {showTooltip && (
                        <div className="absolute -top-8 px-2 py-1 bg-black text-white rounded text-sm" style={{ left: `${tooltipPosition}px`, transform: 'translateX(-50%)' }}>
                            {formatTime(hoverTime)}
                        </div>
                    )}
                </div>
                <div className="flex gap-5 mt-2 p-1 items-center">
                    <button onClick={togglePlay}>
                        {isPlaying && !videoRef.current?.ended ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
                    </button>
                    <button onClick={toggleMute}>
                        {isMute ? <SpeakerXMarkIcon className="h-6 w-6" /> : <SpeakerWaveIcon className="h-6 w-6" />}
                    </button>
                    <input className='cursor-pointer bg-black' type="range" min="0" max="1" step="0.1" value={volume} onChange={changeVolume} />
                    <PlaybackSpeedDropdown onChange={changePlaybackSpeed} />
                    <button onClick={toggleFullScreen}>
                    {isFullScreen ? (
                        <ArrowsPointingInIcon className="h-6 w-6" />
                    ) : (
                        <ArrowsPointingOutIcon className="h-6 w-6" />
                    )}
                </button>
                </div>
            </div>
            <video
                className='w-full'
                ref={videoRef}
                src={currentVideo?.source || src} // Fallback to src prop if currentVideo.source is not available
                onClick={togglePlay}
                autoPlay
            />
        </div>
    );
};

export default Vplayer;
