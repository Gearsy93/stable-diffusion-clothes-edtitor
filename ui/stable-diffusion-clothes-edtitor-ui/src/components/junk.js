<form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
    <input ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} />
    <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : "" }>
    <div>
        <p>Drag and drop your file here or</p>
        <button className="upload-button" onClick={onButtonClick}>Upload a file</button>
    </div> 
    </label>
    { dragActive && <div id="drag-file-element" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}/></div> }
</form>

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
