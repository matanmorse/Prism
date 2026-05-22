import { getCurrentFocusKey, navigateByDirection, setFocus } from '@noriginmedia/norigin-spatial-navigation';
import useFocus from '../../hooks/useFocus';
import { useEffect } from 'react';

const FocusButton = ({type, size=1, text="", icon=undefined, focusKey, className, onClick, large=false, disabled=false, focusable=true, focusOnBack=undefined, children}) => {
    const {focused, ref} = useFocus({focusKey: focusKey ?? undefined, onEnterPress: onClick, focusable: focusable});
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            console.log(focusOnBack)
            if (getCurrentFocusKey() === focusKey && e.key === 'Escape' && focusOnBack) setFocus(focusOnBack)
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusOnBack]);

    return(
        <button className={`btn btn-${type} ${className} focusable ${focused ? 'focused' : ''} ${large ? 'btn-lg' : ""}`} 
        style={{'--button-size': size, borderRadius: '8px'}}
        ref={ref}
        onClick={onClick && onClick}
        disabled={disabled}
        >
        {icon && icon}
        {children}
        </button>
    )
}

export default FocusButton;