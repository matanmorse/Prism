import {Outlet} from 'react-router-dom'
import settingsIcon from '../../static/icons/settings-cogwheel-button.svg'
import TitleBar from '../components/TitleBar'
import { useEffect, useState } from 'react'
import { useModal } from '../contexts/ModalContext'
import ErrorModal from '../modals/ErrorModal'
import Sidebar from '../components/sidebar/Sidebar'

const DesktopLayout = () => {
    const { showModal, hideModal } = useModal();
    useEffect(() => {
        const handler = (event) => {
            showModal(<ErrorModal message={event.reason.message} hideModal={hideModal} stack={event.reason.stack} />);
        };

        window.addEventListener('unhandledrejection', handler);
        return () => window.removeEventListener('unhandledrejection', handler);
    }, []); 


    return (
        <>
            <TitleBar />
            <div id="root">
                <Sidebar />
                <Outlet />
            </div>
        </>
    )
}

export default DesktopLayout