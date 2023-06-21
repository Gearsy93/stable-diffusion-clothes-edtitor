import {RemoveImage} from './lassoButtons';
import {InputImageBody} from "./inputImageBody"

export function ImageBody({isLeftTab, setMask, setCompleteContour, image, setResultSubWindow, setImage, setSubWindow}) {

    function onRemoveImageClick() {
        setSubWindow("fix-sub-window");
        setResultSubWindow("fix-result-sub-window");
        setCompleteContour(false);
        setImage(null);
    };

    if (isLeftTab === true) {
        return (
            <InputImageBody setSubWindow={setSubWindow} setResultSubWindow={setResultSubWindow} isLeftTab={isLeftTab} image={image} setImage={setImage} setMask={setMask} setCompleteContour={setCompleteContour}/>
        )
    }
    else {
        return (
            <div className='image-body'>
                <div className='lasso-box'>
                    <img src={image} alt="error while rendering input" style={{'height':'15vw'}}/>
                </div>
                <div className='edit-buttons-field'>
                    <RemoveImage type="button" onClick={onRemoveImageClick}/>
                </div>
            </div>
        )     
    }
}