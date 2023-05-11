import {InputWindow} from "./inputWindow"
import {ResultWindow} from "./resultWindow"
import {useState} from "react"
import {toast} from "react-toastify"
import axios from "axios"

axios.defaults.baseURL = "http://localhost:8000/api/v1/sdce/"

export function MainWindow() {
    const [progress, setProgress] = useState(0);
    const [promptProgress, setPromptProgress] = useState(0);
    const [imageGenStarted, setmageGenStarted] = useState(false);
    const [resultImage, setResultImage] = useState(null);

    const [promptGenStarted, setPromptGenStarted] = useState(false);
    const [genPrompt, setGenPrompt] = useState("");

    const [image, setImage] = useState(null);
    const [mask, setMask] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [width, setWidth] = useState(640);
    const [height, setHeight] = useState(360);
    const [similatiry, setSimilarity] = useState(7);
    const [genSteps, setGenSteps] = useState(65);
    const [consistentSteps, setConsistentSteps] = useState(0);
    
    async function GenerateImage(base64) {

        // Передача параметров для генерации
        await axios.post("generateImage", {
            image: base64,
            mask: JSON.stringify(mask),
            prompt: prompt,
            width: width,
            height: height,
            similatiry: similatiry,
            genSteps: genSteps,
            consistentSteps: consistentSteps,  
        })
        .then(res => {
            console.log(res.data)
        });

        // Информация о процессе генерации
        setmageGenStarted(true);  
        for (let isComplete = false; isComplete === false;) {
            await axios.get("imagestatus")
            .then(res => {
                console.log(res.data['genStatus'])
                setProgress(parseInt(res.data['genStatus']))
                if (res.data['genStatus'] === "100"){
                    isComplete = true
                }
            })
            await new Promise(resolve => setTimeout(resolve, 100));
        };
        setmageGenStarted(false);

        // Получение сгенерированного изображения
        await axios.get("getGeneratedImage")
        .then(res => {
            setResultImage(res.data['image']);
        })
    }

    async function GetBase64Image() {

        if (mask === null || mask === []) {
            toast.warn('Выделите область с предметом одежды', {
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
        await axios.post("generatePrompt", {
            image: base64,
            mask: JSON.stringify(mask),
        })
        .then(res => {
            console.log(res.data)
        })

        // Информация о процессе генерации
        setPromptGenStarted(true);
        for (let isComplete = false; isComplete === false;) {
            await axios.get("promptstatus")
            .then(res => {
                setPromptProgress(parseInt(res.data['genStatus']))
                if (res.data['genStatus'] === "100"){
                    isComplete = true
                }
            })
            await new Promise(resolve => setTimeout(resolve, 100));
        };
        setPromptGenStarted(false);
        
        // Получение сгенерированной подсказки
        await axios.get("getGeneratedPrompt")
        .then(res => {
            setGenPrompt(res.data['prompt']);
        })
    }

    async function GetBase64Prompt() {
        const response = await fetch(image);
        const imageBlob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(imageBlob);
        reader.onloadend = () => {
            const base64data = reader.result;
            ApplyGenPrompt(base64data);
        };
    }

    return (
        <div className="main-window">
            <InputWindow promptProgress={promptProgress} applyGenPrompt={GetBase64Prompt} promptGenStarted={promptGenStarted} genPrompt={genPrompt} image={image} setImage={setImage} prompt={prompt} setPrompt={setPrompt} setMask={setMask} width={width} setWidth={setWidth} height={height} setHeight={setHeight}
            similatiry={similatiry} setSimilarity={setSimilarity} genSteps={genSteps} setGenSteps={setGenSteps} consistentSteps={consistentSteps} setConsistentSteps={setConsistentSteps}/>
            <ResultWindow image={image} GenerateImage={GetBase64Image} progress={progress} imageGenStarted={imageGenStarted} resultImage={resultImage}/>
        </div>
    )
}
