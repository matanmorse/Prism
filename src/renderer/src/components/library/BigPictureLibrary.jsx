import { useEffect } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';

import GameCard from '../GameCard';
import { Gamepad2, Joystick, LibraryBigIcon, LucideLibrarySquare, Power, PowerCircle, PowerIcon, PowerSquareIcon, UserCircle2, Settings as SettingsIcon } from 'lucide-react';
import PrismIcon from '../PrismIcon'
import Settings from '../../pages/Settings';

import '../../styles/big_picture/BigPictureLibrary.css'
import { useBigPicture } from '../../contexts/BigPictureContext';
import { useModal } from '../../contexts/ModalContext';

const BigPictureLibrary = () => {
    const {games, fetchGames} = useLibrary()
    const {toggle} = useBigPicture()
    const {showModal} = useModal()

    useEffect(() => {fetchGames()}, [])

    return (
        <>
            <div className="bg-dots"></div>
            <div className="big-picture-library">
                <div className="bigpicture-library-topbar">
                    <div className="games-title">
                        <Gamepad2 size={60}/>
                        <h1 className='header-noweight' style={{marginBottom:'.5rem'}}>Games</h1>
                    </div>
                    <div className="topbar-button-group">
                        <button className='btn btn-primary btn-lg'>All</button>
                        <button className='btn btn-ghost btn-lg'>Playable</button>
                        <button className='btn btn-ghost btn-lg'>Needs Configuration</button>
                    </div>
                </div>
                <div className="games-carousel">
                    {games.map((game,key) => (
                        <GameCard key={key} game={game} size={1.75}/>
                    ))}
                </div>
                <div className="big-picture-library-bottombar">
                    <PrismIcon size={4} />
                    <LibraryBigIcon style={{'color': '#e85c4c'}}size={60}/>
                    <UserCircle2 size={60}/>
                    <Gamepad2 size={60}/>
                    <SettingsIcon size={60} onClick={() => showModal(<Settings />)}/>
                    <PowerCircle onClick={toggle} size={60}/>
                </div>
            </div>
        </>
    )
}

export default BigPictureLibrary;