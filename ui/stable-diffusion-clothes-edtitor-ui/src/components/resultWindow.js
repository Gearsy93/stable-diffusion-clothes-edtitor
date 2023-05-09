import { ResultTab } from './resultTab';
import { ResultSubWindow } from './resultSubWindow';


export function ResultWindow({progress}) {
    return (
        <div className='result-box'>
            <ResultTab/>
            <div className="result-sub-window">
                <ResultSubWindow progress={progress}/>
            </div>
        </div>
    )
}