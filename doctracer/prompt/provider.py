from enum import Enum

class ServiceProvider(Enum):
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE = "google"
    AZURE = "azure"
    HUGGINGFACE = "huggingface"
    LOCAL = "local"
    OPENAI_VISION = "openai_vision"

class AIModelProvider(Enum):
    GPT_3 = "gpt-3"
    GPT_4 = "gpt-4"
    GPT_4O = "gpt-4o"
    GPT_4O_MINI = "gpt-4o-mini"
    CLAUDE_3_5_SONNET = "claude-3-5-sonnet"
    CLAUDE_3_5_SONNET_20240620 = "claude-3-5-sonnet-20240620"
    CLAUDE_3_5_SONNET_20240718 = "claude-3-5-sonnet-20240718"
