import {spawn} from 'child_process'
import config, {getEmulatorPath, getPreferredEmulator, getRomFolderPath, hasEmulator, setPreferredEmulator} from './configService.js'
import { get } from 'http'
import { getWin } from '../main.js'

/* Launches a game given ROM path (emulator is inferred from supported file types in the emulators config */
const launchGame = async (romPath, emulator, remember) => {
    return new Promise(resolve => {
        console.log(`Rompath: ${romPath}, Emulator: ${emulator}, Remember: ${remember}`)
        /* Remember emulator preference if client asks us to */
        if (emulator !== undefined && remember) setPreferredEmulator(romPath, emulator)
        if (emulator === undefined) emulator = getPreferredEmulator(romPath);

        // If no emulator was given by client and no preferred is recorded, infer it from file type
        // This should only occur client-side when only 1 valid emulator exists for a file type
        if (emulator === undefined) {
            const fileType = romPath.split('.').at(-1)
            const emulators = getEmulatorsFromExtension(fileType)
            const inferredEmulator = emulators.find(e => hasEmulator(e)); // pick first configured emulator
            emulator = inferredEmulator
            console.log(`[Launch Game Service] Inferred Emulator ${inferredEmulator} for ${romPath}`)
        }
        const perEmulatorCLIArgs = config.emulators.find(x => x.name === emulator).cliArgs || []

        const emulatorPath = getEmulatorPath(emulator)
        if (!emulatorPath) {
            setPreferredEmulator(romPath, undefined) // can occur when preferred emulator is deleted, so correct this
            throw new Error(`${emulator} is not correctly configured. Check settings for more details.`)
        }
        console.log(`[Launch Game Service] Launching game with rom path ${romPath} command ${emulatorPath.split('\\').slice(-1)[0]} ${perEmulatorCLIArgs.join(' ')} ${romPath}`)
        const game = spawn(getEmulatorPath(emulator), [...perEmulatorCLIArgs, romPath])
        
        game.stdout.setEncoding('utf8')

        game.addListener('close', () => {
            console.log(`[From ${emulator}] Game closed`)
            getWin().webContents.send(`${romPath}-in-game`, false)
        })

        game.on('spawn', () => {
            console.log(`[From ${emulator}] Game opened`)
            resolve()
        });

        game.stdout.on('data', (data) => console.log(`[From ${emulator}] ${data}`));
        game.stderr.on('data', (data) => console.error(`[From ${emulator}] ${data}`));


        game.unref();
    })
}

/* Returns all configured emulators that can run this extension*/
const getEmulatorsFromExtension = (extension) => {
    const emulators = [];
    for (const element of config.emulators) {
        if (!element.fileFormats) continue;
        for (const format of element.fileFormats) {
            if (format === extension) {
                emulators.push(element.name);
            }
        }
    }
    return emulators;
}


export {launchGame}