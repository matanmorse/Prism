import { useEffect, useState } from "react";
import { useEmulator } from "../../../contexts/SharedContext";
import EmulatorNameAndIcon from "../../EmulatorNameAndIcon"
import ROMSettingsWindow from "./ROMSettingsWindow";
import useProgress from "../../../hooks/useProgress";
import { useLibrary } from "../../../contexts/LibraryContext";

const EditSettingsWindow = ({selectedEmulator, ResetEmulator, SetEmulator, SelectedEmulatorExePath, setUserConfigureManually}) => {
    const {emulators} = useEmulator();
    const [isInstalling, setIsInstalling] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const {refetchEmulators} = useEmulator();
    const autoInstallProgress = useProgress(5000, isInstalling);
    const autoScanProgress = useProgress(3000, isScanning)
    const {hasConfigToggle, setHasConfigToggle} = useLibrary();

    const DoAutoInstallation = async (e) => {    
        setIsInstalling(true);
        e.preventDefault(); e.currentTarget.blur(); // to force style updates
        await window.autoInstallService.autoInstallAndConfigure(selectedEmulator)
        await refetchEmulators();
        setHasConfigToggle(!hasConfigToggle)
        setIsInstalling(false);
    }

    const DoAutoScan = async (e) => {
        setIsScanning(true);
        e.preventDefault(); e.currentTarget.blur()
        await window.scanService.doEmulatorAutoScan(selectedEmulator)
        await refetchEmulators()
        setHasConfigToggle(!hasConfigToggle)
        setIsScanning(false);
    }

    const DoManualSelect = async (e) => {
        e.preventDefault();
        await SetEmulator(e, selectedEmulator)
        setHasConfigToggle(!hasConfigToggle);
    }

    return (
    <form className="settings-form">
        <EmulatorNameAndIcon emulatorName={selectedEmulator} size={4.5} bold={true}/>
        <div className="exe-path-form-wrapper">
            <label>Emulator Executable Path:</label>
            <div className="flex-row">
                <div className="exe-input-wrapper">
                    <div className="input-wrapper">
                        <input type="text" readOnly className={"current-exe-path " + (SelectedEmulatorExePath(selectedEmulator) !== undefined && "text-highlight")}
                        placeholder={ SelectedEmulatorExePath(selectedEmulator) ?? "Click browse to manually configure path for " + selectedEmulator }
                        >
                        </input>
                        <i className="reset-emulator bi bi-x-lg" onClick={(e) => {setHasConfigToggle(!hasConfigToggle); ResetEmulator(e, selectedEmulator)}}></i>
                    </div>
                </div>
                <button className="exe-input-button btn btn-primary" onClick={(e) => {DoManualSelect(e, selectedEmulator)}}><i className="bi bi-folder" style={{fontSize: '16pt'}}></i> Browse</button>
            </div>

            {SelectedEmulatorExePath(selectedEmulator) !== undefined ?
            (<p className="text-info">{selectedEmulator} is correctly configured.</p>) :
            <>
            <p className="text-highlight">{selectedEmulator} has not been configured yet. See below for configuration options: </p>
            <div className="buttons">
                <div className="button-label">

                    <button 
                    className={`btn btn-primary btn-lg ${isInstalling && 'btn-installing btn-disabled'}`}
                    style={{'--progress': `${autoInstallProgress}%`}}
                    disabled={isScanning}
                    onClick={(e) => {DoAutoInstallation(e)}}>Auto Install</button>
                    <p className="text-info">{!isInstalling ? `Automatically install ${selectedEmulator} from the internet` : "Installing..."}</p>
                </div>
                <div className="button-label">
                    <button 
                    className={`btn btn-primary btn-lg ${isScanning && 'btn-installing btn-disabled'}`}
                    style={{'--progress': `${autoScanProgress}%`}}
                    disabled={isInstalling}
                    onClick={(e) => {DoAutoScan(e)}}>Scan for existing</button>
                    <p className="text-info">{isScanning ? "Scanning..." : `Check for an existing ${selectedEmulator} executable on your system`}</p>
                </div>               
                <div className="button-label">
                    <button className="btn btn-primary btn-lg" 
                    onClick={(e) => {DoManualSelect(e)}}
                    disabled={isInstalling || isScanning}>Select .exe manually</button>
                    <p className="text-info">Browse your filesystem and select the {selectedEmulator} executable file</p>
                </div>
            </div>
            </>}
        </div>
    </form>
    )
}

export default EditSettingsWindow