import { useEffect, useState } from "react"
import useProgress from "../../hooks/useProgress";
import useFocus from "../../hooks/useFocus";
import { getCurrentFocusKey, SpatialNavigation } from "@noriginmedia/norigin-spatial-navigation";

export default function FocusProgressButton ({type, onClick, duration=3000, disabled=false, large=false, focusOnBack, focusKey, children}) {
    const [isProgressing, setIsProgressing] = useState(false);
    const progress = useProgress(duration, isProgressing)
    
    const onClickWrap = async () => {
        SpatialNavigation.pause()
        setIsProgressing(true);
        await onClick();
        setIsProgressing(false)
        SpatialNavigation.resume()
    }

    const { focused, ref } = useFocus({ focusKey: focusKey, onEnterPress: onClickWrap })

    useEffect(() => {
        const handleKeyDown = (e) => {
            console.log(focusOnBack)
            if (getCurrentFocusKey() === focusKey && e.key === 'Escape' && focusOnBack) setFocus(focusOnBack)
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusOnBack]);

    return (
        <button
            className={`btn btn-${type} ${large ? 'btn-lg' : ''} ${isProgressing ? 'btn-installing' : ''} focusable ${focused ? 'focused' : ''}`}
            style={{ '--progress': `${progress}%` }}
            disabled={isProgressing || disabled}
            onClick={onClickWrap}
            ref={ref}
            >{children}</button>
    )
}