import React, { useState } from 'react';
import { useVideoContext } from '../context/VideoContext';
 

const Search = () => {
    const { setCurrentVideo, allVideos } = useVideoContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value) {
      setSuggestions([]);
    } else {
      const filteredSuggestions = allVideos.filter(video =>
        video.title.toLowerCase().startsWith(value.toLowerCase())
      );
      filteredSuggestions.length > 0 ?  setSuggestions(filteredSuggestions) : setSuggestions([{id: 1, title:"no video found"}])
    }
  };

  const handleSelect=(video)=>{
setCurrentVideo(video);
setSuggestions([]);
setSearchTerm('')
  }

  return (
    <form className="max-w-md mx-auto mt-2 relative">   
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full p-4 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search for Video..."
          onChange={handleChange}
          value={searchTerm}
        />
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={()=>handleSelect(suggestion)}>
              {suggestion.title}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default Search;
