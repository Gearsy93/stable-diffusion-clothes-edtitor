import {ResultTab} from './resultTab';
import {ResultSubWindow} from './resultSubWindow';

export function ResultWindow({OnResultLeftTabClick, OnResultRightTabClick, isResultLeftTab, fixResultSubWindow, cancelImageGen, image, GenerateImage, progress, imageGenStarted, resultImage}) {
    return (
        <div className='result-box'>
            <ResultTab image={image} isResultLeftTab={isResultLeftTab} textLeft={"Результат"} textRight={"История"} OnResultLeftTabClick={OnResultLeftTabClick} OnResultRightTabClick={OnResultRightTabClick}/>
            <div className={fixResultSubWindow}>
                <ResultSubWindow isResultLeftTab={isResultLeftTab} cancelImageGen={cancelImageGen} image={image} GenerateImage={GenerateImage} progress={progress} imageGenStarted={imageGenStarted} resultImage={resultImage}/>
            </div>
        </div>
    )
}