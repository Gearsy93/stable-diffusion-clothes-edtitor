import ReactLassoSelect, {getCanvas} from 'react-lasso-select';
import {useState} from 'react'
import {ClearPoints, RemoveImage} from './lassoButtons';

export function InputImageBody({setSubWindow, setResultSubWindow, image, setImage, setMask, setCompleteContour}) {
    const [points, setPoints] = useState([]);

    function onRemoveImageClick() {
        setSubWindow("fix-sub-window");
        setResultSubWindow("fix-result-sub-window");
        setCompleteContour(false);
        setImage(null);
    };
    
    const onClearPointsClick = () => {
        setPoints([]);
        
    };

    return (
        <>
            <div className="image-body">
                <div className='lasso-box'>
                    <ReactLassoSelect
                        value={points}
                        src={image}
                        style={{display: 'flex', justifyContent:'center', height:'100%'}}
                        imageStyle={{'height':'15vw'}}
                        onChange={value => {
                            setPoints(value);
                            setCompleteContour(false);
                        }}
                        onComplete={value => {
                            if (!value.length) return;
                            getCanvas(image, value, (err) => {
                                if (!err) {
                                    if (points.length > 2)
                                    {
                                        setCompleteContour(true);
                                        setMask(points);
                                    }
                                }
                            });
                        }}
                    />
                </div>
                <div className='edit-buttons-field'>
                    <RemoveImage type="button" onClick={onRemoveImageClick}/>
                    <ClearPoints type="button" onClick={onClearPointsClick}/>
                </div>
            </div>  
        </>
    ) 
}