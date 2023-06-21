import {InputTabBox} from './inputTab'
import {ExpandParams} from './expandParams'
import {ImageOrDropBody} from './imageOrDropBody'
import {ExpandSelectionPrompt} from "./expandSelectionPrompt"

export function InputWindow({setExpandParams, OnExpandParams, expandParams, setSubWindow, setResultSubWindow, fixSubWindow, service, setService, isLeftTab, onLeftTabClick, onRightTabClick, 
    modelName, setModelName, cancelPromptGet, setCompleteContour, applyGenPrompt, promptGenStarted, genPrompt, image, setImage, setPrompt, setMask, width, 
    setWidth, height, setHeight, similatiry, setSimilarity, genSteps, setGenSteps, promptInfluence, setpromptInfluence}) {
    
    return (
        <div className="result-box">
            <InputTabBox image={image} isLeftTab={isLeftTab} textLeft={"Выделение"} textRight={"Инструкция"} onLeftTabClick={onLeftTabClick} onRightTabClick={onRightTabClick}/>
            <div className={fixSubWindow}>
                <ImageOrDropBody setWidth={setWidth} setHeight={setHeight} setSubWindow={setSubWindow} setResultSubWindow={setResultSubWindow} isLeftTab={isLeftTab} image={image} setImage={setImage} setMask={setMask} setCompleteContour={setCompleteContour}/>   
                <ExpandSelectionPrompt cancelPromptGet={cancelPromptGet} isImageSet={image} promptGenStarted={promptGenStarted} genPrompt={genPrompt} applyGenPrompt={applyGenPrompt}/>
                <ExpandParams setExpandParams={setExpandParams} OnExpandParams={OnExpandParams} expandParams={expandParams} service={service} setService={setService} isLeftTab={isLeftTab} modelName={modelName} setModelName={setModelName} image={image} setPrompt={setPrompt} width={width} setWidth={setWidth} height={height} setHeight={setHeight}
                similatiry={similatiry} setSimilarity={setSimilarity} genSteps={genSteps} setGenSteps={setGenSteps} promptInfluence={promptInfluence} setpromptInfluence={setpromptInfluence}/>
            </div>
        </div>
    )
}