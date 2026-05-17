import { useState, useEffect, use } from 'react'
import {Link} from 'react-router-dom'
import {Clock, Star, Gamepad2} from 'lucide-react'
import {Library as LibraryIcon} from 'lucide-react'
import '../styles/Library.css'
import GameCard from '../components/GameCard'
import LibraryTopbar from '../components/library/LibraryTopbar'
import { useLibrary } from '../contexts/LibraryContext'

function App() {
  const { games, fetchGames } = useLibrary();

  useEffect(() => {fetchGames()}, [])

  return (
    <>
      <div className="library">
        <LibraryTopbar />
        <div className="game-card-grid">
          {games.map((game, index) => (
            <GameCard key={index} game={game}/>
          ))}
        </div>
      </div>
    </>
  )
}

export default App
