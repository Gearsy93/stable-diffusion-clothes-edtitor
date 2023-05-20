import {PromptBlock} from "./promptBlock"
import {ParamBlock} from "./paramBlock"
import {SelectionToPromptBlock} from "./selectionToPrompt"
import {InputImageBody} from "./inputImageBody"
import {InputDrop} from "./inputDrop"
import {ModelInput} from "./modelInput"
import {ServiceInput} from "./serviceInput"
import {InputTabBox} from './inputTab'
import {RemoveImage} from './lassoButtons';
import ReactLoading from 'react-loading';

function ImageOrDropBody({setSubWindow, setResultSubWindow, isLeftTab, image, setImage, setMask, setCompleteContour}) {

    function onRemoveImageClick() {
        setSubWindow("fix-sub-window");
        setResultSubWindow("fix-result-sub-window");
        setCompleteContour(false);
        setImage(null);
    };

    

    if (image)
    {
        if (isLeftTab === true) {
            return (
                <InputImageBody setSubWindow={setSubWindow} setResultSubWindow={setResultSubWindow} isLeftTab={isLeftTab} image={image} setImage={setImage} setMask={setMask} setCompleteContour={setCompleteContour}/>
            )
        }
        else {
            return (
                <div className='image-body'>
                    <div className='lasso-box'>
                        <img src={image} alt="error while rendering input" style={{'height':'40vh'}}/>
                    </div>
                    <div className='edit-buttons-field'>
                        <RemoveImage type="button" onClick={onRemoveImageClick}/>
                    </div>
                </div>
            )     
        }
    }
    else return  <InputDrop setSubWindow={setSubWindow} setResultSubWindow={setResultSubWindow} setImage={setImage} image={image}/>;
} 

function ExpandParams({blockChange, service, setService, isLeftTab, setModelName, image, prompt, setPrompt, width, setWidth, height, setHeight, similatiry, setSimilarity, genSteps, setGenSteps, promptInfluence, setpromptInfluence}) {
    if (image !== null) {
        return (
            <>
                <PromptBlock prompt={prompt} setPrompt={setPrompt}/>
                <ServiceInput blockChange={blockChange} isLeftTab={isLeftTab} setService={setService}/>
                <ModelInput blockChange={blockChange} service={service} isLeftTab={isLeftTab} setModelName={setModelName}/>
                <ParamBlock label={'Ширина'} min={64} max={1024} defaultValue={width} setDefaultValue={setWidth} measure={'px'}/>
                <ParamBlock label={'Высота'} min={64} max={1024} defaultValue={height} setDefaultValue={setHeight} measure={'px'}/>
                <ParamBlock label={'Шаги генерации'} min={1} max={100} defaultValue={genSteps} setDefaultValue={setGenSteps}/>
                <ParamBlock label={'Схожесть'} min={1} max={10} defaultValue={similatiry} setDefaultValue={setSimilarity}/>
                <ParamBlock label={'Влияние подсказки'} min={1} max={24} defaultValue={promptInfluence} setDefaultValue={setpromptInfluence}/>
            </>
        )
    }
}



export function InputWindow({setSubWindow, setResultSubWindow, fixSubWindow, blockChange, service, setService, isLeftTab, onLeftTabClick, onRightTabClick, 
    setModelName, cancelPromptGet, setCompleteContour, applyGenPrompt, promptGenStarted, genPrompt, image, setImage, prompt, setPrompt, setMask, width, 
    setWidth, height, setHeight, similatiry, setSimilarity, genSteps, setGenSteps, promptInfluence, setpromptInfluence}) {
    

    function ExpandSelectionPrompt({isImageSet, promptGenStarted, genPrompt, applyGenPrompt}) {

        if (isImageSet !== null) {
            return (
                <>
                    <GenerateProgress promptGenStarted={promptGenStarted} cancelPromptGet={cancelPromptGet}/>
                    <SelectionToPromptBlock onClick={applyGenPrompt} genPrompt={genPrompt} promptGenStarted={promptGenStarted}/>
                </>
            )
        }
    }
    
    function GenerateProgress({promptGenStarted, cancelPromptGet}) {
        if (promptGenStarted === true) {
            return (
                <>
                    <div className="prompt-loading">
                        <ReactLoading type={"spin"} color={"#FFBB55"} height={"5%"} width={"5%"} />
                    </div>
                    <button className='reject-button' type='button' onClick={cancelPromptGet}>
                        <p className='result-button-text'>
                            Отменить генерацию
                        </p>
                    </button>
                </>
            )
        }
    }
    return (
        <div className="result-box">
            <InputTabBox image={image} isLeftTab={isLeftTab} textLeft={"Выделение"} textRight={"Инструкция"} onLeftTabClick={onLeftTabClick} onRightTabClick={onRightTabClick}/>
            <div className={fixSubWindow}>
                <ImageOrDropBody setWidth={setWidth} setHeight={setHeight} setSubWindow={setSubWindow} setResultSubWindow={setResultSubWindow} isLeftTab={isLeftTab} image={image} setImage={setImage} setMask={setMask} setCompleteContour={setCompleteContour}/>   
                <ExpandSelectionPrompt isImageSet={image} promptGenStarted={promptGenStarted} genPrompt={genPrompt} applyGenPrompt={applyGenPrompt}/>
                <ExpandParams blockChange={blockChange} service={service} setService={setService} isLeftTab={isLeftTab} setModelName={setModelName} image={image} prompt={prompt} setPrompt={setPrompt} width={width} setWidth={setWidth} height={height} setHeight={setHeight}
                similatiry={similatiry} setSimilarity={setSimilarity} genSteps={genSteps} setGenSteps={setGenSteps} promptInfluence={promptInfluence} setpromptInfluence={setpromptInfluence}/>
            </div>
        </div>
    )
}