from doctracer.prompt.executor import OpenAIStrategy
from doctracer.prompt.provider import AIModelProvider
from doctracer.prompt.config import SimpleMessageConfig

def test_openai_prompt():
    message_config = SimpleMessageConfig()
    strategy = OpenAIStrategy(message_config, AIModelProvider.GPT_4O_MINI)
    res = strategy.execute("Add 1 + 10 and return the result. The result should be a number and nothing else.")
    assert res == "11"