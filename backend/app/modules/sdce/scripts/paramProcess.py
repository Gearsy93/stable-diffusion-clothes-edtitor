import io
import json
import base64
from PIL import Image, ImageDraw
from app.modules.sdce.models import GenerateParams, PromptGenerateParams

def base64ToPIL(base64Image):
    encoded = str.encode(base64Image[base64Image.find('base64,') + 7:])
    return Image.open(io.BytesIO(base64.b64decode(encoded)))

def PILTobase64(PILImage):
    buffered = io.BytesIO()
    PILImage.save(buffered, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode()

def PointsToMask(maskPoints, sizes):
    img = Image.new('RGB', sizes, 'black')
    draw = ImageDraw.Draw(img)
    coords = [(pair['x'], pair['y']) for pair in maskPoints]
    draw.polygon(xy=coords, fill='white')
    return img

def ParamProcess(generateParams: GenerateParams):
    image64 = str(generateParams.image[generateParams.image.find('base64,') + 7:])
    maskPoints = json.loads(generateParams.mask)
    imagePIL = base64ToPIL(generateParams.image)
    maskImage = PointsToMask(maskPoints, imagePIL.size)
    buffered = io.BytesIO()
    maskImage.save(buffered, format="PNG")
    return image64, base64.b64encode(buffered.getvalue()).decode()

def PromptParamProcess(promptGenerateParams: PromptGenerateParams):
    return str(promptGenerateParams.image[promptGenerateParams.image.find('base64,') + 7:])