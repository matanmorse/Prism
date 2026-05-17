import { buildAuthorization, getGameList } from "@retroachievements/api";
import { metadataCache, metadataClient } from "../services/metadataService.js";
import pLimit from 'p-limit'


const limit = pLimit(1);
// auth for RA_API
const authorization = buildAuthorization({
    username: process.env.RA_API_USER ?? "NO_USER_CONFIGURED",
    webApiKey: process.env.RA_API_KEY ?? "NO_KEY_CONFIGURED",
});

const inFlight = new Map();

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

export default getGameLists;