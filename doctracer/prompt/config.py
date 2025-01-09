from abc import ABC, abstractmethod

class MessageConfig(ABC):
    @abstractmethod
    def get_messages(self, prompt: str):
        raise NotImplementedError("Subclasses should implement this method.")

class SimpleMessageConfig(MessageConfig):
    def get_messages(self, prompt: str):
        return [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]