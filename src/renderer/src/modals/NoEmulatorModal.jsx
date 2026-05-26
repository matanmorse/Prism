import { useEffect } from "react";
import FocusButton from "../components/focus/FocusButton";
import { useModal } from "../contexts/ModalContext";
import Settings from "../pages/Settings";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { useBigPicture } from "../contexts/BigPictureContext";
import { useNavigate } from "react-router-dom";

const NoEmulatorModal = ({ fileExtension }) => {
    const { showModal, hideModal } = useModal();
    const { isBigPicture } = useBigPicture();
    const navigate = useNavigate();
    
    useEffect(() => { setFocus('NOEMULATOR_MODAL_SETTINGS') }, [])
    return (
        <div className="no-emulator-modal">
            <h2>No emulator configured</h2>
            <p>No configured emulator was found for <strong>.{fileExtension}</strong> files. Set one up to launch this game.</p>
            <div className="modal-buttons">
                <FocusButton
                    type={'danger'}
                    large={true}
                    onClick={hideModal}
                    focusKey={"NOEMULATOR_MODAL_CANCEL"}
                >
                    Cancel
                </FocusButton>
                <FocusButton
                    type={'primary'}
                    large={true}
                    onClick={() => { if (!isBigPicture) { hideModal(); showModal(<Settings />) } else { navigate('/emulator_settings'); hideModal(); }}}
                    text="Settings"
                    focusKey={"NOEMULATOR_MODAL_SETTINGS"}
                >
                    Settings
                </FocusButton>
            </div>
        </div>
    )
}

export default NoEmulatorModal;