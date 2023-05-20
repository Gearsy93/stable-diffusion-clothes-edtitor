from abc import ABCMeta, abstractmethod

class IService:
    __metaclass__ = ABCMeta

    @abstractmethod
    # def checkServiceAvailable(self):
    #     raise NotImplementedError

    @abstractmethod
    def getInpaintModels(self):
        raise NotImplementedError

    @abstractmethod
    def getInstructModels(self):
        raise NotImplementedError

    @abstractmethod
    def startImageGeneration(self):
        raise NotImplementedError

    @abstractmethod
    def startInstructImageGeneration(self):
        raise NotImplementedError

    @abstractmethod
    def checkImageGenerationStatus(self):
        raise NotImplementedError

    @abstractmethod
    def stopImageGeneration(self):
        raise NotImplementedError

    @abstractmethod
    def getGeneratedImage(self):
        raise NotImplementedError

    @abstractmethod
    def startImageInterrogation(self):
        raise NotImplementedError

    @abstractmethod
    def checkImageInterrogationStatus(self):
        raise NotImplementedError

    @abstractmethod
    def stopImageInterrogation(self):
        raise NotImplementedError

    @abstractmethod
    def getInterrogationPrompt(self):
        raise NotImplementedError