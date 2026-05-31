import { Outlet } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import { useEffect, useState } from "react";
import { FocusContext } from "@noriginmedia/norigin-spatial-navigation-react";
import { useGamepads } from 'react-ts-gamepads';
import GamepadHandler from "../components/focus/GamepadHandler";
import useFocus from "../hooks/useFocus";

const BigPictureLayout = () => {
    const {focusKey, ref} = useFocus({focusKey: "BIGPICTURE_ROOT"})

    return (
        <>
            <TitleBar />
            <FocusContext.Provider value={focusKey}>
            <GamepadHandler />
            <div id="root" ref={ref}>
                <Outlet />
            </div>
            </FocusContext.Provider>
        </>
    )
}

export default BigPictureLayout;