import { createContext, useContext, useEffect, useState } from 'react';

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
    const [titleSearch, setTitleSearch] = useState('')
    const [libraryFilter, setLibraryFilter] = useState('all')
    const [systemFilters, setSystemFilters] = useState([])
    const [games, setGames] = useState([])

    return (
        <LibraryContext.Provider value={{libraryFilter, setLibraryFilter, systemFilters, setSystemFilters, games, setGames, titleSearch, setTitleSearch}}>
            {children}
        </LibraryContext.Provider>
    );
}

export const useLibrary = () => useContext(LibraryContext);
