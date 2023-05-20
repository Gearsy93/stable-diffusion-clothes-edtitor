import { ResultTab } from './resultTab';
import { ResultSubWindow } from './resultSubWindow';


export function ResultWindow({fixResultSubWindow, blockChange, cancelImageGen, image, GenerateImage, progress, imageGenStarted, resultImage}) {
    return (
        <div className='result-box'>
            <ResultTab image={image}/>
            <div className={fixResultSubWindow}>
                <ResultSubWindow blockChange={blockChange} cancelImageGen={cancelImageGen} image={image} GenerateImage={GenerateImage} progress={progress} imageGenStarted={imageGenStarted} resultImage={resultImage}/>
            </div>
        </div>
    )
}