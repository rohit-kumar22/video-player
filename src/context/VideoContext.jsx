// VideoContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import mediaJSON from '../data/mediaData';

const VideoContext = createContext();

export const useVideoContext = () => useContext(VideoContext);

export const VideoProvider = ({ children }) => {
    const [allVideos, setAllVideos] = useState(mediaJSON.categories[0].videos)
    const [playlist, setPlaylist] = useState([]);
    const [currentVideo, setCurrentVideo] = useState(null); // Add currentVideo state

    const playVideo = (index) => {
        console.log("called", index);
        setCurrentVideo((prev)=>(prev, index));
         // Set the current video when playing
        console.log("checking....", currentVideo)
    };

    const addToPlaylist = (video) => {
        setPlaylist([...playlist, video]);
    };

    const removeFromPlaylist = (index) => {
        setPlaylist(playlist.filter((_, i) => i !== index));
    };

    // Other functions...

    // Ensure the current video is set when playlist changes
    useEffect(() => {
    //    playlist && setCurrentVideo(playlist[currentVideo]);
       playlist && console.log("xxxx", currentVideo)
    }, [playlist, currentVideo]);

    console.log("context",currentVideo)

    return (
        <VideoContext.Provider
            value={{
                playlist,
                currentVideo, // Provide current video in the context value
                playVideo,
                addToPlaylist,
                removeFromPlaylist,
                allVideos,
                setAllVideos,
                setCurrentVideo
                // other values...
            }}
        >
            {children}
        </VideoContext.Provider>
    );
};

export default VideoContext;
