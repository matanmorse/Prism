import { useModal } from "../contexts/ModalContext";
import Settings from "../pages/Settings";

const NoEmulatorModal = ({fileExtension}) => {

    const {showModal, hideModal} = useModal();
    return (
    <div className="no-emulator-modal">
        <h2>No emulator configured</h2>
        <p>No configured emulator was found for <strong>.{fileExtension}</strong> files. Set one up to launch this game.</p>
        <div className="modal-buttons">
            <button className="btn btn-danger btn-lg" onClick={hideModal}>Cancel</button>
            <button className="btn btn-primary btn-lg" onClick={() => {hideModal(); showModal(<Settings />);  }}>
                Go to Settings
            </button>
        </div>
    </div>
    )
}

export default NoEmulatorModal;