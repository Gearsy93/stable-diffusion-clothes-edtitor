import { IconContext } from "react-icons";
import {IoCloudUploadOutline} from "react-icons/io5";
import {useState, useRef} from "react";

export function InputDrop({setImage}) {

    // drag state
    const [dragActive, setDragActive] = useState(false);
    // ref
    const inputRef = useRef(null);

    // handle drag events
    const handleDrag = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
        } else if (e.type === "dragleave") {
        setDragActive(false);
        }
    };
    
    // triggers when file is dropped
    const handleDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setImage(URL.createObjectURL(e.dataTransfer.files[0]));
        }
    };
    
    // triggers when file is selected with click
    const handleChange = function(e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };
    
    // triggers the input when the button is clicked
    const onButtonClick = () => {
        inputRef.current.click();
    };
    return (
        <form className="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
            <input ref={inputRef} type="file" className="input-file-upload" multiple={true} onChange={handleChange} />
            <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
                <IconContext.Provider value={{ color: "#000", className: "io5", size: "25px"}}>
                    <IoCloudUploadOutline size={100}/>
                </IconContext.Provider>
                <p className="upload-text">
                    Переместите изображение сюда <br/>
                    для загрузки
                </p>
                <button className="browse-button" onClick={onButtonClick} type="button">
                    Загрузить изображение
                </button> 
            </label>
            { dragActive && <div className="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> }
        </form>
    )
}