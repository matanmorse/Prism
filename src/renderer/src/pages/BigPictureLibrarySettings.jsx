import { FocusContext } from "@noriginmedia/norigin-spatial-navigation";
import useFocus from "../hooks/useFocus";
import { LibrarySquare, ScanSearch } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import GamesTable from "../components/settings/submenus/GamesTable";
import FocusProgressButton from "../components/focus/FocusProgressButton";
import { useLibrary } from "../contexts/LibraryContext";
import { useModal } from "../contexts/ModalContext";
import GameOptionsModal from "../modals/GameOptionsModal";

const GameInfoRow = ({ game }) => {
    const {showModal, hideModal} = useModal()
    const {fetchGames} = useLibrary();
    const openGameSettingsModal = async () => {
        showModal(
            <GameOptionsModal
                romPath={game.path}
                onConfirm={async (selected, remember) => {
                    await window.configService.setPreferredEmulator(game.path, selected)
                    fetchGames()
                    hideModal()
                }}
            />
        )
    }

    const { ref, focusKey, focused } = useFocus(
        {
            focusKey: game.path,
            onFocus: () => {
                ref.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            },
            onEnterPress: openGameSettingsModal
        }
    )

    return (
        <>
            <div className={`game-info-row focusable ${focused ? 'focused' : ''}`} onClick={openGameSettingsModal} ref={ref}>
                <div className="img-wrapper">
                    <img src={typeof(game.coverArt) === 'string' ? game.coverArt : '../../static/images/placeholder.jpg'} />
                </div>
                <div className="game-info">
                    <p className="game-title">{game.name ?? game.path.split('\\').at(-1)}</p>
                    <p className="text-footnote">{game.path.split('\\').at(-1)}</p>
                </div>
            </div>
            <hr />
        </>
    )
}

export default function BigPictureLibrarySettings() {
    const { ref, focusKey, focusSelf } = useFocus({ focusKey: "LIBRARY_SETTINGS_ROOT" })
    const navigate = useNavigate()
    const { fetchGames, games } = useLibrary()
    const {hasModal} = useModal()

    useEffect(() => {        
        const handleKeyDown = (e) => {
            if (e.key !== 'Escape' || hasModal) return;
            navigate('/');
        };

        window.addEventListener('keydown', handleKeyDown);

        return () =>
            window.removeEventListener('keydown', handleKeyDown);
    }, [hasModal]);

    useEffect(() => {fetchGames(); focusSelf()}, [])
    
    const DoAutoScan = async () => {
        await window.scanService.doRomAutoScan()
        fetchGames();
    }

    return (
        <FocusContext.Provider value={focusKey}>
            <div className="bg-dots"></div>
            <div className="background" ref={ref}>
                <div className="big-picture-settings">
                    <div className="settings-title">
                        <LibrarySquare size={35} />
                        <h1>Library</h1>
                    </div>
                    <hr />
                    <div className="library-settings-content">
                        <div className="library-settings-actions">
                            <label>Actions</label>
                            <div className="button-group">
                                <FocusProgressButton type={'primary'} onClick={DoAutoScan}><ScanSearch /> Find Games</FocusProgressButton>
                            </div>
                        </div>
                        <label className="games-label">Games <span className="text-footnote">({games.length})</span></label>
                        <hr />
                        <div className="games-table">
                            {games.map((game, key) => (
                                <GameInfoRow game={game} key={key} />
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </FocusContext.Provider>
    )
}