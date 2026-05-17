import { useEffect, useState } from "react";
import useProgress from "../../../hooks/useProgress";
import { useLibrary } from "../../../contexts/LibraryContext";

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
            <table className="table table-striped table-outlind">
                <caption style={{textAlign: 'left'}}>Loaded Games ({games.length})</caption>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Released</td>
                    </tr>
                </thead>
                <tbody>
                    {games.map((g, key) => {
                        return (
                        <tr key={key}>
                            <td>"{g.title}"</td>
                            <td style={{textAlign: 'right'}}>{new Date(g.first_release_date * 1000).toLocaleDateString()}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        <div/>
        </div>
    )
}

export default ROMSettingsWindow;