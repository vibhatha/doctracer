from doctracer.extract.gazette.gazette import BaseGazetteProcessor
from doctracer.prompt.catalog import PromptCatalog
from doctracer.prompt.config import SimpleMessageConfig
from doctracer.prompt.executor import PromptConfigImage, PromptExecutor
from doctracer.prompt.provider import AIModelProvider, ServiceProvider
import os
import base64


class ExtraGazetteTableProcessor(BaseGazetteProcessor):
    def _initialize_executor(self) -> PromptExecutor:
        return PromptExecutor(ServiceProvider.OPENAI_VISION, AIModelProvider.GPT_4O_MINI, SimpleMessageConfig())

    def _extract_metadata(self, gazette_text: str) -> str:
        metadata_prompt = PromptCatalog.get_prompt(PromptCatalog.METADATA_EXTRACTION, gazette_text)
        return self.executor.execute_prompt(metadata_prompt)
  
    def _extract_changes(self, gazette_text: str = None) -> str:
        changes_prompt = PromptCatalog.get_prompt(PromptCatalog.CHANGES_TABLE_EXTRACTION)
        filename = self.pdf_path

        base64_image = self._encode_image(filename)

        prompt_config = PromptConfigImage(prompt=changes_prompt, image=base64_image)

        return self.executor.execute_prompt(prompt_config)
        
    # Function to encode an image in base64
    def _encode_image(self,image_path):
        """Encodes an image file in base64 format."""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')
        
    def process_gazettes(self):
        changes = self._extract_changes()
        return changes