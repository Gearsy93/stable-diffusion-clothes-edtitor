import {InputWindow} from "./inputWindow"
import {ResultWindow} from "./resultWindow"
import {useState, useEffect} from "react"
import {toast} from "react-toastify"
import axios from "axios"
import settings from '../settings/settings.json';

axios.defaults.baseURL = settings['host'] + "/api/v1/sdce/"
var manualPromptStop = false;
var manualImageStop = false;

export function MainWindow() {
    const [progress, setProgress] = useState(0);
    const [imageGenStarted, setmageGenStarted] = useState(false);
    const [resultImage, setResultImage] = useState(null);
    const [isCompleteContour, setCompleteContour] = useState(false);
    const [promptGenStarted, setPromptGenStarted] = useState(false);
    const [isLeftTab, setIsLeftTab] = useState(true);
    const [service, setService] = useState("");
    const [blockChange, setBlockChange] = useState(false);
    const [fixSubWindow, setSubWindow] = useState("fix-sub-window")
    const [fixResultSubWindow, setResultSubWindow] = useState("fix-result-sub-window")

    const [modelName, setModelName] = useState("")
    const [genPrompt, setGenPrompt] = useState("");
    const [image, setImage] = useState(null);
    const [mask, setMask] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [width, setWidth] = useState(512);
    const [height, setHeight] = useState(512);
    const [similatiry, setSimilarity] = useState(8);
    const [genSteps, setGenSteps] = useState(49);
    const [promptInfluence, setpromptInfluence] = useState(18);
    
    useEffect(() => {
        window.scrollTo(0, 0)
      }, [image])
    
    async function GenerateImage(base64) {
        // Передача параметров для генерации
        setProgress(0);
        setBlockChange(true);
        await axios.post("generateImage", 
        isLeftTab === true ? {
            image: base64,
            mask: JSON.stringify(mask),
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
            model: modelName,
            prompt: prompt,
            width: width,
            height: height,
            similatiry: similatiry,
            genSteps: genSteps,
            promptInfluence: promptInfluence,  
        }
        ).then(res => {
            if (res.data['status'] !== 200) {
                toast.error(res.data['message'], {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                setBlockChange(false);
                setProgress(0);
                return false;
            }
        });

        // Информация о процессе генерации
        manualImageStop = false;
        setmageGenStarted(true);  
        for (let isComplete = false; isComplete === false && manualImageStop === false;) {
            await axios.get("imagestatus")
            .then(res => {
                if (res.data['status'] === 500)
                {
                    toast.error(res.data['message'], {
                        position: "top-center",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });
                        isComplete = true;
                        setmageGenStarted(false);
                        setBlockChange(false);
                        setProgress(0);
                        return;
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
        setmageGenStarted(false);

        // Получение сгенерированного изображения
        if (manualImageStop === false) {
            await axios.get("getGeneratedImage")
        .then(res => {
            if (res.data['status'] === 500) {
                toast.error(res.data['message'], {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                    setBlockChange(false);
                    return;
            }
            else if (res.data['status'] === 200){
                setResultImage(res.data['image']);
            }  
        })
        }
        setProgress(0);
        setBlockChange(false);
    }

    async function GetBase64Image() {

        if (isCompleteContour === false && isLeftTab === true) {
            toast.warn('Выделите замкнутую область с предметом одежды', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            return;
        }

        if (modelName === "") {
            toast.warn('Выберите модель для генерации', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            return;
        }

        if (service === "") {
            toast.warn('Выберите сервис для генерации', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            return;
        }

        if (prompt === "") {
            toast.warn('Для генерации необходима подсказка', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
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

    async function ApplyGenPrompt(base64) {
        // Передача параметров для генерации подсказки
        setBlockChange(true);
        await axios.post("generatePrompt", {
            image: base64,
        })
        .then(res => {
            if (res.data['status'] !== 200) {
                toast.error(res.data['message'], {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                setBlockChange(false);
                return false;
            }
        })
        // Информация о процессе генерации
        manualPromptStop = false;
        setPromptGenStarted(true);
        for (let isComplete = false; isComplete === false && manualPromptStop === false;) {
            await axios.get("promptstatus")
            .then(res => {
                if (res.data['status'] === 500){
                    toast.error(res.data['message'], {
                        position: "top-center",
                        autoClose: 1000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                        });
                        isComplete = true;
                        setBlockChange(false);
                        setPromptGenStarted(false);
                        return;
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
                toast.error(res.data['message'], {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
                    setBlockChange(false);
                    return;
            }
            else if (res.data['status'] === 200){
                setGenPrompt(res.data['prompt']);
            } 
        })
        }
        setBlockChange(false);
    }

    async function GetBase64Prompt() {
        if (service === "") {
            toast.warn('Выберите сервис для генерации', {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
            return;
        }

        const response = await fetch(image);
        const imageBlob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
            const base64data = reader.result;
            ApplyGenPrompt(base64data);
        };
    }

    async function CancelPromptGen() {
        manualPromptStop = true;
        await axios.delete("stopInterrogation")
        .then(res => {
            if (res.data['status'] === 500) {
                toast.error(res.data['message'], {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            }
        })
        setPromptGenStarted(false);
    }

    async function CancelImageGen() {
        manualImageStop = true;
        await axios.delete("stopImageGeneration")
        .then(res => {
            if (res.data['status'] === 500) {
                toast.error(res.data['message'], {
                    position: "top-center",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });
            }
        })
        setmageGenStarted(false);
    }

    function OnLeftTabClick() {
        if (blockChange === true) {
            toast.warn("В процессе генерации нельзя менять метод редактирования", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
                setBlockChange(false);
                return;
        }
        if (isLeftTab !== true) {
            setIsLeftTab(true);
        }
    }

    function OnRightTabClick() {
        if (blockChange === true) {
            toast.warn("В процессе генерации нельзя менять метод редактирования", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
                setBlockChange(false);
                return;
        }
        if (isLeftTab !== false) {
            setIsLeftTab(false);
        }
    }
    return (
        <div className="main-window">
            <InputWindow setSubWindow={setSubWindow} setResultSubWindow={setResultSubWindow} fixSubWindow={fixSubWindow} blockChange={blockChange} service={service} setService={setService} isLeftTab={isLeftTab}
             onLeftTabClick={OnLeftTabClick} onRightTabClick={OnRightTabClick} setModelName={setModelName} 
            cancelPromptGet={CancelPromptGen} isCompleteContour={isCompleteContour} setCompleteContour={setCompleteContour} applyGenPrompt={GetBase64Prompt} 
            promptGenStarted={promptGenStarted} genPrompt={genPrompt} image={image} setImage={setImage} prompt={prompt} setPrompt={setPrompt} setMask={setMask} width={width} 
            setWidth={setWidth} height={height} setHeight={setHeight}
            similatiry={similatiry} setSimilarity={setSimilarity} genSteps={genSteps} setGenSteps={setGenSteps} promptInfluence={promptInfluence} setpromptInfluence={setpromptInfluence}/>
            <ResultWindow fixResultSubWindow={fixResultSubWindow} cancelImageGen={CancelImageGen} image={image} GenerateImage={GetBase64Image} progress={progress} imageGenStarted={imageGenStarted} resultImage={resultImage}/>
        </div>
    )
}
