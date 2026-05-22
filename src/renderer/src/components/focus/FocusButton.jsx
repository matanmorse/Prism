import useFocus from '../../hooks/useFocus';

const FocusButton = ({type, size=1, text="", icon=undefined, focusKey, className, onClick, large=false, disabled=false, focusable=true}) => {
    const {focused, thisFocusKey, ref} = useFocus({focusKey: focusKey, onEnterPress:onClick, focusable: focusable});

    return(
        <button className={`btn btn-${type} ${className} focusable ${focused ? 'focused' : ''} ${large ? 'btn-lg' : ""}`} 
        style={{'--button-size': size, borderRadius: '8px'}}
        ref={ref}
        onClick={onClick && onClick}
        disabled={disabled}
        >
        {icon && icon}
        {text}
        </button>
    )
}

export default FocusButton;