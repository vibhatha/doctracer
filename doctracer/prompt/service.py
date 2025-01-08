from enum import Enum

class ServiceProvider(Enum):
    OPENAI = "openai"
    GOOGLE = "google"
    AZURE = "azure"
    HUGGINGFACE = "huggingface"
    LOCAL = "local"
