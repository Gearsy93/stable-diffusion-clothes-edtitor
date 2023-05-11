import {PromptBlock} from "./promptBlock"
import {ParamBlock} from "./paramBlock"
import {SelectionToPromptBlock} from "./selectionToPrompt"
import {InputImageBody} from "./inputImageBody"
import {InputDrop} from "./inputDrop"
import {useState} from "react"


//Add default values for params

function ImageOrDropBody({image, setImage, setMask, setCompleteContour}) {
    if (image) return <InputImageBody image={image} setImage={setImage} setMask={setMask} setCompleteContour={setCompleteContour}/>
    else return  <InputDrop setImage={setImage} image={image}/>;
}

function RenderProgressText({progress}) {
    if (progress >= 4) {
        return (
            <p className='progress-text'>
                {progress}%
            </p>
        )
    }
    else {
        return <></>
    }
}    

function ExpandParams({image, prompt, setPrompt, width, setWidth, height, setHeight, similatiry, setSimilarity, genSteps, setGenSteps, consistentSteps, setConsistentSteps}) {
    
    
    if (image !== null) {
        return (
            <>
                <PromptBlock prompt={prompt} setPrompt={setPrompt}/>
                <ParamBlock label={'Ширина'} min={100} max={1920} defaultValue={width} setDefaultValue={setWidth} measure={'px'}/>
                <ParamBlock label={'Высота'} min={100} max={1080} defaultValue={height} setDefaultValue={setHeight} measure={'px'}/>
                <ParamBlock label={'Схожесть'} min={1} max={10} defaultValue={similatiry} setDefaultValue={setSimilarity}/>
                <ParamBlock label={'Шаги генерации'} min={1} max={100} defaultValue={genSteps} setDefaultValue={setGenSteps}/>
                <ParamBlock label={'Шаги последовательной генерации'} min={0} max={4} defaultValue={consistentSteps} setDefaultValue={setConsistentSteps}/>
            </>
        )
    }
}



export function InputWindow({promptProgress, applyGenPrompt, promptGenStarted, genPrompt, image, setImage, prompt, setPrompt, setMask, width, setWidth, height, setHeight, similatiry, setSimilarity, genSteps, setGenSteps, consistentSteps, setConsistentSteps}) {
    const [isCompleteContour, setCompleteContour] = useState(false);

    function ExpandSelectionPrompt({isCompleteContour, promptGenStarted, genPrompt, applyGenPrompt, promptProgress}) {

        if (isCompleteContour === true) {
            return (
                <>
                    <GenerateProgress progress={promptProgress} promptGenStarted={promptGenStarted}/>
                    <SelectionToPromptBlock onClick={applyGenPrompt} genPrompt={genPrompt}/>
                </>
            )
        }
    }
    
    function GenerateProgress({progress, promptGenStarted}) {
        if (promptGenStarted === true) {
            return (
                <div className="progress-div">
                    <div style={{ width: `${progress}%` }} className="progress">
                        <RenderProgressText progress={progress}/>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="sub-window">
            <ImageOrDropBody image={image} setImage={setImage} setMask={setMask} setCompleteContour={setCompleteContour}/>
            <ExpandSelectionPrompt isCompleteContour={isCompleteContour} promptGenStarted={promptGenStarted} genPrompt={genPrompt} applyGenPrompt={applyGenPrompt} promptProgress={promptProgress}/>
            <ExpandParams image={image} prompt={prompt} setPrompt={setPrompt} width={width} setWidth={setWidth} height={height} setHeight={setHeight}
            similatiry={similatiry} setSimilarity={setSimilarity} genSteps={genSteps} setGenSteps={setGenSteps} consistentSteps={consistentSteps} setConsistentSteps={setConsistentSteps}/>
        </div>
    )
}