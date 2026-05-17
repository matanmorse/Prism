import { createContext, useContext, useEffect, useState } from 'react';

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
    const [libraryFilter, setLibraryFilter] = useState('all')
    const [systemFilters, setSystemFilters] = useState([])

    return (
        <LibraryContext.Provider value={{libraryFilter, setLibraryFilter, systemFilters, setSystemFilters}}>
            {children}
        </LibraryContext.Provider>
    );
}

export const useLibrary = () => useContext(LibraryContext);
