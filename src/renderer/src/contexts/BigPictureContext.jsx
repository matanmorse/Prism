// contexts/BigPictureContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { SpatialNavigation } from '@noriginmedia/norigin-spatial-navigation';

const BigPictureContext = createContext(null);

export function BigPictureProvider({ children }) {
    const [isBigPicture, setIsBigPicture] = useState(true);
    const toggle = () => setIsBigPicture(p => !p);
    useEffect(() => {
        if (isBigPicture) SpatialNavigation.resume()
        else SpatialNavigation.pause() 
    }, [isBigPicture])
    // TODO: sync to electron so main process knows (e.g. to hide titlebar)
    //   useEffect(() => {
    //     window.ipcRenderer?.invoke('set-big-picture', isBigPicture);
    //   }, [isBigPicture]);

    return (
        <BigPictureContext.Provider value={{ isBigPicture, toggle }}>
        {children}
        </BigPictureContext.Provider>
    );
}

export const useBigPicture = () => useContext(BigPictureContext);