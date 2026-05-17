import { createContext, useEffect } from 'react';
import '../styles/Modal.css'
import { useContext } from 'react';
import { useState } from 'react';
const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [modal, setModal] = useState(null);

    const showModal = (component) => setModal(component);
    const hideModal = () => setModal(null);

    // Close modals with escape key
    const handleKeyDown = (e) => { if (e.key === 'Escape' && modal !== null) hideModal();}
    document.addEventListener('keydown', handleKeyDown);

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {modal && (
                <div className="modal-overlay" onClick={hideModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        {modal}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}

export const useModal = () => useContext(ModalContext);