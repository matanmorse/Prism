import { useFocusable, FocusContext } from '@noriginmedia/norigin-spatial-navigation-react';
import PrismIcon from '../PrismIcon'
import Settings from '../../pages/Settings';
import { UserCircle2, LibraryBigIcon, Settings as SettingsIcon, PowerCircle, Gamepad2, Power } from 'lucide-react'
import { useBigPicture } from '../../contexts/BigPictureContext';
import { useModal } from '../../contexts/ModalContext';
import FocusButton from '../focus/FocusButton';
import { useNavigate } from 'react-router-dom';

const BigPictureBottombar = () => {
    const navigate = useNavigate()
    const { focused, focusKey, ref } = useFocusable({ focusKey: "BOTTOMBAR" })
    const { showModal } = useModal()
    const { toggle } = useBigPicture()

    return (
        <FocusContext.Provider value={focusKey}>
            <div className={`big-picture-library-bottombar focusable ${focused ? 'focused' : ''}`} ref={ref}>
                <FocusButton icon={<PrismIcon size={3.8} />} />
                <FocusButton icon={<LibraryBigIcon style={{ 'color': '#e85c4c' }} size={60} />} />
                <FocusButton icon={<Gamepad2 size={60} />} onClick={() => navigate('/emulator_settings')} />
                <FocusButton icon={<UserCircle2 size={60} />} />
                <FocusButton onClick={() => showModal(<Settings />)} icon={<SettingsIcon size={60} />} />
                <FocusButton onClick={() => toggle()} icon={<PowerCircle size={60} />} />
            </div>
        </FocusContext.Provider>
    )

}

export default BigPictureBottombar;