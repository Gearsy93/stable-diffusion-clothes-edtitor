import ReactLassoSelect, { getCanvas } from 'react-lasso-select';
import {useState} from 'react'

export function InputImageBody({image, setClippedImg}) {
    const [points, setPoints] = useState([]);
    return (
        <div className="input-image-body">
                <ReactLassoSelect
                    value={points}
                    src={image}
                    imageStyle={{width: '400px'}}
                    onChange={value => {
                        setPoints(value);
                    }}
                    onComplete={value => {
                        if (!value.length) return;
                        getCanvas(image, value, (err, canvas) => {
                            if (!err) {
                                setClippedImg(canvas.toDataURL());
                            }
                        });
                    }}
                />
            </div>
    ) 
}