import squirrelStartup from 'electron-squirrel-startup';
if (squirrelStartup) app.quit();

import {app, BrowserWindow, ipcMain} from 'electron'
import { fileURLToPath } from 'url';
import path from 'node:path'
import { selectExe, selectRomFolder, getGames, removeGame } from './services/fileService.js';
import { doEmulatorAutoScan, doRomAutoScan } from './services/scanService.js';
import { launchGame } from './services/launchGameService.js';
import { getEmulatorsConfig, getSupportedEmulators, hasSettings, isDev, resetRomFolderPath, resetSettings, setPreferredEmulator } from './services/configService.js'
import { AutoInstallAndConfigure } from './services/autoInstallService.js'
import dotenv from 'dotenv'
import startup from 'electron-squirrel-startup'; 
import { getMetadata, metadataCache } from './services/metadataService.js';
import withCache, { clearCache } from './caching.js';
import { clearCache as clearCacheDebug, clearRoms } from './services/debugService.js';
import { updateElectronApp } from 'update-electron-app';

dotenv.config({quiet: true})

if (app.isPackaged || process.env.FORCE_UPDATE_CHECK) {
    console.log('!!UPDATING APP!!')
    updateElectronApp()
}

if (startup) {app.quit()}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let win;
const createWindow = () => {
    // TODO: Open to window size
    win = new BrowserWindow({
        title: 'Prism',
        show: false,
        width: 1440,
        height: 850,
        frame:false,
        icon: path.join(__dirname, 'resources', 'prism-icon-64px.ico'),
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.maximize(); // start maximized
    win.focus()

    if (isDev()) win.loadURL('http://localhost:5173');
    else win.loadFile(path.join(__dirname, './renderer/dist/index.html'))
}

app.whenReady().then(() => {
    app.setAppUserModelId('Prism');
    createWindow();
    const handleIpc = (channel, handler) => {
        ipcMain.handle(channel, async (event, ...args) => {
            try {
                return { data: await handler(event, ...args), error: null };
            } catch (error) {
                console.log(error)
                return { data: null, error: error.message || 'An error occurred', stack: error.stack};
            }
        });
    };
    
    handleIpc('ping', () => 'hello from main')
    handleIpc('readFiles', async () => readFiles())
    handleIpc('launchGame', async (event, romPath, emulator, remember) => launchGame(romPath, emulator, remember))
    handleIpc('select-exe', async (event, emulator) => selectExe(emulator))
    handleIpc('get-games', async () => getGames())
    handleIpc('select-rom-folder', async () => selectRomFolder())
    handleIpc('has-settings', () => hasSettings())
    handleIpc('reset-settings', (e, emulator) => resetSettings(emulator))
    handleIpc('get-emulators-config', () => getEmulatorsConfig())
    handleIpc('reset-romfolder', () => resetRomFolderPath())
    handleIpc('autoInstallAndConfigure', async (e, emulatorName) => AutoInstallAndConfigure(emulatorName))
    handleIpc('get-supported-emulators', (e, fileFormat) => getSupportedEmulators(fileFormat))
    handleIpc('clear-cache', (e, key) => clearCacheDebug(key))
    handleIpc('clear-roms', () => clearRoms())
    handleIpc('do-rom-auto-scan', () => doRomAutoScan())
    handleIpc('do-emulator-auto-scan', (e, emulatorName) => doEmulatorAutoScan(emulatorName))
    handleIpc('remove-game', (e, toDeletePath) => removeGame(toDeletePath))
    handleIpc('set-preferred-emulator', (e, romPath, emulatorName) => setPreferredEmulator(romPath, emulatorName))

    handleIpc('window-minimize', () => win.minimize());
    handleIpc('window-maximize', () => {
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
    });
    handleIpc('window-close', () => win.close());

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    win.once('ready-to-show', () => {
        win.show();
        win.focus();
    });
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
