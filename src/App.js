// App.js

import React from 'react';
import Vplayer from './components/VPlayer';
import Playlist from './components/Playlist';
import { VideoProvider } from './context/VideoContext';
import Search from './components/Search';

function App() {
    return (
        <VideoProvider>
          <Search/>
          <div className='flex'>
          <Vplayer src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"/>
            <Playlist/>
          </div>
          
        </VideoProvider>
    );
}

export default App;
