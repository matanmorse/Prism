import { useFocusable} from '@noriginmedia/norigin-spatial-navigation-react';

const Button = ({type, size=1, text="", icon=undefined, focusKey, className, onClick, large=false}) => {
    const {focused, thisFocusKey, ref} = useFocusable({focusKey: focusKey, onEnterPress:onClick});

    return(
        <button className={`btn btn-${type} ${className} focusable ${focused ? 'focused' : ''} ${large ? 'btn-lg' : ""}`} 
        style={{'--button-size': size, borderRadius: '8px'}}
        ref={ref}
        onClick={onClick && onClick}
        >
        {icon && icon}
        {text}
        </button>
    )
}

export default Button;