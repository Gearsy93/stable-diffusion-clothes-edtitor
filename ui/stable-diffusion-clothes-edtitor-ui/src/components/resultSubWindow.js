import imageIcon from '../data/imageIcon.png';

export function ResultSubWindow({progress}) {
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
    

    return (
        <>
            <div className="input-drop">
                <div className="upload-image">
                    <img src={imageIcon} alt="Загрузить изображение" width="80px"/>
                </div>
            </div>
            {/* Прогресс генерации */}
            <div className="progress-div">
                <div style={{ width: `${progress}%` }} className="progress">
                    <RenderProgressText progress={progress}/>
                </div>
            </div>
            <button className='result-button' type='button'>
                <p className='result-button-text'>
                    Сохранить изображение
                </p>
            </button>
            <button className='generate-button result-button' type='button'>
                <p className='result-button-text'>
                    Сгенерировать
                </p>
            </button>
        </>
    )
}