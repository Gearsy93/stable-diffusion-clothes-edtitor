import { InputWindow } from "./inputWindow"
import { ResultWindow } from "./resultWindow"

export function MainWindow() {
    return (
        <div className="main-window">
            <InputWindow/>
            <ResultWindow/>
        </div>
    )
}