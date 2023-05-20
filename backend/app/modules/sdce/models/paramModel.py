from pydantic import BaseModel

class GenerateParams(BaseModel):
    image: str
    mask: str
    model: str
    prompt: str
    width: int
    height: int
    similatiry: int
    genSteps: int
    promptInfluence: int

class PromptGenerateParams(BaseModel):
    image: str

class Service(BaseModel):
    service: str