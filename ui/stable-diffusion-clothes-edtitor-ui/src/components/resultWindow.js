import imageIcon from '../data/imageIcon.png';

export function ResultWindow() {

    
    return (
        <div className='result-box'>
            <div className="result-tab">
                <p className="result-tab-text">
                    Результат
                </p>
                <div className='result-hide-crutch'>

                </div>
            </div>
            <div className="result-sub-window">
                <div className="input-drop">
                    <div className="upload-image">
                        <img src={imageIcon} alt="Загрузить изображение" width="80px"/>
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
            </div>
        </div>
    )
}