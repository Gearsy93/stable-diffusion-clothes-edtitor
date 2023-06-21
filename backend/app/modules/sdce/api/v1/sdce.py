import json
import time
import threading
from fastapi import APIRouter, Depends, HTTPException, Form
from app.services import AIHorde, Automatic1111
from app.modules.sdce.models import GenerateParams, PromptGenerateParams, Service
from app.modules.sdce.scripts import ParamProcess, PromptParamProcess, GenerateImage, GeneratePrompt, PILTobase64

import asyncio
import uuid1
from celery.app import Celery
from redis import Redis
from redis.lock import Lock as RedisLock

# Read settings
with open("settings.json") as json_data:
    data = json.load(json_data)
    redis_host = data['redis_host']
    redis_port = data['redis_port']

# Router
router = APIRouter()

# Service instances
ai_horde = AIHorde()
automatic1111 = Automatic1111()

# Temp chosen service
mutable = {'promptService': None, 'imageService': None, 'promptTask': None, 'imageTask': None, 'promptFinished': True, 'imageFinished': True}

# Celery and redis initialization
redis_url = f"redis://{redis_host}:{redis_port}"
app = Celery(__name__, broker=redis_url, backend=redis_url)

redis_instance = Redis.from_url(redis_url)
promptLock = RedisLock(redis_instance, name='prompt')
imageLock = RedisLock(redis_instance, name='image')

REDIS_TASK_KEY_PROMPT = "prompt_task"
REDIS_TASK_KEY_IMAGE = "image_task"

# celery --app=app.modules.sdce.api.v1.sdce.app worker --concurrency=1 --loglevel=INFO --pool=gevent

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


@router.post("/inpaintModels")
async def inpaintModels(service: Service):
    service_name = service.service
    try:
        if service_name == 'automatic':
            return {"status": 200, "models": automatic1111.getInpaintModels()}
        elif service_name == 'aihorde':
            return {"status": 200, "models": ai_horde.getInpaintModels()}
        else:
            return {"status": 400, 'message': "service doesn't exist"}
    except Exception as e:
        return {"status": 500, "message": str(e)}

@router.post("/instructModels")
async def instructModels(service: Service):
    service_name = service.service
    try:
        if service_name == 'automatic':
            return {"status": 200, "models": automatic1111.getInstructModels()}
        elif service_name == 'aihorde':
            return {"status": 200, "models": ai_horde.getInstructModels()}
        else:
            return {"status": 400, 'message': "service doesn't exist"}
    except Exception as e:
        return {"status": 500, "message": str(e)}






@app.task
def generateImageTask(service: str,
                        prompt: str,
                        image: str,
                        mask: str,
                        model: str,
                        promptInfluence: int,
                        similatiry: int,
                        height: int,
                        width: int,
                        genSteps: int,
                        ):
    if (service == 'automatic'):
        asyncio.run(automatic1111.startImageGeneration(prompt, image, mask, model,
                                                                 promptInfluence,
                                                                 similatiry, height, width,
                                                                 genSteps))
        return {'text': automatic1111.taskResult}
    elif (service == 'aihorde'):
        asyncio.run(ai_horde.startImageGeneration(prompt, image, mask, model,
                                                     promptInfluence,
                                                     similatiry, height, width,
                                                     genSteps))
        return {'text': ai_horde.taskResult}

@router.post("/generateImage")
async def generateImage(generateParams: GenerateParams):
    try:
        if not imageLock.acquire(blocking_timeout=1):
            return {"status": 202, 'message': "generator is currently busy"}

        task_id = redis_instance.get(REDIS_TASK_KEY_IMAGE)
        print(task_id)
        print(mutable['imageFinished'])
        if task_id is None or (app.AsyncResult(task_id).ready() and mutable['imageFinished'] == True):
            mutable['imageFinished'] = False
            if generateParams.mask == "":
                image64, maskImage = str(generateParams.image[generateParams.image.find('base64,') + 7:]), ""
            else:
                image64, maskImage = ParamProcess(generateParams)
            generateParams.similatiry = round(generateParams.similatiry / 10, 2)
            if generateParams.service == 'automatic':
                mutable['imageService'] = automatic1111
            elif generateParams.service == 'aihorde':
                mutable['imageService'] = ai_horde
            else:
                return {"status": 400, 'message': "service doesn't exist"}
            mutable['imageTask'] = generateImageTask.delay(generateParams.service, generateParams.prompt, image64, maskImage, generateParams.model,
                                                 generateParams.promptInfluence,
                                                 generateParams.similatiry, generateParams.height, generateParams.width,
                                                 generateParams.genSteps)
            redis_instance.set(REDIS_TASK_KEY_IMAGE, mutable['imageTask'].task_id)
            return {"status": 200}
        else:
            return {"status": 202, 'message': "generator is currently busy"}
    except Exception as e:
        return {"status": 500, "message": str(e)}
    finally:
        try:
            imageLock.release()
        except:
            pass


