import useFocus from "../../hooks/useFocus"

export default function FocusCheckbox({ text, checkboxRef, focusKey, focusable=true, htmlFor}) {
    const doCheckUncheck = () => checkboxRef.current.checked = !checkboxRef.current.checked

    const {ref, focused} = useFocus({focusKey: focusKey, focusable:focusable, onEnterPress:doCheckUncheck})

    return (
        <div className="checkbox-wrapper" onClick={doCheckUncheck}>
            <input className={`focusable ${focused ? 'focused' : ''}`}type="checkbox" name={htmlFor} ref={(node) => {checkboxRef.current = node, ref.current = node}} onClick={(e) => e.stopPropagation()} />
            <label htmlFor={htmlFor}>{text}</label>
        </div>
    )
}