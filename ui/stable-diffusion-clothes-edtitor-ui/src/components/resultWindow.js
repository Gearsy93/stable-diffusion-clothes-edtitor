import { ResultTab } from './resultTab';
import { ResultSubWindow } from './resultSubWindow';


export function ResultWindow({image, GenerateImage, progress, imageGenStarted, resultImage}) {
    return (
        <div className='result-box'>
            <ResultTab/>
            <div className="result-sub-window">
                <ResultSubWindow image={image} GenerateImage={GenerateImage} progress={progress} imageGenStarted={imageGenStarted} resultImage={resultImage}/>
            </div>
        </div>
    )
}