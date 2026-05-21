import { useState } from 'react'
import '../styles/GameCard.css'
import {BeatLoader, ClipLoader, MoonLoader} from 'react-spinners'
import { Loader, PlayCircleIcon } from 'lucide-react'
import { useEffect } from 'react'
import EmulatorIconList from './library/EmulatorIconList'
import { useModal } from '../contexts/ModalContext'
import NoEmulatorModal from '../modals/NoEmulatorModal'
import { useLibrary } from '../contexts/LibraryContext'
import CheckGameConfiguredEmulator, { allConfiguredEmulators } from '../utils/gameUtil.js'
import SelectEmulatorModal from '../modals/SelectEmulatorModal.jsx'
import useFocus from '../hooks/useFocus.jsx'

const GameCard = ({game, size=1}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [supportedEmulators, setSupportedEmulators] = useState([]);
    const [hasConfiguredEmulator, setHasConfiguredEmulator] = useState(true); /* has an exe been properly configured for an emulator that supports this? */
    const [isHover, setIsHover] = useState(false)
    const {ref, focused} = useFocus({
        focusKey: game.path,
        onFocus: () => {
            ref.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',    // vertical: only scroll if not visible
                inline: 'center',    // horizontal: center the card
            })
        },
        onEnterPress: () => launchGame()})

    const { showModal, hideModal } = useModal();
    const { libraryFilter, titleSearch, hasConfigToggle, fetchGames } = useLibrary();
    const fileExtension = game.path.split('.').at(-1);
     

    /* Generic launch */
    const launchGame = async () => {
        /* Show error if no emulators configured */
        if (!hasConfiguredEmulator) {    
            showModal(
            <NoEmulatorModal 
                fileExtension={fileExtension}
                hideModal={hideModal}
            />); 
            return;
        }
        /* If >1 emulator supported for this file type, open modal to allow the user to choose emulator to launch with */
        if (supportedEmulators.length > 1 && !game.preferred_emulator) {
            showModal(<SelectEmulatorModal 
                    romPath={game.path}
                    onConfirm={launchWithEmulator}
                    doLaunch={true}
                />
            )
            return;
        }
        setIsLoading(true);    
        try {
            await window.launchGameService.launchGame(game.path)
        }
        catch (error) {
            console.log(`[${game.title} Card] Error Launching`)
        }
        fetchGames()
        setIsLoading(false);
    } 
    
    /* Launch with a specific emulator */
    const launchWithEmulator = async (emulator, remember) => {
        console.log (`[${game.title} Card] Launching with ${emulator}`)
        setIsLoading(true)
        await window.launchGameService.launchGame(game.path, emulator, remember)
        setIsLoading(false)
        hideModal()
        fetchGames() // if remember is ticked, games config changes, so we need to refetch.
    }

    /* Get supported emulators based on file extension from configService & determine if any supported emulators are configured */
    useEffect(() => {
        CheckGameConfiguredEmulator(fileExtension).then(setHasConfiguredEmulator);
        window.configService.getSupportedEmulators(fileExtension).then(setSupportedEmulators);
    }, [fileExtension, hasConfigToggle]);

    if (!game 
        || (libraryFilter === 'needs_config' && hasConfiguredEmulator) 
        || (libraryFilter === 'playable' && !hasConfiguredEmulator)
        || !game.title.toLowerCase().includes(titleSearch.toLowerCase())
    ) return; // don't render until game has finished fetching or if it is filtered out
    else return (
    <>
        <div className={`game-card-wrapper ${focused ? 'focused' : ''}`}
            style={{'--game-card-size':`${size * 180}px`}}
            onMouseEnter={() => setIsHover(true)} 
            onMouseLeave={() => setIsHover(false)}
            onClick={launchGame}
            data-title={game.name}
            ref={ref}
        >
            <div className={`invis-box ${isHover && 'visible'}`}>
                <EmulatorIconList emulatorNameList={game.preferred_emulator ? [game.preferred_emulator] : supportedEmulators}/>
            </div>
            <div className="game-card-image-wrapper" style={{backgroundImage: `url(${game.coverArt})`}}>
                {isLoading && <ClipLoader className="game-card-loader" size={60} color='blue'/>}
            {!game.name && <p style={{textWrap:'wrap', wordBreak: 'break-word'}}>{game.path}</p>}
            </div>
        </div>
    </>
    )
}

export default GameCard;