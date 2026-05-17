import SGDB from "steamgriddb";
import dotenv from 'dotenv';
import { metadataClient } from "../services/metadataService.js";

dotenv.config({quiet: true})
const SGBDClient = new SGDB(process.env.STEAMGRIDDB_API_KEY ?? "NO_SGDB_KEY_CONFIGURED")

/* use steamgriddb to search for the title, then get the cover art for it */
const getCoverArtFromName = async (title) => {
   const {data} = await metadataClient.post('/metadata/coverart', {title})
   console.log(`[SGDB Helper] Got image for ${title}: ${data}`)
   return data;
}

export default getCoverArtFromName