import {saveAs} from 'file-saver'
import {HistoryBlock} from './historyBlock';
import {CancelButton} from './cancelButton';
import {ImageView} from './imageView';
import {GenerateProgress} from './generateProgress';

export function ResultSubWindow({isResultLeftTab, cancelImageGen, image, GenerateImage, progress, imageGenStarted, resultImage}) {
    function DownloadImage() {
        saveAs(resultImage, 'generatedImage.png')
    }

    function CheckInputImage() {
        if (image !== null && !imageGenStarted) {
            return (
                <button className='generate-button result-button' type='button' onClick={GenerateImage}>
                    <p className='result-button-text'>
                        Сгенерировать
                    </p>
                 </button>
            )
        }
    }

    function CheckGeneratedImage() {
        if (resultImage !== null && !imageGenStarted) {
            return (
                <button className='result-button' type='button' onClick={DownloadImage}>
                    <p className='result-button-text'>
                        Сохранить изображение
                    </p>
                </button>
            )
        }
    }
    
    if (isResultLeftTab) {
        return (
            <>
                <ImageView resultImage={resultImage}/>
                {/* Прогресс генерации */}
                <GenerateProgress progress={progress} imageGenStarted={imageGenStarted}/>
                <CancelButton cancelImageGen={cancelImageGen} imageGenStarted={imageGenStarted}/>
                <CheckGeneratedImage/>
                <CheckInputImage/>
            </>
        )
    }
    else {
        return (
            <HistoryBlock/>
        )
    }
    
}