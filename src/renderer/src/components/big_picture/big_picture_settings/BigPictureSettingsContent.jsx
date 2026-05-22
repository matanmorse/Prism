import { Download, FolderCogIcon, ScanSearchIcon, Search, X } from "lucide-react";
import { useEmulator } from "../../../contexts/SharedContext";
import EmulatorIcon from "../../EmulatorIcon";
import EmulatorNameAndIcon from "../../EmulatorNameAndIcon";
import FocusButton from "../../focus/FocusButton";
import { useState } from "react";
import { useLibrary } from "../../../contexts/LibraryContext";
import useProgress from "../../../hooks/useProgress";
import { SpatialNavigation } from "@noriginmedia/norigin-spatial-navigation";

export default function BigPictureSettingsContent({selected}) {
    const {isEmulatorConfigured, refetchEmulators, emulators} = useEmulator()
    const { setHasConfigToggle, hasConfigToggle } = useLibrary();

    const [isInstalling, setIsInstalling] = useState(false)
    const [isScanning, setIsScanning] = useState(false)
    const autoInstallProgress = useProgress(5000, isInstalling);
    const autoScanProgress = useProgress(3000, isScanning)

    const ResetEmulator = async (e) => {
        await window.configService.resetSettings(selected)
        refetchEmulators()
    }

    const DoAutoInstallation = async () => {
        setIsInstalling(true);
        await window.autoInstallService.autoInstallAndConfigure(selected)
        await refetchEmulators();
        setHasConfigToggle(!hasConfigToggle)
        setIsInstalling(false);
    }

    const DoAutoScan = async () => {
        setIsScanning(true);
        await window.scanService.doEmulatorAutoScan(selected)
        await refetchEmulators()
        setHasConfigToggle(!hasConfigToggle)
        setIsScanning(false);
    }

    const DoManualSelect = async () => {
        SpatialNavigation.pause()
        await SetEmulator(selected)
        setHasConfigToggle(!hasConfigToggle);
        SpatialNavigation.resume()
    }

    const SetEmulator = async () => {
        const res = await window.fileService.selectExe(selected)
        refetchEmulators()
    }

    const formatList = (items) => {
        if (!items?.length) return '';
        if (items.length === 1) return items[0];
        if (items.length === 2) return `${items[0]} & ${items[1]}`;
        return `${items.slice(0, -1).join(', ')} & ${items.at(-1)}`;
    }
    const systemNamesFormatted = formatList(emulators?.find(e => e.name === selected)?.systemNames)

    return (
        <>
            <div className="settings-header">
                <div className="icon-wrapper">
                    <EmulatorIcon emulatorName={selected} size={10} />
                </div>
                <div className="emulator-info">
                    <div className="emulator-title header-noweight text-lg text-highlight">{selected}</div>
                    <span className="emulator-systems">{systemNamesFormatted}</span>
                    {isEmulatorConfigured(selected) ? <span className="pill pill-success">Configured</span> : <span className="pill pill-danger">Not Configured</span>}
                </div>
            </div>
            <hr />
            <div className="emulator-exe">
                <label>Executable Path</label>
                <div className="exe-path-wrapper">
                    <div className="exe-path">{emulators?.find(x=>x.name===selected)?.exePath ?? "Not configured"}</div>
                    <FocusButton type={'primary'} onClick={DoManualSelect} icon={<FolderCogIcon />}>Browse</FocusButton>
                </div>
            </div>
            <div className="emulator-settings-actions">
                <label>Actions</label>
                <div className="button-group">
                    <FocusButton type={'primary'} large={true} onClick={DoAutoInstallation} focusKey={'AUTO_INSTALL_BUTTON'} focusOnBack={selected}><Download/> Auto-Install</FocusButton>
                    <FocusButton type={'primary'} large={true} onClick={DoAutoScan} focusKey={'AUTO_SCAN_BUTTON'} focusOnBack={selected}><ScanSearchIcon/> Scan </FocusButton>
                    <FocusButton type={'danger'} large={true} onClick={ResetEmulator} focusKey={'RESET_BUTTON'} focusOnBack={selected}><X/> Reset</FocusButton>
                </div>
            </div>

        </>
    )
}

