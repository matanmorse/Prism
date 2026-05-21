// hooks/useFocus.jsx
// Wrapper for norigin "useFocusable" which incorporates big picture context
// "Focused" is only true if we are in big picture mode.
import { useFocusable } from "@noriginmedia/norigin-spatial-navigation";
import { useBigPicture } from "../contexts/BigPictureContext";

export default function useFocus(options) {
    const {isBigPicture} = useBigPicture();
    const result = useFocusable(options)
    return {
        ...result,
        focused: isBigPicture && result.focused
    }
}