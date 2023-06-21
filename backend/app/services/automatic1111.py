import json
import time
import requests
import asyncio
import aiohttp
from .IService import IService
from .requestForming import Automatic1111ImageBody, Automatic1111InterrogatorBody

class Automatic1111(IService):
    def __init__(self):
        self.model_name = ""
        self.model_file = ""
        # "../../settings.json" -> "settings.json"
        with open("settings.json") as json_data:
            data = json.load(json_data)
        self.host = data["automatic-host"]

    # -----Info-----
    def checkServiceAvailable(self):
        try:
            return requests.get(self.host + '/info').status_code == 200
        except Exception as e:
            print(str(e))
            return False

    def getInpaintModels(self):
        try:
            response_models = requests.get(self.host + '/sdapi/v1/sd-models')
            response_options = requests.get(self.host + '/sdapi/v1/options')
            if response_models.status_code != 200 or response_options.status_code != 200:
                raise Exception(str(json.loads(response_models.content)["message"]) + str(json.loads(response_options.content)["message"]))
            data_options = json.loads(response_options.content)['sd_model_checkpoint']
            model = list(filter(lambda x: x['title'] == data_options, json.loads(response_models.content)))[0]
            self.model_name = model['model_name']
            self.model_file = model['title']
            result = list(map(lambda x: x['model_name'], list(filter(lambda x: 'inpaint' in x['title'].lower(), json.loads(response_models.content)))))
            return result
        except Exception as e:
            raise Exception(str(e))

    def getInstructModels(self):
        try:
            response_models = requests.get(self.host + '/sdapi/v1/sd-models')
            response_options = requests.get(self.host + '/sdapi/v1/options')
            if response_models.status_code != 200 or response_options.status_code != 200:
                raise Exception(str(json.loads(response_models.content)["message"]) + str(
                    json.loads(response_options.content)["message"]))
            data_options = json.loads(response_options.content)['sd_model_checkpoint']
            model = list(filter(lambda x: x['title'] == data_options, json.loads(response_models.content)))[0]
            self.model_name = model['model_name']
            self.model_file = model['title']
            result = list(map(lambda x: x['model_name'], list(filter(lambda x: 'pix2pix' in x['title'].lower(), json.loads(response_models.content)))))
            return result
        except Exception as e:
            raise Exception(str(e))

    # -----Image Generation-----
    async def asyncPost(self, prompt, input_image_64, mask_image_64, cfg_scale, denoising_strength, height, width, steps):
        print("INFO: Started image generation on Automatic")
        async with aiohttp.ClientSession() as session:
            jsonBody = Automatic1111ImageBody(prompt, input_image_64, mask_image_64, cfg_scale, denoising_strength,
                                              height, width, steps)
            if mask_image_64 == "":
                jsonBody.pop('mask', None)
            async with session.post(self.host + "/sdapi/v1/img2img",
                                    json=jsonBody) as resp:
                text = json.loads(await resp.text())['images'][0]
                self.taskResult = text

    async def startImageGeneration(self, prompt, input_image_64, mask_image_64, model_name, cfg_scale, denoising_strength, height, width, steps):
        # Load selected model on machine
        if model_name != self.model_name:
            print('INFO: Setting model ' + model_name + '...')
            response_models = requests.get(self.host + '/sdapi/v1/sd-models')
            if response_models.status_code != 200:
                raise Exception("Automatic1111 models not available")
            chosen_model = list(filter(lambda x: x['model_name'] == model_name, json.loads(response_models.content)))[0]

            # Model loading takes lots of time (~20s)
            set_model_response = requests.post(self.host + '/sdapi/v1/options',
                                                 json={
                                                     "sd_model_checkpoint": chosen_model['title']
                                                 })
            if set_model_response.status_code != 200:
                raise Exception("Can't set Automatic1111 model")
            self.model_file = chosen_model['title']
            self.model_name = chosen_model['model_name']
            print('INFO: Model ' + model_name + ' successfully set')

        self.loop = asyncio.get_event_loop()
        self.task = self.loop.create_task(self.asyncPost(prompt, input_image_64, mask_image_64, cfg_scale, denoising_strength, height, width, steps))
        await (self.task)

    def checkImageGenerationStatus(self, task):
        if task.status != 'SUCCESS':
            responce_status = requests.get(self.host + '/sdapi/v1/progress')
            if responce_status.status_code != 200:
                self.imageGenInitRemainTime = 0
                self.imageGenLastProgress = 0
                print(json.loads(responce_status.content))
                raise Exception(json.loads(responce_status.content))
            else:
                return int(json.loads(responce_status.content)['progress'] * 100)
        else:
            self.imageGenInitRemainTime = 0
            self.imageGenLastProgress = 0
            return -1

    def stopImageGeneration(self, task):
        response_stop = requests.post(self.host + '/sdapi/v1/interrupt')
        if response_stop.status_code != 200:
            print(json.loads(response_stop.content))
            raise Exception(json.loads(response_stop.content))


    def getGeneratedImage(self, task):
        return "data:image/png;base64," + task.result['text']


    # -----Interrogation-----
    async def asyncPostPrompt(self, input_image_64):
        async with aiohttp.ClientSession() as session:
            print("INFO: Started image interrogation on Automatic")
            async with session.post(self.host + "/sdapi/v1/interrogate",
                                    json=Automatic1111InterrogatorBody(input_image_64)) as resp:
                print(json.loads(await resp.text()))
                text = json.loads(await resp.text())['caption']
                self.taskResult = text
                print("INFO: Automatic async post prompt succeed ")

    async def startImageInterrogation(self, input_image_64):
        self.loop = asyncio.get_event_loop()
        self.taskPrompt = self.loop.create_task(self.asyncPostPrompt(input_image_64))
        await (self.taskPrompt)

    def checkImageInterrogationStatus(self, task):
        try:
            if task.status == 'SUCCESS':
                print("INFO: Interrogation on Automatic complete")
                return True
            else:
                print("INFO: Interrogation on Automatic in process...")
                return False
        except Exception as e:
            print(e)
            return False

    def stopImageInterrogation(self, task):
        response_stop = requests.post(self.host + "/sdapi/v1/interrupt")
        if response_stop.status_code != 200:
            raise Exception(json.loads(response_stop.content))

    def getInterrogationPrompt(self, task):
        return task.result['text']

