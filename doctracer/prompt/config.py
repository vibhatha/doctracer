from abc import ABC, abstractmethod

class MessageConfig(ABC):
    @abstractmethod
    def get_messages(self, prompt: str):
        raise NotImplementedError("Subclasses should implement this method.")
    
    @abstractmethod
    def get_image_messages(self, prompt: str, image: str):
        raise NotImplementedError("Subclasses should implement this method.")

class SimpleMessageConfig(MessageConfig):
    def get_messages(self, prompt: str):
        return [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    
    def get_image_messages(self, prompt: str, image: str):
        return [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image}"}}
                ]
            }
        ]
    