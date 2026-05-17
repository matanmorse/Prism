import { createContext, useContext, useEffect, useState } from 'react';

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
    const [titleSearch, setTitleSearch] = useState('')
    const [libraryFilter, setLibraryFilter] = useState('all')
    const [systemFilters, setSystemFilters] = useState([])
    const [games, setGames] = useState([])
    const [hasConfigToggle, setHasConfigToggle] = useState(false);

    /* Get games via IPC */
    const fetchGames = async () => {
        const res = await window.fileService.getGames();
        console.log(res)
        setGames(res)
    }

    return (
        <LibraryContext.Provider value={{libraryFilter, setLibraryFilter, 
        systemFilters, setSystemFilters, 
        games, 
        titleSearch, setTitleSearch, 
        fetchGames,
        hasConfigToggle, setHasConfigToggle,
        }}>
            {children}
        </LibraryContext.Provider>
    );
}

export const useLibrary = () => useContext(LibraryContext);
