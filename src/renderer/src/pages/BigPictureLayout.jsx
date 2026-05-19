import { Outlet } from "react-router-dom";
import TitleBar from "../components/TitleBar";

const BigPictureLayout = () => {
    return (
        <>
            <TitleBar />
            <div id="root">
                <Outlet />
            </div>
        </>

    )
}

export default BigPictureLayout;