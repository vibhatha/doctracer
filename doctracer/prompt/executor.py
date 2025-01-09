from abc import ABC, abstractmethod
from doctracer.prompt.config import MessageConfig
from doctracer.prompt.provider import ServiceProvider, AIModelProvider
import openai

class PromptStrategy:
    def __init__(self, model: AIModelProvider):
        self.model = model

    def execute(self, prompt: str):
        raise NotImplementedError("Subclasses should implement this method.")

class OpenAIStrategy(PromptStrategy):
    def __init__(self, message_config: MessageConfig, model: AIModelProvider):
        super().__init__(model)
        self.message_config = message_config
        self.client = openai.OpenAI()

    def execute(self, prompt: str):
        messages = self.message_config.get_messages(prompt)
        response = self.client.chat.completions.create(
            model=self.model.value,
            messages=messages
        )
        # TODO: Handle errors and exceptions
        response_msg = response.choices[0].message.content
        return response_msg

class AnthropicStrategy(PromptStrategy):
    def __init__(self, message_config: MessageConfig, model: AIModelProvider):
        super().__init__(model)
        self.message_config = message_config

    def execute(self, prompt: str):
        # Placeholder for Anthropic API call
        # Implement the logic for Anthropic API here
        pass

class PromptExecutor:
    def __init__(self, provider: ServiceProvider, model: AIModelProvider, message_config: MessageConfig):
        self.message_config = message_config
        self.strategy = self._get_strategy(provider, model)

    def _get_strategy(self, provider: ServiceProvider, model: AIModelProvider) -> PromptStrategy:
        if provider == ServiceProvider.OPENAI:
            return OpenAIStrategy(self.message_config, model)
        elif provider == ServiceProvider.ANTHROPIC:
            return AnthropicStrategy(self.message_config, model)
        else:
            raise ValueError(f"Unsupported provider: {provider}")

    def execute_prompt(self, prompt: str):
        return self.strategy.execute(prompt)
