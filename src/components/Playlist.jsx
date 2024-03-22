import React, { useEffect } from 'react';
import { useVideoContext } from '../context/VideoContext';

const Playlist = () => {
    const { playVideo, allVideos, currentVideo } = useVideoContext();
    useEffect(() => {
        console.log(allVideos[0])
        playVideo(allVideos[0]);
    }, []);

    const handleVideoClick = (index) => {
        console.log("selectVideoClicked", allVideos[index])
        playVideo(allVideos[index]);
    };

    return (
        <div className="w-vw  mx-20 mt-4">
            <h2 className="text-xl align-center font-semibold mb-4">Playlist</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                {allVideos.map((video, index) => (
                    <div
                        key={index}
                        className="border rounded cursor-pointer hover:bg-gray-100"
                        onClick={() => handleVideoClick(index)} // Call handleVideoClick on click
                    >
                        <div className='relative align-center text-white'>
                        <img
                            src={video.thumb}
                            alt={video.title}
                            className="w-full h-48 object-cover rounded-t"
                        />
                       {currentVideo?.id === video.id && <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>Playing</div>}
                        </div>
                        <div className="p-2">
                            <p className="font-semibold">{video.title}</p>
                            <p className="text-gray-500">{video.subtitle}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Playlist;
