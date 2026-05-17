import { useEffect, useState } from "react";
import useProgress from "../../../hooks/useProgress";
import { useLibrary } from "../../../contexts/LibraryContext";
import GamesTable from "./GamesTable";

const ROMSettingsWindow = () => {
    const {games, fetchGames} = useLibrary();
    const [isScanning, setIsScanning] = useState(false);
    const scanProgress = useProgress(5000, isScanning);

    const DoAutoScan = async (e) => {
        setIsScanning(true)
        e.preventDefault()
        await window.scanService.doRomAutoScan()
        setIsScanning(false);
        fetchGames();
    }
    return (
        <div className="rom-settings">
            <label>Select folders containing ROMs yourself, or use the auto scan feature:</label>
            <div className="auto-install-buttons-wrapper">
                <button 
                className={`btn btn-primary btn-lg ${isScanning && 'btn-disabled btn-installing'}`}
                style={{'--progress': `${scanProgress}%`}} 
                onClick={(e) => DoAutoScan(e)}
                >Auto Scan</button>
                <button className="btn btn-ghost btn-lg">Select folder manually</button>
            </div>
            <GamesTable />
        <div/>
        </div>
    )
}

export default ROMSettingsWindow;