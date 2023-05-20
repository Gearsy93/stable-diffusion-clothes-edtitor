import json
import time
import threading
from fastapi import APIRouter, Depends, HTTPException, Form
from app.services import AIHorde, Automatic1111
from app.modules.sdce.models import GenerateParams, PromptGenerateParams, Service
from app.modules.sdce.scripts import ParamProcess, PromptParamProcess, GenerateImage, GeneratePrompt, PILTobase64

router = APIRouter()
ai_horde = AIHorde()
automatic1111 = Automatic1111()

mutable = {'service': ""}

@router.get("/checkAvailableServices")
async def checkAvailableServices():
    try:
        automaticStatus = automatic1111.checkServiceAvailable();
        aiHordeStatus = ai_horde.checkServiceAvailable()
        return {
            'automatic': automaticStatus,
            'aihorde': aiHordeStatus
        }
    except Exception as e:
        return {"status": 400, 'message': str(e)}

@router.post("/setService")
async def setService(service: Service):
    service = service.service
    if service == 'automatic' or service == 'aihorde':
        if service == 'automatic':
            mutable['service'] = automatic1111
        else:
            mutable['service'] = ai_horde
        return {"status": 200}
    else:
        return {"status": 400, 'message':"service doesn't exist"}


@router.get("/inpaintModels")
async def inpaintModels():
    try:
        models = mutable['service'].getInpaintModels()
        return {"status": 200, "models": models}
    except Exception as e:
        return {"status": 500, "message": str(e)}

@router.get("/instructModels")
async def instructModels():
    try:
        models = mutable['service'].getInstructModels()
        return {"status": 200, "models": models}
    except Exception as e:
        return {"status": 500, "message": str(e)}

@router.post("/generateImage")
async def generateImage(generateParams: GenerateParams):
    try:
        if generateParams.mask == "":
            image64, maskImage = str(generateParams.image[generateParams.image.find('base64,') + 7:]), ""
        else:
            image64, maskImage = ParamProcess(generateParams)
        generateParams.similatiry = round(generateParams.similatiry / 10, 2)
        mutable['service'].startImageGeneration(generateParams.prompt, image64, maskImage, generateParams.model, generateParams.promptInfluence,
                                                generateParams.similatiry, generateParams.height, generateParams.width, generateParams.genSteps)
        return {"status": 200}
    except Exception as e:
        print(str(e))
        return {"status": 500, "message": str(e)}

@router.get("/imagestatus")
async def imagestatus():
    try:
        response = mutable['service'].checkImageGenerationStatus()
        if response >= 0:
            return {"status": 202, "progress": response}
        elif response == -1:
            return {"status": 200}
    except Exception as e:
        print(str(e))
        return {"status": 500, "message": str(e)}

@router.get('/getGeneratedImage')
async def getGeneratedImage():
    try:
        response = mutable['service'].getGeneratedImage()
        return {"status": 200, "image": response}
    except Exception as e:
        print(str(e))
        return {"status": 500, "message": str(e)}


@router.delete('/stopImageGeneration')
async def stopImageGeneration():
    try:
        mutable['service'].stopImageGeneration()
        return {"status": 200}
    except Exception as e:
        return {"status": 500, "message": str(e)}

@router.post('/generatePrompt')
async def generatePrompt(promptGenerateParams: PromptGenerateParams):
    try:
        base64_img = PromptParamProcess(promptGenerateParams)
        mutable['service'].startImageInterrogation(base64_img)
        return {"status": 200}
    except Exception as e:
        return {"status": 500, "message": str(e)}


@router.get("/promptstatus")
async def promptstatus():
    try:
        response = mutable['service'].checkImageInterrogationStatus()
        if (not response):
            # Генерация не закончилась
            return {"status": 201}
        else:
            return {"status": 200}
    except Exception as e:
        return {"status": 500, "message": str(e)}

@router.get('/getGeneratedPrompt')
async def getGeneratedPrompt():
    try:
        response = mutable['service'].getInterrogationPrompt()
        return {"status": 200, "prompt": response}
    except Exception as e:
        return {"status": 500, "message": str(e)}

@router.delete('/stopInterrogation')
async def stopInterrogation():
    try:
        mutable['service'].stopImageInterrogation()
        return {"status": 200}
    except Exception as e:
        return {"status": 500, "message": str(e)}