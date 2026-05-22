import { useEffect, useRef, useState } from "react";
import { useGamepads } from "react-ts-gamepads";

// TODO: Refactor and refine gamepad movement logic, extract into hooks/helpers
export default function GamepadHandler() {
    const [gamepads, setGamepads] = useState({});
    const holdState = useRef({});
    const prevButtons = useRef({});
    const gamepadsRef = useRef({});

    const INITIAL_DELAY = 400;
    const INITIAL_INTERVAL = 200;
    const MIN_INTERVAL = 80;
    const ACCELERATION = 0.85;
    const MASH_WINDOW = 150; // ms — re-entry within this skips initial delay

    // Keep ref in sync so the effect always sees latest gamepad state
    // without needing to re-run the effect on every gamepad update
    gamepadsRef.current = gamepads;
    useGamepads(gp => setGamepads(gp));

    function navigate(direction) {
        const keyMap = {
            left:  'ArrowLeft',
            right: 'ArrowRight',
            up:    'ArrowUp',
            down:  'ArrowDown',
            enter: 'Enter',
            back:  'Escape',
        };

        window.dispatchEvent(new KeyboardEvent('keydown', {
            key: keyMap[direction],
            bubbles: true,
        }));
    }

    const handleDirectional = (direction, active) => {
        const now = Date.now()
        const state = holdState.current;

        if (!active) {
            if (state[direction]) {
            // record release time, then clear hold
            holdState.current[`${direction}_releasedAt`] = now;
            delete state[direction];
            }
            return;
        }

        if (!state[direction]) {
            navigate(direction);
            const releasedAt = holdState.current[`${direction}_releasedAt`] ?? 0;
            const isMash = (now - releasedAt) < MASH_WINDOW;

            state[direction] = {
            since: isMash ? now - INITIAL_DELAY : now, // skip delay if mashing
            lastFire: now,
            interval: INITIAL_INTERVAL,
            };
            return;
        }

        const hold = state[direction];
        const elapsed = now - hold.since;
        if (elapsed < INITIAL_DELAY) return;

        if (now - hold.lastFire >= hold.interval) {
            navigate(direction);
            hold.lastFire = now;
            hold.interval = Math.max(MIN_INTERVAL, hold.interval * ACCELERATION);
        }
    };

    useEffect(() => {
        let rafId;

        const tick = () => {
        const gp = gamepadsRef.current[0];
        if (!gp) { rafId = requestAnimationFrame(tick); return; }

        const now = Date.now();
        const pressed = (i) => gp.buttons[i]?.pressed;
        const wasPressed = (i) => prevButtons.current[i];

        // One-shot buttons
        if (pressed(2) && !wasPressed(2)) navigate('enter');
        if (pressed(1) && !wasPressed(1)) navigate('back');

        const lx = gp.axes[0] ?? 0;
        const ly = gp.axes[1] ?? 0;
        if (Math.abs(lx) > 0.5) handleDirectional(lx < 0 ? 'left' : 'right', true, now);
        else { handleDirectional('left', false, now); handleDirectional('right', false, now); }
        if (Math.abs(ly) > 0.5) handleDirectional(ly < 0 ? 'up' : 'down', true, now);
        else { handleDirectional('up', false, now); handleDirectional('down', false, now); }

        prevButtons.current = Object.fromEntries(
            gp.buttons.map((b, i) => [i, b.pressed])
        );

        rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []); // runs once — reads live data via refs
}

