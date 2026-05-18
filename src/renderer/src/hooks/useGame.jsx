// hooks/useGame.jsx
import { useState, useEffect } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { allConfiguredEmulators } from '../utils/gameUtil.js';

const useGame = (romPath) => {
    const { games } = useLibrary();
    const [state, setState] = useState({
        game: null,
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!romPath) return;

        const load = async () => {
            const game = games.find(g => g.path === romPath);
            const fileExtension = romPath.split('.').at(-1);

            try {
                const [supported, configured] = await Promise.all([
                    window.configService.getSupportedEmulators(fileExtension),
                    allConfiguredEmulators(fileExtension),
                ]);
                const sorted = supported.sort((a, b) =>
                    configured.some(x => x.name === b) - configured.some(x => x.name === a)
                );
                setState({
                    game: {
                        ...game,
                        fileExtension,
                        supportedEmulators: sorted,
                        configuredEmulators: configured,
                    },
                    loading: false,
                    error: null,
                });
            } catch (err) {
                setState(prev => ({ ...prev, loading: false, error: err }));
            }
        };

        load();
    }, [romPath]);

    const isConfigured = (name) => state.game?.configuredEmulators.some(e => e.name === name) ?? false;

    return { ...state, isConfigured };
};

export default useGame;