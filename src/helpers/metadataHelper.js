import SGDB from "steamgriddb";
import { metadataClient, metadataCache } from "../services/metadataService.js";
import dotenv from 'dotenv'

dotenv.config({quiet:true})

const SGBDClient = new SGDB(process.env.STEAMGRIDDB_API_KEY ?? "NO_SGDB_KEY_CONFIGURED")

const sanitizeRomName = (filename) => {
    return filename
        .replace(/\.[^.]+$/, '')           // remove extension
        .replace(/\(.*?\)/g, '')           // remove (USA), (Europe), (Rev 1), etc.
        .replace(/\[.*?\]/g, '')           // remove [!], [b], [h], etc.
        .replace(/\s*-\s*(?:Disc|Disk|CD|Side)\s*\w+/gi, '') // remove - Disc 1, etc.
        .replace(/\s*:\s*/, ' ')           // normalize colons
        .replace(/[_]/g, ' ')              // underscores to spaces
        .replace(/\s+/g, ' ')             // collapse whitespace
        .trim();
}

/* Get game lists for multiple systemIds, using caching */
const getGameLists = async (systemIds) => {
    if (!systemIds) return {}
    let gameLists = metadataCache.get(`gameLists`) ?? {};

    const missing = systemIds.filter(id => gameLists[id] === undefined);
    if (missing.length > 0) {
        console.log(`[RAAPI Helper] Getting missing system IDs: `, missing)
        var { data } = await metadataClient.post('/metadata/gamelists', { systemIds: missing });
        gameLists = { ...gameLists, ...data };
        metadataCache.set(`gameLists`, gameLists);
    }

    return systemIds.map(id => gameLists[id]);
}

const getIGBBMetadata = async (title) => {
    const {data} = await metadataClient.post('/metadata/igdb', {title})
    console.log(`[IGDB Helper] Got IGDB Metadata for ${title}`);
    return data;
}

/* use steamgriddb to search for the title, then get the cover art for it */
const getCoverArtFromName = async (title) => {
   const {data} = await metadataClient.post('/metadata/coverart', {title})
   console.log(`[SGDB Helper] Got image for ${title}: ${data}`)
   return data;
}


export {sanitizeRomName, getGameLists, getIGBBMetadata, getCoverArtFromName}