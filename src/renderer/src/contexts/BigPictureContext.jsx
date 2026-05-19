// contexts/BigPictureContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const BigPictureContext = createContext(null);

export function BigPictureProvider({ children }) {
    const [isBigPicture, setIsBigPicture] = useState(true);
    const toggle = () => setIsBigPicture(p => !p);

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