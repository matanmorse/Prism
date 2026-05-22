import { useEmulator } from "../../../contexts/SharedContext"
import EmulatorNameAndIcon from '../../../components/EmulatorNameAndIcon'
import { FocusContext, getCurrentFocusKey, navigateByDirection, setFocus, useFocusable } from "@noriginmedia/norigin-spatial-navigation"
import useFocus from "../../../hooks/useFocus"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const FocusEmulatorOption = ({ emulatorName, selected, setSelected }) => {
    const { focusKey, focused, ref } = useFocus({
        focusKey: emulatorName,
        // TODO: Figure out how to extract and reuse this logic. Some problem with passing ref I think.
        onFocus: () => {
            setSelected(emulatorName)
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        },
        onArrowPress: (direction, props, details) => {
            if (direction === 'right') setSelected(emulatorName)
        },
        onEnterPress: () => { setSelected(emulatorName); navigateByDirection('right') },
    })

    const { isEmulatorConfigured } = useEmulator();
    const navigate = useNavigate()

    useEffect(() => {
        const handleKeyDown = (e) => {
            console.log()
            if (getCurrentFocusKey() === emulatorName && e.key === 'Escape') navigate('/')
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className={`emulator-option focusable 
            ${focused ? 'focused' : ''} 
            ${selected === emulatorName ? 'selected' : ''} 
            ${isEmulatorConfigured(emulatorName) ? 'configured' : 'unconfigured'}`}
            ref={ref}>

            <EmulatorNameAndIcon emulatorName={emulatorName} size={5} />
        </div>
    )
}

export default function BigPictureSettingsSidebar({ selected, setSelected }) {
    const { emulators } = useEmulator()
    const { focusKey, ref } = useFocus({ focusKey: "EMULATOR_SETTINGS_SIDEBAR" })
    const firstEmulatorName = emulators?.sort((a, b) => a.prettyName.localeCompare(b.prettyName))[0]?.name;
    const [firstMount, setFirstMounted] = useState(true);

    useEffect(() => { if(firstMount && firstEmulatorName) {setFocus(firstEmulatorName); setFirstMounted(false)}}, [emulators])

    return (
        <FocusContext.Provider value={focusKey}>
            <div className="big-picture-sidebar-padding" ref={ref}>
                <div className="big-picture-sidebar">
                    <div className="emulator-options-list">
                        {emulators.filter(emulator => emulator.prettyName !== 'Rom Folder')
                            .sort((a, b) => a.prettyName.localeCompare(b.prettyName))
                            .map((emulator, key) => (
                                <FocusEmulatorOption emulatorName={emulator.name} selected={selected} setSelected={setSelected} key={key} />
                            ))}
                    </div>
                </div>
            </div>
        </FocusContext.Provider>
    )
}