import { useState } from "react";
import { useGamepads } from "react-ts-gamepads";

export default function GamepadHandler() {
    const [gamepads, setGamepads] = useState({});
    useGamepads(gp => setGamepads(gp));
    const gp = gamepads[0];

    return(
        <>
        {gp ? (
        <div style={{position: 'fixed', right:'0', padding: '1rem'}}>
            <p>{gp.id}</p>
            <p>A: {gp.buttons[0].pressed ? 'pressed' : '-'}</p>
            <p>Left stick: {gp.axes[0].toFixed(2)}, {gp.axes[1].toFixed(2)}</p>
            <p>Left stick: {gp.axes[2].toFixed(2)}, {gp.axes[5].toFixed(2)}</p>
        </div>) : <p>No gamepad connected</p>}
        </>
    )
}

