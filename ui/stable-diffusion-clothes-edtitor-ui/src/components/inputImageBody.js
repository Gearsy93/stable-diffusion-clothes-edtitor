import ReactLassoSelect, { getCanvas } from 'react-lasso-select';
import {useState} from 'react'
import {ClearPoints, RemoveImage, RemoveLastPoint} from './lassoButtons';

export function InputImageBody({image, setImage, setMask, setCompleteContour}) {
    const [points, setPoints] = useState([]);

    function onRemoveImageClick() {
        setCompleteContour(false);
        setImage(null);
    };
    
    const onClearPointsClick = () => {
        setPoints([]);
    };

    const onRemoveLastPointClick = () => {
        setPoints(points.slice(0, -1))
    };

    return (
        <>
            <div className="image-body">
                <div className='lasso-box'>
                <ReactLassoSelect
                        value={points}
                        src={image}
                        style={{display: 'flex', justifyContent:'center', width:'fit-content'}}
                        imageStyle={{'height':'40vh'}}
                        onChange={value => {
                            setPoints(value);
                            setCompleteContour(false);
                        }}
                        onComplete={value => {
                            if (!value.length) return;
                            getCanvas(image, value, (err, canvas) => {
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
                    <RemoveLastPoint type="button" onClick={onRemoveLastPointClick}/>
                </div>
            </div>  
        </>
    ) 
}

//<button className="apply-selection-button" type="button">