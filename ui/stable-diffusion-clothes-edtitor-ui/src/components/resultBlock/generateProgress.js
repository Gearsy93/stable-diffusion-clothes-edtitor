import {RenderProgressText} from "./renderProgressText"
import ReactLoading from 'react-loading';

export function GenerateProgress({progress, imageGenStarted}) {
    if (imageGenStarted === 1) {
        return (
            <div className="prompt-loading">
                <ReactLoading type={"spin"} color={"#FFBB55"} height={"5%"} width={"5%"} />
            </div>
        )
    }
    else if (imageGenStarted === 2) {
        return (
            <>
                <div className="progress-div">
                    <div style={{ width: `${progress}%` }} className="progress">
                        <RenderProgressText progress={progress}/>
                    </div>
                </div>
                
            </>
        )
    }
}