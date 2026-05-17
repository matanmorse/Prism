import fs from 'fs/promises'
import {dialog} from 'electron'
import config, { getRomFolderPath, setEmulatorPath, setRomFolderPath } from './configService.js';
import path from 'path';
import os from 'os'
import ElectronStore from 'electron-store';
import withCache from '../caching.js';
import { getMetadata, metadataCache } from './metadataService.js';

const romStore = new ElectronStore()

/* Get games and their associated metadata */
const getGames = async () => {
    // Get roms from store
    var roms = romStore.get('roms', []);    
    console.log(romStore.path);
    // add metadata
    roms = await Promise.all(roms.map(async (rom) => {
        const metadata = await withCache(metadataCache, 'metadata', rom, () => getMetadata(rom))
        return {
            path: rom,
            ...metadata,
        }
    }))
    return roms;
}

/* Remove a game from the library by deleting its entry in the store */
const removeGame = async (toDeletePath) => {
    const normalized = path.normalize(toDeletePath)
    console.log('[File Service] Removing ' + normalized)

    var roms = romStore.get('roms', [])
    if (!roms.includes(normalized)) return;

    roms = roms.filter(r => r && path.normalize(r) !== normalized);
    romStore.set('roms', roms);
}

/* Opens dialog to select ROM folder */
const selectRomFolder = async () => {
    const result = await dialog.showOpenDialog({
        title: 'Select ROM Folder',
        properties: ['openDirectory']
    })    
    setRomFolderPath(result.filePaths[0])
}

/* Opens file dialog to select an exe for the given emulator key */
const selectExe = async (emulatorName) => {
    const result = await dialog.showOpenDialog({
        title: `Select Executable (${emulatorName})`,
        properties: ['openFile', 'showHiddenFiles'],
        filters: [
            {name: 'Executable', extensions: ['exe']}
        ]
    })
    if (!result.filePaths[0]) return;
    setEmulatorPath(emulatorName, result.filePaths[0]);
    return result.filePaths[0]
}

export {
    selectExe,
    selectRomFolder,
    getGames,
    removeGame,
    romStore
}