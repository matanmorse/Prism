import FocusButton from "../components/focus/FocusButton";
import { useModal } from "../contexts/ModalContext";
import Settings from "../pages/Settings";

const NoEmulatorModal = ({ fileExtension }) => {

    const { showModal, hideModal } = useModal();
    return (
        <div className="no-emulator-modal">
            <h2>No emulator configured</h2>
            <p>No configured emulator was found for <strong>.{fileExtension}</strong> files. Set one up to launch this game.</p>
            <div className="modal-buttons">
                <FocusButton
                    type={'danger'}
                    large={true}
                    onClick={hideModal}
                    text="Cancel" />
                <FocusButton
                    type={'primary'}
                    large={true}
                    onClick={() => {hideModal; showModal(<Settings />)}}
                    text="Settings" />
                <button className="btn btn-primary btn-lg" onClick={() => { hideModal(); showModal(<Settings />); }}>
                    Go to Settings
                </button>
            </div>
        </div>
    )
}

export default NoEmulatorModal;