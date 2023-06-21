import {InputDrop} from "./inputDrop"
import {ImageBody} from "./imageBody";

export function ImageOrDropBody({setWidth, setHeight, setSubWindow, setResultSubWindow, isLeftTab, image, setImage, setMask, setCompleteContour}) {
    if (image) return <ImageBody isLeftTab={isLeftTab} setMask={setMask} setCompleteContour={setCompleteContour} image={image} setResultSubWindow={setResultSubWindow} setImage={setImage} setSubWindow={setSubWindow}/>;
    else return  <InputDrop setWidth={setWidth} setHeight={setHeight} setSubWindow={setSubWindow} setResultSubWindow={setResultSubWindow} setImage={setImage} image={image}/>;
} 