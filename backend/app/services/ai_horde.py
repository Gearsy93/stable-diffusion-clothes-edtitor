import io
import json
import time
import requests
import urllib.request
from PIL import Image
from .IService import IService
from .requestForming import AIHordeImageBody, AIHordeInterrogatorBody, AIHordeHeader
from app.modules.sdce.scripts.paramProcess import PILTobase64

import asyncio

class AIHorde(IService):
    def __init__(self):
        self.image_id = ""
        self.prompt_id = ""
        self.interrogationResult = ""
        self.imageGenInitRemainTime = 0
        self.imageGenLastProgress = 0

    # -----Info-----
    def checkServiceAvailable(self):
        try:
            return \
                    requests.options("https://stablehorde.net/api/v2/generate/async").status_code == 200 \
                    and requests.options("https://stablehorde.net/api/v2/interrogate/async").status_code == 200
        except Exception as e:
            print(str(e))
            return False

    def getInpaintModels(self):
        response = requests.get("https://stablehorde.net/api/v2/status/models")
        if response.status_code != 200:
            try:
                raise Exception(json.loads(response.content)["message"])
            except Exception as e:
                raise Exception(str(e))
        else:
            # API не предоставляет тип модели "inpaint"
            return list(filter(lambda model_name: "inpaint" in model_name, [i['name'].lower() for i in json.loads(response.content)]))

    def getInstructModels(self):
        print('horde trying get pix2pix')
        response = requests.get("https://stablehorde.net/api/v2/status/models")
        if response.status_code != 200:
            try:
                raise Exception(json.loads(response.content)["message"])
            except Exception as e:
                raise Exception(str(e))
        else:
            # API не предоставляет тип модели "inpaint"
            return list(filter(lambda model_name: "pix2pix" in model_name,
                               [i['name'].lower() for i in json.loads(response.content)]))

    async def asyncPostImage(self, prompt, input_image_64, mask_image_64, model_name, cfg_scale, denoising_strength, height, width, steps):
        self.imageGenInitRemainTime = 0
        self.imageGenLastProgress = 0
        jsonBody = AIHordeImageBody(prompt, input_image_64, mask_image_64, model_name, cfg_scale, denoising_strength,
                                    height, width, steps)
        if mask_image_64 == "":
            jsonBody.pop('source_mask', None)
            jsonBody['source_processing'] = 'img2img'
        response = requests.post("https://stablehorde.net/api/v2/generate/async",
                                 headers=AIHordeHeader(),
                                 json=jsonBody)
        if response.status_code != 202:
            try:
                raise Exception(json.loads(response.content)["message"])
            except Exception as e:
                raise Exception(str(e))
        else:
            self.taskResult = (json.loads(response.content))['id']
            print("INFO: Got in image queue with ID: " + str(self.taskResult))
            while True:
                response_1 = requests.get("https://stablehorde.net/api/v2/generate/check/" + self.taskResult)
                if response_1.status_code != 200:
                    try:
                        raise Exception(json.loads(response.content)["message"])
                    except Exception as e:
                        raise Exception(str(e))
                else:
                    data = json.loads(response_1.content)
                    if not (data['wait_time'] == 0 and data['queue_position'] == 0 and data['finished'] == 0):
                        if not data['wait_time'] == 0:
                            self.imageGenInitRemainTime = data['wait_time']
                            print("INFO: Initial wait time for id " + str(self.taskResult) + ": " + str(
                                self.imageGenInitRemainTime))
                            return
                    if data['finished'] == 1:
                        return
                    time.sleep(0.1)

    # -----Image Generation-----
    async def startImageGeneration(self, prompt, input_image_64, mask_image_64, model_name, cfg_scale, denoising_strength, height, width, steps):
        self.loop = asyncio.get_event_loop()
        self.taskPrompt = self.loop.create_task(self.asyncPostImage(prompt, input_image_64, mask_image_64, model_name, cfg_scale, denoising_strength, height, width, steps))
        await (self.taskPrompt)

    def checkImageGenerationStatus(self, task):
        if task.status == 'SUCCESS':
            response = requests.get("https://stablehorde.net/api/v2/generate/check/" + str(task.result['text']))
            if response.status_code != 200:
                self.imageGenInitRemainTime = 0
                self.imageGenLastProgress = 0
                try:
                    raise Exception(json.loads(response.content)["message"])
                except Exception as e:
                    raise Exception(str(e))
            else:
                data = json.loads(response.content)

                # finished
                if data['finished'] == 1:
                    self.imageGenInitRemainTime = 0
                    self.imageGenLastProgress = 0
                    return -1
                else:
                    # Прогресс (на основе оставшегося времени)
                    if (data['wait_time'] > self.imageGenInitRemainTime):
                        self.imageGenInitRemainTime = data['wait_time']
                    imageGenProgress = round(((self.imageGenInitRemainTime - data['wait_time']) / self.imageGenInitRemainTime) * 100)
                    returnProgress = self.imageGenLastProgress if imageGenProgress < self.imageGenLastProgress else imageGenProgress
                    self.imageGenLastProgress = returnProgress
                    print("INFO: Wait time for id " + str(task.result['text']) + ": " + str(data['wait_time']))
                    return self.imageGenLastProgress
        else:
            return 0

    def stopImageGeneration(self, task):
        response = requests.delete("https://stablehorde.net/api/v2/generate/status/" + task.result['text'])
        if response.status_code != 200:
            try:
                raise Exception(json.loads(response.content)["message"])
            except Exception as e:
                raise Exception(str(e))
        else:
            # API не предоставляет информацию об остановке
            print("INFO: Generation request with id: " + str(task.result['text']) + " canceled")
            pass

    def getGeneratedImage(self, task):
        response = requests.get("https://stablehorde.net/api/v2/generate/status/" + str(task.result['text']))
        if response.status_code != 200:
            try:
                raise Exception(json.loads(response.content)["message"])
            except Exception as e:
                raise Exception(str(e))
        else:
            try:
                urlReader = urllib.request.urlopen((json.loads(response.content))['generations'][0]['img'])
                raw_data = urlReader.read()
                urlReader.close()
                im = Image.open(io.BytesIO(raw_data))
                print("INFO: Successfully generated image with id: " + str(task.result['text']))
                return PILTobase64(im)
            except Exception as e:
                raise Exception(str(e))

    # -----Interrogation-----
    async def asyncPostPrompt(self, input_image_64):
        response = requests.post("https://stablehorde.net/api/v2/interrogate/async",
                                 headers=AIHordeHeader(),
                                 json=AIHordeInterrogatorBody(input_image_64))
        if response.status_code != 202:
            try:
                raise Exception(json.loads(response.content)["message"])
            except Exception as e:
                raise Exception(str(e))
        else:
            self.taskResult = (json.loads(response.content))['id']
            print("INFO: Got in interrogate queue with ID: " + str(self.prompt_id))

    async def startImageInterrogation(self, input_image_64):
        self.loop = asyncio.get_event_loop()
        self.taskPrompt = self.loop.create_task(self.asyncPostPrompt(input_image_64))
        await (self.taskPrompt)

    def checkImageInterrogationStatus(self, task):
        if task.status == 'SUCCESS':
            response = requests.get("https://stablehorde.net/api/v2/interrogate/status/" + task.result['text'])
            if response.status_code != 200:
                try:
                    raise Exception(json.loads(response.content)["message"])
                except Exception as e:
                    raise Exception(str(e))
            else:
                if json.loads(response.content)['state'] == "done":
                    try:
                        self.interrogationResult = json.loads(response.content)['forms'][0]['result']['caption']
                    except:
                        self.interrogationResult = json.loads(response.content)['forms'][1]['result']['caption']
                    print("INFO: Interrogation with id " + str(task.result['text']) + " on AI Horde complete")
                    return True
                else:
                    print("INFO: Interrogation  with id " + str(task.result['text']) + " on AI Horde in process...")
                    return False
        else:
            return False

    def stopImageInterrogation(self, task):
        response = requests.delete("https://stablehorde.net/api/v2/interrogate/status/" + str(task.result['text']))
        if response.status_code != 200:
            try:
                raise Exception(json.loads(response.content)["message"])
            except Exception as e:
                raise Exception(str(e))
        else:
            if json.loads(response.content)['forms'][1]['state'] != 'cancelled':
                raise Exception("Error while stopping interrogation")
            print("INFO: Interrogation request with id: " + str(task.result['text']) + " canceled")

    def getInterrogationPrompt(self, task):
        return self.interrogationResult
