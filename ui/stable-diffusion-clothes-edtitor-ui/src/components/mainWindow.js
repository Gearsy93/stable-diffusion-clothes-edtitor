import axios from "axios"
import settings from '../settings/settings.json';
import {InputWindow} from "./inputBlock/inputWindow"
import {ResultWindow} from "./resultBlock/resultWindow"
import {useState, useEffect} from "react"
import {Toaster} from "./toaster"

// Initialize 
axios.defaults.baseURL = settings['host'] + "/api/v1/sdce/"
var manualPromptStop = false;
var manualImageStop = false;

export function MainWindow() {
    // UI Elements
    const [imageGenStarted, setmageGenStarted] = useState(0);
    const [promptGenStarted, setPromptGenStarted] = useState(false);
    const [isCompleteContour, setCompleteContour] = useState(false);
    const [isLeftTab, setIsLeftTab] = useState(true);
    const [isResultLeftTab, setResultIsLeftTab] = useState(true);
    const [fixSubWindow, setSubWindow] = useState("fix-sub-window")
    const [fixResultSubWindow, setResultSubWindow] = useState("fix-result-sub-window")
    const [expandParams, setExpandParams] = useState(false);

    // Parameters
    const [progress, setProgress] = useState(0);
    const [resultImage, setResultImage] = useState(null);
    const [service, setService] = useState("");
    const [modelName, setModelName] = useState("")
    const [genPrompt, setGenPrompt] = useState("");
    const [image, setImage] = useState(null);
    const [mask, setMask] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [similatiry, setSimilarity] = useState(8);
    const [genSteps, setGenSteps] = useState(49);
    const [promptInfluence, setpromptInfluence] = useState(18);
  
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [image])
    
    async function GenerateImage(base64) {
        // Передача параметров для генерации
        manualImageStop = false;
        setmageGenStarted(1);  
        setProgress(0);
        let error = false;
        let isQueued = false;

        await axios.post("generateImage", 
        isLeftTab === true ? {
            image: base64,
            mask: JSON.stringify(mask),
            service: service,
            model: modelName,
            prompt: prompt,
            width: width,
            height: height,
            similatiry: similatiry,
            genSteps: genSteps,
            promptInfluence: promptInfluence,  
        } : 
        {
            image: base64,
            mask: "",
            service: service,
            model: modelName,
            prompt: prompt,
            width: width,
            height: height,
            similatiry: similatiry,
            genSteps: genSteps,
            promptInfluence: promptInfluence,  
        }
        ).then(res => {
            if (res.data['status'] === 500 || res.data['status'] === 400) {
                Toaster(true, res.data['message']);
                error = true
                setProgress(0);
            }
            else if (res.data['status'] === 202) {
                Toaster(false, "Вы в очереди на генерацию изображения");
                isQueued = true
            }
        });

        if (error === true) 
        {
            setmageGenStarted(0);
            return;
        }
        if (isQueued === true) {
            manualImageStop = false;
            for (let isComplete = false; isComplete === false && manualImageStop === false;) {
                await axios.post("generateImage", 
                isLeftTab === true ? {
                    image: base64,
                    mask: JSON.stringify(mask),
                    service: service,
                    model: modelName,
                    prompt: prompt,
                    width: width,
                    height: height,
                    similatiry: similatiry,
                    genSteps: genSteps,
                    promptInfluence: promptInfluence,  
                } : 
                {
                    image: base64,
                    mask: "",
                    service: service,
                    model: modelName,
                    prompt: prompt,
                    width: width,
                    height: height,
                    similatiry: similatiry,
                    genSteps: genSteps,
                    promptInfluence: promptInfluence,  
                }
                ).then(res => {
                    if (res.data['status'] === 500 || res.data['status'] === 400) {
                        Toaster(true, res.data['message']);
                        error = true
                        isComplete = true
                        setProgress(0);
                    }
                    else if (res.data['status'] === 200) {
                        isComplete = true
                    }
                });
                if (isComplete === false) await new Promise(resolve => setTimeout(resolve, 1500));
            }
            Toaster(false, "Началась генерация изображения");
        }

        if (error === true) 
        {
            setPromptGenStarted(false);
            return;
        }

        // Информация о процессе генерации
        manualImageStop = false;
        setmageGenStarted(2);  
        for (let isComplete = false; isComplete === false && manualImageStop === false;) {
            await axios.get("imagestatus")
            .then(res => {
                if (res.data['status'] === 500)
                {
                    Toaster(true, res.data['message']);
                    isComplete = true;
                    setmageGenStarted(0);
                    setProgress(0);
                }
                else if (res.data['status'] === 200){
                    isComplete = true
                }
                else if (res.data['status'] === 202){
                    setProgress(res.data['progress'])
                }
            })
            if (isComplete === false) await new Promise(resolve => setTimeout(resolve, 200));
        };
        setmageGenStarted(0);

        // Получение сгенерированного изображения
        if (manualImageStop === false) {
            await axios.get("getGeneratedImage")
        .then(res => {
            if (res.data['status'] === 500) {
                Toaster(true, res.data['message'])
                return;
            }
            else if (res.data['status'] === 200){
                setResultImage(res.data['image']);
            }  
        })
        }
        setProgress(0);
    }

    async function GetBase64Image() {

        if (isCompleteContour === false && isLeftTab === true) {
            Toaster(false, 'Выделите замкнутую область с предметом одежды')
            return;
        }

        if (modelName === "") {
            Toaster(false, 'Выберите модель для генерации')
            return;
        }

        if (service === "") {
            Toaster(false, 'Выберите сервис для генерации');
            return;
        }

        if (prompt === "") {
            Toaster(false, 'Для генерации необходима подсказка');
            return;
        }

        const response = await fetch(image);
        const imageBlob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
            const base64data = reader.result;
            GenerateImage(base64data);
        };
    }

    async function GeneratePrompt(base64) {
        // Информация о процессе генерации
        manualPromptStop = false;
        // Передача параметров для генерации подсказки
        setPromptGenStarted(true);
        let error = false;
        let isQueued = false;
        await axios.post("generatePrompt", {
            image: base64,
            service: service
        })
        .then(res => {
            if (res.data['status'] === 500 || res.data['status'] === 400) {
                error = true
                Toaster(true, res.data['message']);
            }
            else if (res.data['status'] === 202) {
                Toaster(false, "Вы в очереди на генерацию подсказки");
                isQueued = true
            }
        })
        if (error === true) 
        {
            setPromptGenStarted(false);
            return;
        }
        if (isQueued === true) {
            manualPromptStop = false;
            for (let isComplete = false; isComplete === false && manualPromptStop === false;) {
                await axios.post("generatePrompt", {
                    image: base64,
                    service: service
                })
                .then(res => {
                    if (res.data['status'] === 500 || res.data['status'] === 400) {
                        error = true
                        isComplete = true
                        Toaster(true, res.data['message']);
                    }
                    else if (res.data['status'] === 200) {
                        isComplete = true
                    }
                })
                if (isComplete === false) await new Promise(resolve => setTimeout(resolve, 1500));
            }
            Toaster(false, "Началась генерация подсказки");
        }

        if (error === true) 
        {
            setPromptGenStarted(false);
            return;
        }
        
        
        for (let isComplete = false; isComplete === false && manualPromptStop === false;) {
            await axios.get("promptstatus")
            .then(res => {
                if (res.data['status'] === 500){
                    Toaster(true, res.data['message']);
                    isComplete = true;
                    setPromptGenStarted(false);
                }
                else if (res.data['status'] === 200){
                    isComplete = true
                }
                
            })
            if (isComplete === false) await new Promise(resolve => setTimeout(resolve, 400));
        };
        setPromptGenStarted(false);        

        // Получение сгенерированной подсказки
        if (manualPromptStop === false) {
            await axios.get("getGeneratedPrompt")
        .then(res => {
            if (res.data['status'] === 500) {
                Toaster(true, res.data['message']);
                return;
            }
            else if (res.data['status'] === 200){
                setGenPrompt(res.data['prompt']);
            } 
        })
        }
    }

    async function GetBase64Prompt() {
        if (service === "") {
            Toaster(false, 'Выберите сервис для генерации');
            return;
        }

        const response = await fetch(image);
        const imageBlob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
            const base64data = reader.result;
            GeneratePrompt(base64data);
        };
    }

    async function CancelPromptGen() {
        manualPromptStop = true;
        await axios.delete("stopInterrogation")
        .then(res => {
            if (res.data['status'] === 500) {
                Toaster(true, res.data['message']);
            }
        })
        setPromptGenStarted(false);
    }

    async function CancelImageGen() {
        manualImageStop = true;
        await axios.delete("stopImageGeneration")
        .then(res => {
            if (res.data['status'] === 500) {
                Toaster(true, res.data['message']);
            }
        })
        setmageGenStarted(0);
    }

    function OnLeftTabClick() {
        if (isLeftTab !== true) {
            setIsLeftTab(true);
        }
    }

    function OnRightTabClick() {
        if (isLeftTab !== false) {
            setIsLeftTab(false);
        }
    }

    function OnResultLeftTabClick() {
        if (isResultLeftTab !== true) {
            setResultIsLeftTab(true);
        }
    }

    function OnResultRightTabClick() {
        if (isResultLeftTab !== false) {
            setResultIsLeftTab(false);
        }
    }

    async function OnExpandParams() {
        if (expandParams === true)
        {
            setExpandParams(false);
        }
        else if (expandParams === false) {
            setExpandParams(true);
        }
        
    }
    
    return (
        <div className="main-window">
            <InputWindow setExpandParams={setExpandParams} OnExpandParams={OnExpandParams} expandParams={expandParams} setSubWindow={setSubWindow} setResultSubWindow={setResultSubWindow} fixSubWindow={fixSubWindow} service={service} setService={setService} isLeftTab={isLeftTab}
             onLeftTabClick={OnLeftTabClick} onRightTabClick={OnRightTabClick} modelName={modelName} setModelName={setModelName} 
            cancelPromptGet={CancelPromptGen} isCompleteContour={isCompleteContour} setCompleteContour={setCompleteContour} applyGenPrompt={GetBase64Prompt} 
            promptGenStarted={promptGenStarted} genPrompt={genPrompt} image={image} setImage={setImage} prompt={prompt} setPrompt={setPrompt} setMask={setMask} width={width} 
            setWidth={setWidth} height={height} setHeight={setHeight}
            similatiry={similatiry} setSimilarity={setSimilarity} genSteps={genSteps} setGenSteps={setGenSteps} promptInfluence={promptInfluence} setpromptInfluence={setpromptInfluence}/>
            <ResultWindow OnResultLeftTabClick={OnResultLeftTabClick} OnResultRightTabClick={OnResultRightTabClick} isResultLeftTab={isResultLeftTab} setResultIsLeftTab={setResultIsLeftTab} fixResultSubWindow={fixResultSubWindow} cancelImageGen={CancelImageGen} image={image} GenerateImage={GetBase64Image} progress={progress} imageGenStarted={imageGenStarted} resultImage={resultImage}/>
        </div>
    )
}
