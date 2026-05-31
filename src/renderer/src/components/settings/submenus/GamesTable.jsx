import { useEffect, useRef, useState } from "react";
import { useLibrary } from "../../../contexts/LibraryContext";
import { Trash, Gamepad } from "lucide-react";
import { useModal } from "../../../contexts/ModalContext";
import GameDeleteModal from "../../../modals/GameDeleteModal";
import SelectEmulatorModal from "../../../modals/SelectEmulatorModal";

const GamesTable = () => {
    const {games, fetchGames} = useLibrary();
    const {showModal, hideModal} = useModal();

    const headerCheckbox = useRef();
    
    const [selectedIds, setSelectedIds] = useState(new Set());

    useState(() => {fetchGames()}, [])
    const toggleSelected = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };
    
    const openGameSettingsModal = async () => {
        const romPath = selectedIds.values().next().value // o_O
        showModal(
        <SelectEmulatorModal
            romPath={romPath}
            onConfirm={async (selected, remember) => {
                await window.configService.setPreferredEmulator(romPath, selected)
                fetchGames()
                hideModal()
            }}
        />
        )
    }

    const handleHeaderClick = (e) => {
        // if indeterminate, remove all checks
        const isIndeterminate = selectedIds.size > 0 && selectedIds.size !== games.length
        if (isIndeterminate || selectedIds.size === games.length) {
            setSelectedIds(new Set())
            headerCheckbox.current.indeterminate = false;
        }
        // if none selected, check all boxes
        if (selectedIds.size === 0) {   
            games.map(g => {
                toggleSelected(g.path)
            });
        }
    }

    /* Set header checkbox to indeterminate when only some entries are selected, or checked when all are */
    useEffect(() => {
        if (!headerCheckbox.current) return;
        
        // clear when nothing selected
        if (selectedIds.size === 0) {
            headerCheckbox.current.indeterminate = false;
            headerCheckbox.current.checked = false;
            return;
        }

        // checked when all selected
        if (selectedIds.size === games.length) {
            headerCheckbox.current.checked = true; 
            headerCheckbox.current.indeterminate = false;
            return;
        }

        // indeterminate when some selected
        headerCheckbox.current.indeterminate = selectedIds.size > 0;;
    }, [selectedIds])

    /* When games are deleted, remove them from the selected IDs list */
    useEffect(() => {
        setSelectedIds(new Set([...selectedIds].filter(x => games.includes(x))))
    }, [games])

    return (
        <>
            <div className="games-table-topbar">
                <h4>Loaded Games ({games.length})</h4>
                <div className="button-group">
                    <button
                    className="btn btn-primary btn-icon"
                    disabled={!(selectedIds.size === 1)}
                    onClick={() => openGameSettingsModal()}>
                        <Gamepad />
                    </button>
                    <button
                    className="btn btn-danger  btn-icon"
                    disabled={!selectedIds.size > 0}
                    onClick={() =>
                    showModal(<GameDeleteModal games={games.filter(g => selectedIds.has(g.path))}/>)}>
                        <Trash />
                    </button>
                </div>

            </div>
            <div className="table-wrapper">
                <table className="table table-striped table-outlind">
                    <thead>
                        <tr>
                            <td style={{width: '20px'}}><input ref={headerCheckbox} type="checkbox" onClick={(e) => handleHeaderClick(e)}/></td>
                            <td>Name</td>
                            <td style={{textAlign: 'right'}}>Released</td>
                        </tr>
                    </thead>
                    <tbody>
                        {games.map((g, key) => {
                            return (
                            <tr key={key}>
                                <td><input type="checkbox" readOnly checked={selectedIds.has(g.path)} onClick={() => toggleSelected(g.path)} /></td>
                                <td>"{g.title}"</td>
                                <td style={{textAlign: 'right'}}>{new Date(g.first_release_date * 1000).toLocaleDateString()}</td>
                            </tr>)
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default GamesTable;