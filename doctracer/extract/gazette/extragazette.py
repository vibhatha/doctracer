from doctracer.prompt.executor import PromptExecutor
from doctracer.prompt.service import ServiceProvider
from doctracer.prompt.catalog import PromptCatalog
from doctracer.extract.gazette.gazette import BaseGazetteProcessor

class ExtraGazetteProcessor(BaseGazetteProcessor):
    def _initialize_executor(self) -> PromptExecutor:
        return PromptExecutor(ServiceProvider.OPENAI)

    def _extract_metadata(self, gazette_text: str) -> dict:
        metadata_prompt = PromptCatalog.get_prompt(PromptCatalog.METADATA_EXTRACTION, gazette_text)
        return self.executor.execute_prompt(metadata_prompt)

    def _extract_changes(self, gazette_text: str) -> dict:
        changes_prompt = PromptCatalog.get_prompt(PromptCatalog.CHANGES_EXTRACTION, gazette_text)
        return self.executor.execute_prompt(changes_prompt)