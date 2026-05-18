import { useEffect, useReducer, useRef, useState } from "react";
import EmulatorNameAndIcon from "../components/EmulatorNameAndIcon";
import { Rocket, Save } from "lucide-react";
import { useLibrary } from "../contexts/LibraryContext";
import { allConfiguredEmulators } from '../utils/gameUtil.js'
import useGame from "../hooks/useGame.jsx";

/* Modal prompting user to select an emulator to launch a game with */
const SelectEmulatorModal = ({romPath, onConfirm, doLaunch=false}) => {
    const { games } = useLibrary()
    const remember = useRef(null)
    const {game, loading, isConfigured} = useGame(romPath);
    const [selected, setSelected] = useState(game?.preferred_emulator ?? '')

    const launchPressed = () => {
        if (remember.current) onConfirm(selected, remember.current.checked)
        else onConfirm(selected, false)
    }

    useEffect(() => {setSelected(game?.preferred_emulator ?? '')}, [game])

    if (loading) return;
    return (
        <div className="select-emulator-modal">
            <div className="modal-header">
                <h2 className="header-noweight modal-title">Select emulator to launch <span className="text-primary">{game.title}</span>:</h2>
                <p className="text-info" style={{margin: '0rem'}}>Multiple emulators can launch this file type (.{game.fileExtension}).</p>
            </div>
            <div className="emulator-options">
                {game.supportedEmulators.map((e, key) => (
                    <div key={key}>
                        <div className={`emulator-option-wrapper ${selected === e && 'selected'} ${!isConfigured(e) && 'disabled'} `} 
                        onClick={() => setSelected(e)}>
                            <EmulatorNameAndIcon emulatorName={e} size={4}/>
                            {!isConfigured(e) && <p className='text-danger'>Not Configured</p>}
                        </div>
                    </div>
                ))}
            </div>
            <div className="modal-bottom">
                {doLaunch &&                 
                <div className="remember-checkbox" onClick={() => remember.current.checked = !remember.current.checked}>
                    <input type="checkbox" name="remember" ref={remember} onClick={(e) => e.stopPropagation()}/>
                    <label htmlFor="remember">Always use this emulator for {game.title}</label>
                </div>}
                <div></div>
                <button className="btn btn-success" disabled={!selected} onClick={(e) => {e.preventDefault(); launchPressed()}}>
                    {doLaunch ? 
                    (<div className="inside-button">
                        <Rocket /> Launch
                    </div>) : 
                    (<div className="inside-button">
                        <Save /> Save
                    </div>)}
                    
                    </button>
            </div>
        </div>
    )
}

export default SelectEmulatorModal;