import { useEffect } from 'react';
import { useLibrary } from '../../contexts/LibraryContext';

import GameCard from '../GameCard';
import { Gamepad2 } from 'lucide-react';

import '../../styles/big_picture/BigPictureLibrary.css'
import { useBigPicture } from '../../contexts/BigPictureContext';
import { useModal } from '../../contexts/ModalContext';

import { useFocusable, FocusContext} from '@noriginmedia/norigin-spatial-navigation-react';
import BigPictureBottombar from '../big_picture/BigPictureBottombar';
import BigPictureTopbar from '../big_picture/BigPictureTopbar';


const BigPictureLibrary = () => {
    const {games, fetchGames} = useLibrary()
    const {ref, focusKey, focusSelf} = useFocusable({focusKey:"LIBRARY_CAROUSEL"});

    useEffect(() => { fetchGames() }, [])

    useEffect(() => {
        if (games.length > 0) focusSelf();
    }, [games.length])

    return (
        <FocusContext.Provider value={focusKey}>
            <div className="bg-dots"></div>
            <div className="big-picture-library">
                <BigPictureTopbar />
                <div className="games-carousel" ref={ref}>
                    {games.map((game,key) => (
                        <GameCard key={game.path} game={game} size={2}/>
                    ))}
                </div>
                <BigPictureBottombar />
            </div>
        </FocusContext.Provider>
    )
}

export default BigPictureLibrary;