import { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import '../styles/Modal.css'
import { useBigPicture } from './BigPictureContext';
import { FocusContext, getCurrentFocusKey, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import useFocus from '../hooks/useFocus';

const ModalContext = createContext(null);

// Shell used to draw focus to the modal content when modals are opened
function ModalShell({ children, onClose }) {
    const { ref, focusKey } = useFocus({
        focusKey: 'MODAL',
        isFocusBoundary: true,
    });

    return (
        <FocusContext.Provider value={focusKey}>
            <div id="modal-shell" ref={ref}>
                {children}
            </div>
        </FocusContext.Provider>
    );
}

export function ModalProvider({ children }) {
    const [modalStack, setModalStack] = useState([]);

    const {toggle} = useBigPicture()

    const returnFocusKey = useRef(null) // where to return focus to when the modal is closed

    const showModal = (component) => {
        console.log("SHOWING, SAVING PREVIOUS " + getCurrentFocusKey())
        returnFocusKey.current = getCurrentFocusKey();
        setFocus('MODAL')
        setModalStack(prev => [...prev, component]);
    }

    const hideModal = () => {
        console.log("HIDING, RESTORING TO " + returnFocusKey.current)
        setModalStack(prev => prev.slice(0, -1));
        if (returnFocusKey.current) {
            setFocus(returnFocusKey.current)
            returnFocusKey.current = null
        }
    }
    const hideAll = () => setModalStack([]);

    useEffect(() => {
        const handleKeyDown = (e) => { if (e.key === 'Escape') hideModal(); if (e.key === 'q') toggle() }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <ModalContext.Provider value={{ showModal, hideModal, hideAll }}>
                {children}
                {modalStack.map((modal, i) => (
                    <div key={i} className="modal-overlay" style={{ zIndex: 1000 + i }} onClick={hideModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <ModalShell>
                            {modal}
                        </ModalShell>
                        </div>
                    </div>
                ))}
        </ModalContext.Provider>
    );
}

export const useModal = () => useContext(ModalContext);