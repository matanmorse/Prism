import { Outlet } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import { useEffect, useState } from "react";
import { useFocusable, FocusContext } from "@noriginmedia/norigin-spatial-navigation-react";
import { useGamepads } from 'react-gamepads';

const BigPictureLayout = () => {
    const {focusKey} = useFocusable({focusKey: "BIGPICTURE_ROOT"})
    const [gamepads, setGamepads] = useState({})
    useGamepads(gamepads => setGamepads(gamepads))
    console.log(gamepads);
    return (
        <>
            <TitleBar />
            <FocusContext.Provider value={focusKey}>
            <div id="root">
                <Outlet />
            </div>
            </FocusContext.Provider>
        </>
    )
}

export default BigPictureLayout;