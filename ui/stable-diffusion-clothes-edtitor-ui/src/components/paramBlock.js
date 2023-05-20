import {useState, useRef, useEffect} from 'react';


//Change Output to Input (чтоб можно было вводить значения)

export function ParamBlock({label, min, max, defaultValue, setDefaultValue, measure}) {
    const measureValue = measure === undefined ? '' : measure;
    const [content, setContent] = useState(defaultValue);
    const [width, setWidth] = useState(0);
    const span = useRef();

    const step = measure === 'px' ? 64 : 1;

    useEffect(() => {
        setWidth(span.current.offsetWidth);     

        // Линия прогресса меняется с useState
        for (let e of document.querySelectorAll('input[type="range"].slider-progress')) {
            e.style.setProperty('--value', e.value);
            e.style.setProperty('--min', e.min === '' ? '0' : e.min);
            e.style.setProperty('--max', e.max === '' ? '100' : e.max);
            e.addEventListener('input', () => e.style.setProperty('--value', e.value));
          }    
    }, [content]);

    function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
      }

    const handleChange = event =>  {
        if (isNumeric(event.target.value)) {
            let value = event.target.value;
            if (measure === 'px') {
                let floor_times = parseInt(value / 64);
                value = floor_times * 64
            }

            if (value < min) {
                setContent(min)
                setDefaultValue(min)
            }
            else if (value > max) {
                setContent(max)
                setDefaultValue(max)
            }
            else {
                setContent(value)
                setDefaultValue(value)
            }
        } 
    };

    const handleManualChange = event => {
        if (isNumeric(event.target.value)) {
            let value = event.target.value;
            if (value < min) {
                setContent(min)
                setDefaultValue(min)
            }
            else if (value > max) {
                setContent(max)
                setDefaultValue(max)
            }
            else {
                setContent(value)
                setDefaultValue(value)
            }
        }
    }
    
    return (
        <div className="param-input" style={{userSelect: 'none'}}>
            <div className="param-input-label">
                <p className="param-input-label-text">
                    {label}
                </p>
            </div>
            <div className="param-input-body">
                <input className="styled-slider slider-progress" type="range" min={min} max={max} value={content} onChange={handleChange} step={step}/>
                <div style={{userSelect: 'none'}}>
                    <span id="hide" ref={span} style={{userSelect: 'none'}}>{content}</span>
                    <input type='text' className='param-output' style={{ width, userSelect: 'none'}} autoFocus onChange={handleManualChange}/>
                </div>
                <div className='measure-margin'>
                    {measureValue}
                </div>
            </div>
        </div>
    )
}