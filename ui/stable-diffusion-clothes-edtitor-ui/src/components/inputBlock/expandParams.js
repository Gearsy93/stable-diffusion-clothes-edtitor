import axios from "axios"
import settings from '../../settings/settings.json';
import {PromptBlock} from "./promptBlock"
import {ParamBlock} from "./paramBlock"
import {ModelInput} from "./modelInput"
import {ServiceInput} from "./serviceInput"
import {getImageSize} from 'react-image-size';
import {useEffect, useState} from "react";
import {ExpandButton} from "./expandButton";
import {Toaster} from "../toaster"

export function ExpandParams({setExpandParams, OnExpandParams, expandParams, service, setService, isLeftTab, modelName, setModelName, image, setPrompt, width, setWidth, height, setHeight, similatiry, setSimilarity, genSteps, setGenSteps, promptInfluence, setpromptInfluence}) {
    const [isLoading, setLoading] = useState(true)
    const [models, setModels] = useState([]);
    const [dropValue, setDropValue] = useState(0);
    const [services, setServices] = useState([]);
    const [dropValueService, setDropValueService] = useState(0);

    const setModelParams = (modelName) => {
      if (Object.hasOwn(modelName, 'steps')) {
        setGenSteps(parseInt(modelName['steps']))
        console.log(genSteps)
        setSimilarity(parseInt(modelName['similarity']))
        setpromptInfluence(parseInt(modelName['influence']))
      }
    }

    const fetchDimentsions = () => {
      if (image !== null) {
          getImageSize(image).then((result) => {
              let initHeight = result['height']
              let initWidth = result['width']
              //просто привести к кратности 64
              if ((initHeight >= 64 && initHeight <= 1024) && (initWidth >= 64 && initWidth <= 1024)) {
                  
                  // Нормировка высоты
                  let roundHeight = Math.round(initHeight / 64) * 64;
                  if (roundHeight < 64) {
                      setHeight(64);
                  }
                  else if (roundHeight > 1024) {
                      setHeight(1024);
                  }
                  else setHeight(roundHeight)
                  
                  // Нормировка ширины
                  let roundWidth = Math.round(initWidth / 64) * 64;
                  if (roundWidth < 64) {
                      setWidth(64);
                  }
                  else if (roundWidth > 1024) {
                      setWidth(1024);
                  }
                  else setWidth(roundWidth)

              }
              else {
                  // Выбрать большее и меньшее измерение изображения
                  let [dim_l, dim_s] = initHeight >= initWidth  ? [initHeight, initWidth] : [initWidth, initHeight]
                  let factor = dim_l / dim_s

                  // Слишком большая разница между шириной и высотой - соблюдение пропорций только при 1024 и 64
                  if (factor >= 16){
                      if (initHeight >= initWidth) {
                          setHeight(1024);
                          setWidth(64);
                      }
                      else {
                          setHeight(64);
                          setWidth(1024);
                      }
                      
                  }
                  else {
                      // Меньшее измерение < 64
                      if (dim_s < 64) {
                          dim_s = 64;
                          dim_l = Math.round(factor) * 64;
                      }
                      else if (dim_l > 1024) {
                          dim_l = 1024;
                          dim_s = 1024 / factor
                          dim_s = Math.round(dim_s / 64) * 64
                      }
                      if (initHeight >= initWidth) {
                          setHeight(dim_l);
                          setWidth(dim_s);
                      }
                      else {
                          setHeight(dim_s);
                          setWidth(dim_l);
                      }
                  }
              }
              setLoading(false);
          })
      }
  }

    const getModels = () => {
        setDropValue(0)
        setModelName("")
        if (service !== "") {
          axios.post(isLeftTab === true ? "inpaintModels" : "instructModels", {service: service}).then((res) => {
            var result = [];
          for (var i = 0; i < res.data['models'].length; i++) {
            result[i] = {}
            result[i].value = res.data['models'][i]
            result[i].label = res.data['models'][i]      
          }
          setModels(result)
          if (res.data['models'].length > 0) {
            //Edit
            if (isLeftTab === true) {
              if (service === 'automatic') {
                if (res.data['models'].includes(settings['inpaintAutomatic']['name'])) {
                  setDropValue({value: settings['inpaintAutomatic']['name'], label: settings['inpaintAutomatic']['name']})
                  setModelName(settings['inpaintAutomatic']['name'])
                  setModelParams(settings['inpaintAutomatic'])
                }
                else {
                  setDropValue({value: res.data['models'][i], label: res.data['models'][i]})
                  setModelName(res.data['models'][i])
                }
              }
              else if (service === 'aihorde') {
                if (res.data['models'].includes(settings['inpaintHorde']['name'])) {
                  setDropValue({value: settings['inpaintHorde']['name'], label: settings['inpaintHorde']['name']})
                  setModelName(settings['inpaintHorde']['name'])
                  setModelParams(settings['inpaintHorde'])
                }
                else {
                  setDropValue({value: res.data['models'][i], label: res.data['models'][i]})
                  setModelName(res.data['models'][i])
                }
              }
            }
            
            //Instruct
            else {
                if (service === 'automatic') {
                  if (res.data['models'].includes(settings['instructAutomatic']['name'])) {
                    setDropValue({value: settings['instructAutomatic']['name'], label: settings['instructAutomatic']['name']})
                    setModelName(settings['instructAutomatic']['name'])
                    setModelParams(settings['instructAutomatic'])
                  }
                  else {
                    setDropValue({value: res.data['models'][i], label: res.data['models'][i]})
                    setModelName(res.data['models'][i])
                  }
                }
                else if (service === 'aihorde') {
                  if (res.data['models'].includes(settings['instructHorde']['name'])) {
                    setDropValue({value: settings['instructHorde']['name'], label: settings['instructHorde']['name']})
                    setModelName(settings['instructHorde']['name'])
                    setModelParams(settings['instructHorde'])
                  }
                  else {
                    setDropValue({value: res.data['models'][i], label: res.data['models'][i]})
                    setModelName(res.data['models'][i])
                  }
                }
              }
            }
  
          else {
            setDropValue(0)
            setModelName("")
          }
          })
        }
    }

    const getServices = () => {
        setService('')
        setDropValue(0)
        try {
            axios.get("checkAvailableServices").then((res) => {
              var result = [];
              if (res.data['automatic'] === true) {
                  result[0] = {}
                  result[0].value = 'automatic'
                  result[0].label = 'Automatic1111'
              }
              if (res.data['aihorde'] === true) {
                  result[1] = {}
                  result[1].value = 'aihorde'
                  result[1].label = 'Ai Horde'
              }
              setServices(result)
              if (res.data['automatic'] === true) {
                setDropValueService({value: 'automatic', label: 'Automatic1111'})
                setService('automatic')
              }
              else if (res.data['aihorde'] === true) {
                setDropValueService({value: 'aihorde', label: 'Ai Horde'})
                setService('aihorde')
              }
              else {
                setService('')
                setDropValue(0)
              }
            })
                
            
        }
        catch(e) {
          Toaster(true, 'Сервер недоступен');
          return;
        }
    }

    useEffect(() => {
      fetchDimentsions();
      setLoading(true);
      //setExpandParams(false);
      getServices();
      
      //setExpandParams(true);
    }, [image, isLeftTab]);

    useEffect(() => {
      
      getModels();
      setLoading(false);
    }, [service])

    if (image !== null && isLoading === false) {
        if (expandParams === true) {
            return (
                <>
                    <PromptBlock setPrompt={setPrompt}/>
                    <ServiceInput getServices={getServices} services={services} dropValueService={dropValueService} setDropValueService={setDropValueService} isLeftTab={isLeftTab} setService={setService}/>
                    <ModelInput models={models} dropValue={dropValue} setDropValue={setDropValue} getModels={getModels} service={service} isLeftTab={isLeftTab} modelName={modelName} setModelName={setModelName}/>
                    <ParamBlock label={'Ширина'} min={64} max={1024} defaultValue={width} setDefaultValue={setWidth} measure={'px'}/>
                    <ParamBlock label={'Высота'} min={64} max={1024} defaultValue={height} setDefaultValue={setHeight} measure={'px'}/>
                    <ParamBlock label={'Шаги генерации'} min={1} max={100} defaultValue={genSteps} setDefaultValue={setGenSteps}/>
                    <ParamBlock label={'Схожесть'} min={1} max={10} defaultValue={similatiry} setDefaultValue={setSimilarity}/>
                    <ParamBlock label={'Влияние подсказки'} min={1} max={24} defaultValue={promptInfluence} setDefaultValue={setpromptInfluence}/>
                    <ExpandButton expandParams={expandParams} OnExpandParams={OnExpandParams}/>
                </>
            )
        }
        else if (expandParams === false) {
            return (
                <>
                    <PromptBlock setPrompt={setPrompt}/>
                    <ExpandButton expandParams={expandParams} OnExpandParams={OnExpandParams}/>
                </>
            )
        }
    }
}