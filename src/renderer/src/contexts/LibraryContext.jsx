import { SpatialNavigation } from '@noriginmedia/norigin-spatial-navigation';
import { createContext, useContext, useEffect, useState } from 'react';

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
    const [titleSearch, setTitleSearch] = useState('')
    const [libraryFilter, setLibraryFilter] = useState('all')
    const [systemFilters, setSystemFilters] = useState([])
    const [games, setGames] = useState([])
    const [hasConfigToggle, setHasConfigToggle] = useState(false);
    const [inGame, setInGame] = useState(false);


    /* Get games via IPC */
    const fetchGames = async () => {
        const res = await window.fileService.getGames();
        // console.table(res)
        setGames(res)
    }

    // Pause spatial navigation when game is launched, resume when closed
    useEffect(() => {
        console.log("[Library Context] Setting In Game: " + inGame)
        if (inGame) SpatialNavigation.pause()
        else SpatialNavigation.resume()
    }, [inGame])

    return (
        <LibraryContext.Provider value={{libraryFilter, setLibraryFilter, 
        systemFilters, setSystemFilters, 
        games, 
        titleSearch, setTitleSearch, 
        fetchGames,
        hasConfigToggle, setHasConfigToggle,
        inGame, setInGame
        }}>
            {children}
        </LibraryContext.Provider>
    );
}

export const useLibrary = () => useContext(LibraryContext);
