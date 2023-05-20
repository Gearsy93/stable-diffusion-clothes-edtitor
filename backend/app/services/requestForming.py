import os
import json

def AIHordeImageBody(prompt, input_image_64, mask_image_64, model_name, cfg_scale, denoising_strength, height, width, steps):
    with open("settings.json") as json_data:
        data = json.load(json_data)
        karras = data['aihorde_karras'] == "True"
        sampler_name = data['aihorde_sampler_name']
        facefixer_strength = data['facefixer_strength']

    return {
        'censor_nsfw': False,
        'failed': False,
        'gathered': False,
        'index': 0,
        'jobId': '',
        'nsfw': True,
        'prompt': prompt,
        'r2': True,
        'shared': False,
        'source_image': input_image_64,
        'source_mask': mask_image_64,
        'source_processing': 'inpainting',
        'trusted_workers': False,
        'models': [model_name],
        'params': {
            'cfg_scale': cfg_scale,
            'clip_skip': 1,
            'denoising_strength': denoising_strength,
            'height': height,
            'hires_fix': False,
            'karras': karras,
            'n': 1,
            'post_processing': [],
            'sampler_name': sampler_name,
            "facefixer_strength": facefixer_strength,
            'seed': "",
            'seed_variation': 1000,
            'steps': steps,
            'tiling': False,
            'width': width
        }
    }

def AIHordeInterrogatorBody(input_image_64):
    return {
        'forms': [
            {
                'name': 'nsfw'
            },
            {
                'name': 'caption'
            }
        ],
        'source_image': input_image_64
    }

def AIHordeHeader():
    with open("settings.json") as json_data:
        apikey = json.load(json_data)['aihorde_api_key']

    return {
        'accept': 'application/json',
        'apikey': apikey
    }

def Automatic1111ImageBody(prompt, input_image_64, mask_image_64, cfg_scale, denoising_strength, height, width, steps):
    return {
        "init_images": [
            input_image_64
        ],
        "resize_mode": 1,
        "denoising_strength": denoising_strength,
        "mask": mask_image_64,
        "prompt": prompt,
        "steps": steps,
        "cfg_scale": cfg_scale,
        "width": width,
        "height": height,
        "restore_faces": "true"
    }

def Automatic1111InterrogatorBody(input_image_64):
    return {
        'image': input_image_64,
        "model": "clip"
    }

# "init_images": [
#             input_image_64
#           ],
#           "resize_mode": 0,
#           "denoising_strength": denoising_strength,
#           "image_cfg_scale": 0,
#           "mask": mask_image_64,
#           "mask_blur": 4,
#           "inpainting_fill": 0,
#           "inpaint_full_res": True,
#           "inpaint_full_res_padding": 0,
#           "inpainting_mask_invert": 0,
#           "initial_noise_multiplier": 0,
#           "prompt": prompt,
#           # "styles": [
#           #   "string"
#           # ],
#           "seed": -1,
#           "subseed": -1,
#           "subseed_strength": 0,
#           "seed_resize_from_h": -1,
#           "seed_resize_from_w": -1,
#           #"sampler_name": "string",
#           "batch_size": 1,
#           "n_iter": 1,
#           "steps": steps,
#           "cfg_scale": cfg_scale,
#           "width": width,
#           "height": height,
#           "restore_faces": False,
#           "tiling": False,
#           "do_not_save_samples": False,
#           "do_not_save_grid": False,
#           #"negative_prompt": "string",
#           "eta": 0,
#           "s_min_uncond": 0,
#           "s_churn": 0,
#           "s_tmax": 0,
#           "s_tmin": 0,
#           "s_noise": 1,
#           "override_settings": {},
#           "override_settings_restore_afterwards": True,
#           "script_args": [],
#           #"sampler_index": "Euler",
#           "include_init_images": False,
#           #"script_name": "string",
#           "send_images": True,
#           "save_images": False,
#           #"alwayson_scripts": {}