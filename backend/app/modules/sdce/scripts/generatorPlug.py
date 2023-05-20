import time

def GenerateImage(imagePIL, maskImage, prompt, width, height, similatiry, genSteps, consistentSteps, mutable):
    for i in range(0, 101):
        time.sleep(0.05)
        mutable['imageStatus'] = i
    mutable['image'] = maskImage

def GeneratePrompt(imagePIL, mutable):
    for i in range(0, 101):
        time.sleep(0.05)
    mutable['promptStatus'] = 'done'
    mutable['prompt'] = 'some generated prompt'
