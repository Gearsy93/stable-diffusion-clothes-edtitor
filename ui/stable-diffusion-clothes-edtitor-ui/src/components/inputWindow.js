import {PromptBlock} from "./promptBlock"
import {ParamBlock} from "./paramBlock"
import {SelectionToPromptBlock} from "./selectionToPrompt"
import {InputImageBody} from "./inputImageBody"
import {InputDrop} from "./inputDrop"
import {useState} from "react"
import React from "react"

//Add default values for params

function ImageOrDropBody({image, setImage}) {
    if (image) return <InputImageBody image={image}/>
    else return  <InputDrop setImage={setImage} image={image}/>;
}

export function InputWindow() {
    const [image, setImage] = useState(null);

    return (
        <div className="sub-window">
            <ImageOrDropBody image={image} setImage={setImage}/>
            <SelectionToPromptBlock/>
            <PromptBlock/>
            <ParamBlock label={'Ширина'} min={100} max={1920} defaultValue={640} measure={'px'}/>
            <ParamBlock label={'Высота'} min={100} max={1080} defaultValue={360} measure={'px'}/>
            <ParamBlock label={'Схожесть'} min={1} max={10} defaultValue={7}/>
            <ParamBlock label={'Шаги генерации'} min={1} max={100} defaultValue={65}/>
            <ParamBlock label={'Шаги последовательной генерации'} min={0} max={4} defaultValue={0}/>
        </div>
    )
}