@router.get("/imagestatus")
async def imagestatus():
    try:
        response = mutable['imageService'].checkImageGenerationStatus(mutable['imageTask'])
        if response >= 0:
            return {"status": 202, "progress": response}
        elif response == -1:
            return {"status": 200}
    except Exception as e:
        print(str(e))
        return {"status": 500, "message": str(e)}

@router.get('/getGeneratedImage')
async def getGeneratedImage():
    mutable['imageFinished'] = True
    try:
        response = mutable['imageService'].getGeneratedImage(mutable['imageTask'])
        return {"status": 200, "image": response}
    except Exception as e:
        print(str(e))
        return {"status": 500, "message": str(e)}


@router.delete('/stopImageGeneration')
async def stopImageGeneration():
    mutable['imageFinished'] = True
    try:
        mutable['imageService'].stopImageGeneration(mutable['imageTask'])
        return {"status": 200}
    except Exception as e:
        return {"status": 500, "message": str(e)}

# celery --app=app.modules.sdce.api.v1.sdce.app worker --concurrency=1 --loglevel=INFO --pool=gevent
@app.task
def generatePromptTask(service: str, base64_img: str):
    if (service == 'automatic'):
        asyncio.run(automatic1111.startImageInterrogation(base64_img))
        return {'text': automatic1111.taskResult}
    elif (service == 'aihorde'):
        asyncio.run(ai_horde.startImageInterrogation(base64_img))
        return {'text': ai_horde.taskResult}

@router.post('/generatePrompt')
async def generatePrompt(promptGenerateParams: PromptGenerateParams):
    try:
        if not promptLock.acquire(blocking_timeout=1):
            return {"status": 202, 'message': "generator is currently busy"}

        task_id = redis_instance.get(REDIS_TASK_KEY_PROMPT)
        if task_id is None or (app.AsyncResult(task_id).ready() and mutable['promptFinished'] == True):
            mutable['promptFinished'] = False
            base64_img = PromptParamProcess(promptGenerateParams)
            if (promptGenerateParams.service == 'automatic'):
                mutable['promptTask'] = generatePromptTask.delay('automatic', base64_img)
                redis_instance.set(REDIS_TASK_KEY_PROMPT, mutable['promptTask'].task_id)
                mutable['promptService'] = automatic1111;
                return {"status": 200}
            elif (promptGenerateParams.service == 'aihorde'):
                mutable['promptTask'] = generatePromptTask.delay('aihorde', base64_img)
                redis_instance.set(REDIS_TASK_KEY_PROMPT, mutable['promptTask'].task_id)
                mutable['promptService'] = ai_horde
                return {"status": 200}
            else:
                return {"status": 400, 'message': "service doesn't exist"}
        else:
            return {"status": 202, 'message': "generator is currently busy"}
    except Exception as e:
        return {"status": 500, "message": str(e)}
    finally:
        try:
            promptLock.release()
        except:
            pass

@router.get("/promptstatus")
def promptstatus():
    try:
        response = mutable['promptService'].checkImageInterrogationStatus(mutable['promptTask'])
        if not response:
            # Генерация не закончилась
            return {"status": 201}
        else:
            return {"status": 200}
    except Exception as ex:
        return {"status": 500, "message": str(ex)}

@router.get('/getGeneratedPrompt')
async def getGeneratedPrompt():
    mutable['promptFinished'] = True
    try:
        response = mutable['promptService'].getInterrogationPrompt(mutable['promptTask'])
        return {"status": 200, "prompt": response}
    except Exception as e:
        print(str(e))
        return {"status": 500, "message": str(e)}

@router.delete('/stopInterrogation')
async def stopInterrogation():
    mutable['promptFinished'] = True
    try:
        mutable['promptService'].stopImageInterrogation(mutable['promptTask'])
        return {"status": 200}
    except Exception as e:
        return {"status": 500, "message": str(e)}