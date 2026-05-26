import { useEffect, useReducer, useRef, useState } from "react";
import EmulatorNameAndIcon from "../components/EmulatorNameAndIcon";
import { Rocket, Save, Undo, X } from "lucide-react";
import { useLibrary } from "../contexts/LibraryContext";
import hasConfiguredEmulator, { allConfiguredEmulators } from '../utils/gameUtil.js'
import useGame from "../hooks/useGame.jsx";
import useFocus from "../hooks/useFocus.jsx";
import FocusButton from '../components/focus/FocusButton.jsx'
import { FocusContext, setFocus, useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import FocusCheckbox from "../components/focus/FocusCheckbox.jsx";

const EmulatorSelectOption = ({ name, setSelected, selected, isConfigured }) => {
    const { focusKey, focused, ref } = useFocus({ focusKey: name, focusable: isConfigured(name), onEnterPress: () => setSelected(name) })

    return (
        <div ref={ref} className={`emulator-option-wrapper ${selected === name && 'selected'} focusable ${focused ? 'focused' : ''} ${!isConfigured(name) && 'disabled'}`}
            onChttps://www.mechanize.work/blog/life-after-work/lick={() => setSelected(name)}
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}

            >
            <EmulatorNameAndIcon emulatorName={name} size={6} vertical={true} />
            {!isConfigured(name) ? <span className="pill pill-danger">Not Configured</span> : <span className="pill pill-success">Configured</span>}
        </div>
    )
}

/* Modal prompting user to select an emulator to launch a game with */
const GameOptionsModal = ({ romPath, onConfirm, doLaunch = false }) => {
    const { games } = useLibrary()

    const { game, loading, isConfigured } = useGame(romPath);
    const [selected, setSelected] = useState(game?.preferred_emulator ?? '')

    const remember = useRef(null)
    const previousFocusKey = useRef(null)
    const { focusKey, focusSelf, ref } = useFocus({ focusKey: "GAME_OPTIONS_MODAL" })

    const launchPressed = () => {
        if (remember.current) onConfirm(selected, remember.current.checked)
        else onConfirm(selected, false)
    }

    useEffect(() => { setSelected(game?.preferred_emulator ?? '') }, [game])
    useEffect(() => { focusSelf() }, [loading])

    if (loading) return <FocusContext.Provider value={focusKey}><div ref={ref}></div></FocusContext.Provider>;
    return (
        <FocusContext.Provider value={focusKey}>
            <div className="background">
                <div className="bg-dots"></div>
                <div className="select-emulator-modal">
                    <div className="modal-header" >
                        <div className="img-wrapper">
                            <img src={typeof (game.coverArt) === 'string' ? game.coverArt : "../../static/images/placeholder.jpg"} />
                        </div>
                        <div className="header-right">
                            <div className='title-wrapper'>
                                <h2 className="header-noweight modal-title">{game.title}</h2>
                                <FocusButton type={'success'} disabled={!game.configuredEmulators.length > 0} focusable={game.configuredEmulators.length > 0}><Rocket /> Launch</FocusButton>
                            </div>
                            <p className="text-info">{game.path.split('\\').at(-1)}</p>

                            <div className="pills">
                                <span className="pill pill-success">Playable</span> <span className="pill pill-info">Preferred: Ares</span> <span className="pill pill-neutral">Last Played: 2d ago</span>
                            </div>
                        </div>
                    </div>
                    <hr />

                    <label>Preferred Emulator: </label>
                    <div className="emulator-options">
                        {game.supportedEmulators.map((e, key) => (
                            <EmulatorSelectOption key={key} name={e} setSelected={setSelected} selected={selected} isConfigured={isConfigured} />
                        ))}
                    </div>
                    <hr />

                    <div className="emulator-exe">
                        <label>File Path</label>
                        <div className="exe-path-wrapper">
                            <div className="exe-path">{game.path}</div>
                        </div>
                    </div>
                    <hr />
                    <label>Actions</label>
                    <div className="button-group">
                        <div>
                            <FocusButton type={'ghost'} ><Undo />Reset Preferred Emulator</FocusButton>
                            <FocusButton type={'danger'}> <X /> Remove From Library</FocusButton>
                        </div>
                        <FocusButton icon={<Save />}
                            focusable={!(selected === '')}
                            disabled={selected === ''} type={'success'}
                            onClick={() => onConfirm(selected, remember.current?.checked)}
                            focusKey={'LAUNCH_BUTTON'}> Save </FocusButton>
                    </div>
                </div></div>
        </FocusContext.Provider>
    )
}

export default GameOptionsModal;