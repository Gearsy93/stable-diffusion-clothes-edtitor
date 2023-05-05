import {useState} from 'react';

//Change Output to Input (чтоб можно было вводить значения)

export function ParamBlock({label, min, max, defaultValue, measure}) {
    const measureValue = measure === undefined ? '' : measure;
    const [inputValue, setInputValue] = useState(defaultValue);

    const handleChange = event =>  {
        setInputValue(event.target.value)
    };

    return (
        <div className="param-input">
            <div className="param-input-label">
                <p className="param-input-label-text">
                    {label}
                </p>
            </div>
            <div className="param-input-body">
                <input className="styled-slider slider-progress" type="range" min={min} max={max} defaultValue={inputValue} onChange={handleChange} step="1"/>
                <output className="param-output" id={label}>
                    {inputValue + measureValue}
                </output>
            </div>
        </div>
    )
}