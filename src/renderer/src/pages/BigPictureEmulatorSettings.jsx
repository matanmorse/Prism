import '../styles/big_picture/BigPictureSettings.css'
import BigPictureSettingsSidebar from "../components/big_picture/big_picture_settings/BigPictureSettingsSidebar";
import FocusButton from "../components/focus/FocusButton"

import { Settings } from 'lucide-react'
import { FocusContext } from '@noriginmedia/norigin-spatial-navigation';
import useFocus from '../hooks/useFocus';

export default function BigPictureEmulatorSettings() {
    const { focusKey, ref } = useFocus({ focusKey: "EMULATOR_SETTINGS_ROOT" })

    return (
        <FocusContext.Provider value={focusKey}>
            <div className="bg-dots"></div>
            <div className="background">
                <div className="big-picture-settings" ref={ref}>
                    <div className="settings-title">
                        <Settings size={35} />
                        <h1>Emulator Settings</h1>
                    </div>
                    <hr />
                    <div className="sidebar-content-wrapper">
                        <BigPictureSettingsSidebar />
                        <div className="settings-content">
                            <FocusButton type={'primary'} text='Hello' />
                        </div>
                    </div>
                </div>
            </div>
        </FocusContext.Provider>
    )
}