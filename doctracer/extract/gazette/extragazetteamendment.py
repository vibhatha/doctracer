from doctracer.prompt.executor import PromptConfigChat, PromptExecutor
from doctracer.prompt.provider import ServiceProvider, AIModelProvider
from doctracer.prompt.config import SimpleMessageConfig
from doctracer.prompt.catalog import PromptCatalog
from doctracer.extract.gazette.gazette import BaseGazetteProcessor

class ExtraGazetteAmendmentProcessor(BaseGazetteProcessor):
    def _initialize_executor(self) -> PromptExecutor:
        return PromptExecutor(ServiceProvider.OPENAI, AIModelProvider.GPT_4O_MINI, SimpleMessageConfig())

    def _extract_metadata(self, gazette_text: str) -> str:
        metadata_prompt = PromptCatalog.get_prompt(PromptCatalog.METADATA_EXTRACTION, gazette_text)
        prompt_config = PromptConfigChat(prompt=metadata_prompt)
        return self.executor.execute_prompt(prompt_config)

    def _extract_changes(self, gazette_text: str) -> str:
        changes_prompt = PromptCatalog.get_prompt(PromptCatalog.CHANGES_AMENDMENT_EXTRACTION, gazette_text)
        prompt_config = PromptConfigChat(prompt=changes_prompt)
        return self.executor.execute_prompt(prompt_config)