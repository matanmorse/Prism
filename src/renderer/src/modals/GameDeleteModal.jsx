import { useState } from "react";
import { useLibrary } from "../contexts/LibraryContext";
import { useModal } from "../contexts/ModalContext";
import useProgress from "../hooks/useProgress";

const GameDeleteModal = ({games}) => {
    const { hideModal } = useModal()
    const { fetchGames, setHasConfigToggle, hasConfigToggle } = useLibrary()
    const [isDeleting, setIsDeleting] = useState(false)
    const deletingProgress = useProgress(2000, isDeleting)

    const removeGames = async () => {
        setIsDeleting(true);
        await Promise.all(
            games.map(g => {
                window.fileService.removeGame(g.path)
            })
        )
        await fetchGames()
        setHasConfigToggle(!hasConfigToggle)
        setIsDeleting(false);
        hideModal();
    }

    return (
        <>
        <h3>Remove {games.length} games?</h3>
        <p className='text-info text-sm'>Files are not removed from the computer, just untracked within Prism.</p>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
            {games.map((g, key) => (
                <tr>
                    <td>{g.title}</td>
                </tr>
            ))}
            </tbody>
        </table>
        <div className="button-group">
            <button 
            className={`btn btn-danger btn-lg ${isDeleting && 'btn-deleting'}`}
            style={{'--progress': `${deletingProgress}%`}}
            disabled={isDeleting}
            onClick={removeGames}>Delete</button>
            <button className={`btn btn-lg btn-ghost`} onClick={hideModal}>Cancel</button>
        </div>
        </>
    )
}

export default GameDeleteModal;