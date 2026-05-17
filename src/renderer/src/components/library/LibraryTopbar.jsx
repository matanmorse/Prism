import { useEffect, useRef, useState } from "react";
import { useLibrary } from "../../contexts/LibraryContext";
import hasConfiguredEmulator from "../../utils/gameUtil";

const LibraryTopbar = () => {
    const {libraryFilter, setLibraryFilter, titleSearch, setTitleSearch, games} = useLibrary();
    const [playableGamesCount, setPlayableGamesCount] = useState();
    
    const countPlayableGames = async () => {
        if (!games || games.length === 0) return undefined;

        const results = await Promise.all(
            games
            .filter(Boolean) // exclude undefined entries
            .map(g => hasConfiguredEmulator(g.path.split('.').at(-1)))
        )
        return results.filter(Boolean).length;
    }

    useEffect(() => {countPlayableGames().then(setPlayableGamesCount)}, [games])

    return (
    <div className="library-topbar">
        <div className="search-wrapper">
            <i className="bi bi-search" />
            <input value={titleSearch} onChange={(e) => setTitleSearch(e.target.value)} type="text" className="games-search" placeholder="Search your library..." />
            {<i onClick={()=> setTitleSearch('')} className={`bi bi-x ${titleSearch === '' && 'transparent'}`}></i>}
        </div>
        <div className="library-filters">
            <button className={`btn ${libraryFilter === 'all' ? 'btn-primary selected' : 'btn-ghost'}`} onClick={() => setLibraryFilter('all')}>All {playableGamesCount && `(${games.length})`}</button>
            <button className={`btn ${libraryFilter === 'playable' ? 'btn-primary selected' : 'btn-ghost'}`} onClick={() => setLibraryFilter('playable')}>Playable {playableGamesCount && `(${playableGamesCount})`}</button>
            <button className={`btn ${libraryFilter === 'needs_config' ? 'btn-primary selected' : 'btn-ghost'}`} onClick={() => setLibraryFilter('needs_config')}>Needs Configuration {playableGamesCount && `(${games.length - playableGamesCount})`}</button>
        </div>
    </div>
    )
}

export default LibraryTopbar;