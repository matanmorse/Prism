import { useState, useEffect, use } from 'react'
import {Link} from 'react-router-dom'
import {Clock, Star, Gamepad2} from 'lucide-react'
import {Library as LibraryIcon} from 'lucide-react'
import GameCard from '../GameCard'
import LibraryTopbar from './LibraryTopbar'
import { useLibrary } from '../../contexts/LibraryContext'

function DesktopLibrary() {
  const { games, fetchGames } = useLibrary();

  useEffect(() => {fetchGames()}, [])

  return (
    <>
        <div className="library">
          <div className="bg-dots"></div>
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

export default DesktopLibrary;
