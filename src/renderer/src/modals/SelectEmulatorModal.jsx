import { useReducer, useRef, useState } from "react";
import EmulatorNameAndIcon from "../components/EmulatorNameAndIcon";
import { Rocket } from "lucide-react";

/* Modal prompting user to select an emulator to launch a game with */
const SelectEmulatorModal = ({emulators, configuredEmulators, game, fileExtension, launchGame}) => {
    const [selected, setSelected] = useState('')
    const remember = useRef(null)
    const isConfigured = (name) => configuredEmulators.some(e => e.name === name)

    const launchPressed = () => {
        console.log(remember.current.checked)
        launchGame(selected, remember.current.checked)
    }

    return (
        <div className="select-emulator-modal">
            <div className="modal-header">
                <h2 className="header-noweight modal-title">Select emulator to launch <span className="text-primary">{game.title}</span>:</h2>
                <p className="text-info" style={{margin: '0rem'}}>Multiple emulators can launch this file type (.{fileExtension}).</p>
            </div>
            <div className="emulator-options">
                {emulators.map((e, key) => (
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
                <div className="remember-checkbox" onClick={() => remember.current.checked = !remember.current.checked}>
                    <input type="checkbox" name="remember" ref={remember} onClick={(e) => e.stopPropagation()}/>
                    <label htmlFor="remember">Always use this emulator for {game.title}</label>
                </div>
                <button className="btn btn-success" disabled={!selected} onClick={(e) => {e.preventDefault(); launchPressed()}}><Rocket /> Launch</button>
            </div>
        </div>
    )
}

export default SelectEmulatorModal;