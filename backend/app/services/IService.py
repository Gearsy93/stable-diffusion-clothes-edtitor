from abc import ABCMeta, abstractmethod

class IService:
    __metaclass__ = ABCMeta

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
    def checkImageGenerationStatus(self, task):
        raise NotImplementedError

    @abstractmethod
    def stopImageGeneration(self, task):
        raise NotImplementedError

    @abstractmethod
    def getGeneratedImage(self, task):
        raise NotImplementedError

    @abstractmethod
    def startImageInterrogation(self):
        raise NotImplementedError

    @abstractmethod
    def checkImageInterrogationStatus(self, task):
        raise NotImplementedError

    @abstractmethod
    def stopImageInterrogation(self, task):
        raise NotImplementedError

    @abstractmethod
    def getInterrogationPrompt(self, task):
        raise NotImplementedError