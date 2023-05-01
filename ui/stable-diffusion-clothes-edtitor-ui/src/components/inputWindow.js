import uploadImage from '../data/upload.png';

export function InputWindow() {
    return (
        <div className="sub-window">
            <div className="input-drop">
                <div className="upload-image">
                    <img src={uploadImage} alt="Загрузить изображение" width="100px"/>
                    <p className="upload-text">
                        Переместите изображение сюда <br/>
                        для загрузки
                    </p>
                    <button className="browse-button" type="button">
                        Загрузить изображение
                    </button>
                </div>
            </div>
        </div>
    )
}