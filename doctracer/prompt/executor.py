import openai
from doctracer.prompt.service import ServiceProvider

class PromptExecutor:
    def __init__(self, provider: ServiceProvider):
        self.provider = provider

    def execute_prompt(self, prompt: str, model: str = "gpt-4o-mini"):
        if self.provider == ServiceProvider.OPENAI:
            return self._execute_openai_prompt(prompt, model)
        # Add other providers' execution logic here

    def _execute_openai_prompt(self, prompt: str, model: str):
        response = openai.ChatCompletion.create(
            model=model,
            messages=[{"role": "system", "content": "You are a helpful assistant."},
                      {"role": "user", "content": prompt}]
        )
        return response["choices"][0]["message"]["content"]
