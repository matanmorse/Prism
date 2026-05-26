import PrismIcon from "../PrismIcon";
import '../../styles/Sidebar.css'
import { useEffect, useState } from "react";
import SystemFilters from "./SystemFilters";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../contexts/ModalContext";
import DebugModal from "../../modals/DebugModal";
import Settings from "../../pages/Settings";
import { useLibrary } from "../../contexts/LibraryContext";
import { useBigPicture } from "../../contexts/BigPictureContext";

const Sidebar = () => {
    const { systemFilters, setSystemFilters } = useLibrary();
    const { toggle } = useBigPicture();

    const [selectedOption, setSelectedOption] = useState('all_games')
    const {showModal} = useModal();
    const addSystemFilter = (system) => setSystemFilters([...new Set([...systemFilters, system])])
    const removeSystemFilter = (system) => {
        if (!systemFilters.includes(system)) return;
        setSystemFilters(systemFilters.filter(x => x !== system))
    }
    return (
         <div className="sidebar">
            <div className="logo-box">
                <PrismIcon size={1.5} />
                <h3 className="sidebar-title">Prism</h3>
            </div>
            <div className="sidebar-options-category">
            <h6 className="sidebar-options-title">Library</h6>
            <div className="sidebar-options">
                <div className={`option-icon-group ${selectedOption === 'all_games' && 'selected'}`}
                onClick={() => setSelectedOption('all_games')}>
                    <i className="bi bi-grid-fill"/>
                    <p>All Games</p>
                </div>
                <div className={`option-icon-group ${selectedOption === 'favorites' && 'selected'}`}
                onClick={() => setSelectedOption('favorites')}>
                    <i className="bi bi-star-fill"/>
                    <p>Favorites</p>
                </div>
                <div className={`option-icon-group ${selectedOption === 'recents' && 'selected'}`}
                onClick={() => setSelectedOption('recents')}>
                    <i className="bi bi-clock"/>
                    <p>Recents</p>
                </div>
            </div>
            <hr/>
            <h6 className="sidebar-options-title">Systems</h6>
            <SystemFilters 
                filters={systemFilters}
                addFilter={addSystemFilter}
                removeFilter={removeSystemFilter}
            />
         </div>
        <div className="sidebar-bottom">
            <hr/>
            <div className="option-icon-group settings" onClick={() => toggle()}>
                <i className="bi bi-tv" />
                <h6 className="settings-title">Big Picture</h6>
            </div>
            <div className="option-icon-group settings" onClick={() => showModal(<Settings />)}>
                <i className="bi bi-gear" />
                <h6 className="settings-title">Settings</h6>
            </div>
            <div className="option-icon-group settings" onClick={() => showModal(<DebugModal />)}>
                <i className="bi bi-tools" />
                <h6 className="settings-title">Debug</h6>
            </div>
        </div>
    </div>
    )
}

export default Sidebar;