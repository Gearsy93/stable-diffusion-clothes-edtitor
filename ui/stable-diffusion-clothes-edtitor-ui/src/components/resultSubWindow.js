import { saveAs } from 'file-saver'
import {IconContext} from "react-icons";
import {IoImageOutline} from "react-icons/io5";

export function ResultSubWindow({image, GenerateImage, progress, imageGenStarted, resultImage}) {
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

    function DownloadImage() {
        saveAs(resultImage, 'generatedImage.png')
    }

    function CheckInputImage() {
        if (image !== null) {
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
        if (resultImage !== null) {
            return (
                <button className='result-button' type='button' onClick={DownloadImage}>
                    <p className='result-button-text'>
                        Сохранить изображение
                    </p>
                </button>
            )
        }
    }

    function GenerateProgress({progress}) {
        if (imageGenStarted) {
            return (
                <div className="progress-div">
                    <div style={{ width: `${progress}%` }} className="progress">
                        <RenderProgressText progress={progress}/>
                    </div>
                </div>
            )
        }
    }

    function ImageView() {
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
    
    return (
        <>
            <ImageView/>
            {/* Прогресс генерации */}
            <GenerateProgress progress={progress}/>
            <CheckGeneratedImage/>
            <CheckInputImage/>
        </>
    )
}