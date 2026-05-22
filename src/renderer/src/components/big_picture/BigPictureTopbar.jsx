import { Gamepad2 } from "lucide-react";
import { useFocusable, FocusContext} from '@noriginmedia/norigin-spatial-navigation-react';
import FocusButton from "../focus/FocusButton";
import { useLibrary } from "../../contexts/LibraryContext";

const BigPictureTopbar = () => {
    const {focused, focusKey, ref} = useFocusable({focusKey: "BIGPICTURE_TOPBAR"});
    const {libraryFilter, setLibraryFilter} = useLibrary();

    return (
    <FocusContext.Provider value={focusKey}>
        <div className={`bigpicture-library-topbar`}>
            <div className="games-title">
                <Gamepad2 size={60}/>
                <h1 className='header-noweight' style={{marginBottom:'.5rem'}}>Games</h1>
            </div>
            <div className={`topbar-button-group focusable ${focused ? 'focused' : ""}`} ref={ref}>
                    <FocusButton type={libraryFilter === 'all' ? 'primary selected':'ghost'} large={true} onClick={() => setLibraryFilter('all')}>All</FocusButton>
                    <FocusButton type={libraryFilter === 'playable' ? 'primary selected':'ghost'} large={true} onClick={() => setLibraryFilter('playable')}> Playable </FocusButton>
                    <FocusButton type={libraryFilter === 'needs_config' ? 'primary selected':'ghost'} large={true} onClick={() => setLibraryFilter('needs_config')}>Needs Configuration</FocusButton>
            </div>
        </div>
    </FocusContext.Provider>
    )
}

export default BigPictureTopbar;