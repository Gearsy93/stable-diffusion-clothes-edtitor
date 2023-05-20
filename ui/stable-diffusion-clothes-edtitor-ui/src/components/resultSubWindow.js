import { saveAs } from 'file-saver'
import {IconContext} from "react-icons";
import {IoImageOutline} from "react-icons/io5";

function CancelButton({cancelImageGen, imageGenStarted}) {
    if (imageGenStarted) {
        return (
            <button className='reject-button' type='button' onClick={cancelImageGen}>
                <p className='result-button-text'>
                    Отменить генерацию
                </p>
            </button>
        )
    }
}

function ImageView({resultImage}) {
    if (resultImage !== null) {
        return (
            <div className='image-body' style={{display: 'flex', justifyContent: 'center'}}>
                <img src={resultImage} alt="Generated" style={{'height':'40vh'}}/>
            </div>
        )
    }
    else {
        return (
            <div className="input-drop">
                <div className="upload-image">
                    <IconContext.Provider value={{ color: "#FFBB55", className: "io5", size: "25px"}}>
                        <IoImageOutline size={80}/>
                    </IconContext.Provider>
                </div>
            </div>
        )
    }
}

function GenerateProgress({progress, imageGenStarted}) {
    if (imageGenStarted) {
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

function RenderProgressText({progress}) {
    if (progress >= 4) {
        return (
            <p className='progress-text'>
                {progress}%
            </p>
        )
    }
    else {
        return <></>
    }
}

export function ResultSubWindow({cancelImageGen, image, GenerateImage, progress, imageGenStarted, resultImage}) {
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