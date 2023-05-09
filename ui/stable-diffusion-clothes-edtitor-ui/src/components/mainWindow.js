import { InputWindow } from "./inputWindow"
import { ResultWindow } from "./resultWindow"
//import {useState} from "react"
// import axios from "axios"


export function MainWindow() {
    
    //const [progress, setProgress] = useState(40);
    const progress = 27;

    return (
        <div className="main-window">
            <InputWindow/>
            <ResultWindow progress={progress}/>
        </div>
    )
}
