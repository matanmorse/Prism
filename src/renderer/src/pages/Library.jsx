import { useBigPicture } from "../contexts/BigPictureContext"
import BigPictureLibrary from "../components/library/BigPictureLibrary";
import DesktopLibrary from "../components/library/DesktopLibrary";
import '../styles/Library.css'

function App() {
  const {isBigPicture} = useBigPicture();
  return (
    <>
      {isBigPicture ? <BigPictureLibrary /> : <DesktopLibrary />}
    </>
  )
}

export default App
