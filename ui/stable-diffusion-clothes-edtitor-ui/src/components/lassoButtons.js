import { IconContext } from "react-icons";
import {IoReload, IoArrowUndoOutline, IoClose} from "react-icons/io5";

export function RemoveImage({onClick}) {
    return (
        <IconContext.Provider value={{ color: "#FFBB55", className: "io5", size: "25px"}}>
            <div className="edit-button-shape" onClick={onClick}>
                <IoClose/>
            </div>
        </IconContext.Provider>
    )
}

export function ClearPoints({onClick}) {
    return (
        <IconContext.Provider value={{ color: "#FFBB55", className: "io5", size: "23px"}}>
            <div className="edit-button-shape" onClick={onClick}>
                <IoReload/>
            </div>
        </IconContext.Provider>
    )
}

export function RemoveLastPoint({onClick}) {
    return (
        <IconContext.Provider value={{ color: "#FFBB55", className: "io5", size: "23px"}}>
            <div className="edit-button-shape" onClick={onClick}>
                <IoArrowUndoOutline/>
            </div>
        </IconContext.Provider>
    )
}

