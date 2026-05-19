import { createContext, useContext, useEffect, useState } from 'react';
import '../styles/Modal.css'
import { useBigPicture } from './BigPictureContext';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [modalStack, setModalStack] = useState([]);

    const showModal = (component) => setModalStack(prev => [...prev, component]);
    const hideModal = () => setModalStack(prev => prev.slice(0, -1));
    const hideAll = () => setModalStack([]);

    const {toggle} = useBigPicture()

    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === 'Escape') hideModal(); if (e.key === 'q') toggle() }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <ModalContext.Provider value={{ showModal, hideModal, hideAll }}>
            {children}
            {modalStack.map((modal, i) => (
                <div key={i} className="modal-overlay" style={{ zIndex: 1000 + i }} onClick={hideModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {modal}
                    </div>
                </div>
            ))}
        </ModalContext.Provider>
    );
}

export const useModal = () => useContext(ModalContext);