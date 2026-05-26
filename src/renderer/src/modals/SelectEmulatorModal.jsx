import { useEffect, useReducer, useRef, useState } from "react";
import EmulatorNameAndIcon from "../components/EmulatorNameAndIcon";
import { Rocket, Save } from "lucide-react";
import { useLibrary } from "../contexts/LibraryContext";
import { allConfiguredEmulators } from '../utils/gameUtil.js'
import useGame from "../hooks/useGame.jsx";
import useFocus from "../hooks/useFocus.jsx";
import FocusButton from '../components/focus/FocusButton.jsx'
import { setFocus, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import FocusCheckbox from "../components/focus/FocusCheckbox.jsx";

const EmulatorSelectOption = ({ name, setSelected, selected, isConfigured }) => {
    const { focusKey, focused, ref } = useFocus({ focusKey: name, focusable: isConfigured(name), onEnterPress: () => setSelected(name) })

    return (
        <div ref={ref} className={`emulator-option-wrapper ${selected === name && 'selected'} focusable ${focused ? 'focused' : ''} ${!isConfigured(name) && 'disabled'}`}
            onClick={() => setSelected(name)}
            >
            <EmulatorNameAndIcon emulatorName={name} size={4} vertical={true} />
            {!isConfigured(name) ? <span className="pill pill-danger">Not Configured</span> : <span className="pill pill-success ">Configured</span>}
        </div>
    )
}

/* Modal prompting user to select an emulator to launch a game with */
const SelectEmulatorModal = ({ romPath, onConfirm, doLaunch = false }) => {
    const { games } = useLibrary()

    const { game, loading, isConfigured } = useGame(romPath);
    const [selected, setSelected] = useState(game?.preferred_emulator ?? '')

    const remember = useRef(null)
    const previousFocusKey = useRef(null)

    const launchPressed = () => {
        if (remember.current) onConfirm(selected, remember.current.checked)
        else onConfirm(selected, false)
    }

    useEffect(() => { setSelected(game?.preferred_emulator ?? '') }, [game])
    useEffect(() => {
        if (!loading && game) {
            setFocus(game.supportedEmulators[0])
        }
    }, [loading])

    if (loading) return;
    return (
        <div className="select-emulator-modal">
            <div className="select-modal-header">
                <h2 className="header-noweight modal-title">Select emulator to launch <span className="text-primary">{game.title}</span>:</h2>
                <p className="text-info" style={{ margin: '0rem' }}>Multiple emulators can launch this file type (.{game.fileExtension}).</p>
            </div>
            <div className="emulator-options">
                {game.supportedEmulators.map((e, key) => (
                    <EmulatorSelectOption key={key} name={e} setSelected={setSelected} selected={selected} isConfigured={isConfigured} />
                ))}
            </div>
            <div className="modal-bottom">
                {doLaunch &&
                    <FocusCheckbox
                        checkboxRef={remember}
                        focusKey={"SELECT_EMULATOR_REMEMBER"}
                        text={`Always use this emulator for ${game.title}`}
                        htmlFor={"remember"}
                    />
                }
                <div></div>
                <FocusButton icon={doLaunch ? <Rocket /> : <Save />}
                    focusable={!(selected === '')}
                    disabled={selected === ''} type={'success'}
                    text={doLaunch ? "Launch" : "Save"}
                    onClick={() => onConfirm(selected, remember.current?.checked)}
                    focusKey={'LAUNCH_BUTTON'} />
            </div>
        </div>
    )
}

export default SelectEmulatorModal;