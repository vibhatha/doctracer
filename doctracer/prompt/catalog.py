from enum import Enum

class PromptCatalog(Enum):
    METADATA_EXTRACTION = "metadata_extraction"
    CHANGES_EXTRACTION = "changes_extraction"
    # Add more prompts as needed

    _METADATA_PROMPT_TEMPLATE = """
    You are an assistant tasked with extracting metadata from a government gazette document. Using the provided text, identify and return the following information in JSON format:
    - Gazette ID
    - Gazette Published Date
    - Gazette Published by whom
    Input Text:
    {gazette_text}
    JSON Output:
    """

    _CHANGES_PROMPT_TEMPLATE = """
    You are an assistant tasked with extracting changes from a government gazette document. Based on the provided text, identify and list the following operation types along with their details:
    - RENAME
    - MERGE
    - MOVE
    - ADD
    - TERMINATE
    Provide the extracted data in the following JSON format:
    {{
      "Changes": [
        {{
          "OperationType": "",
          "Details": ""
        }}
      ]
    }}
    Input Text:
    {gazette_text}
    JSON Output:
    """

    @staticmethod
    def get_prompt(prompt_type, gazette_text):
        if prompt_type == PromptCatalog.METADATA_EXTRACTION:
            return PromptCatalog._METADATA_PROMPT_TEMPLATE.__format__(gazette_text=gazette_text)
        elif prompt_type == PromptCatalog.CHANGES_EXTRACTION:
            return PromptCatalog._CHANGES_PROMPT_TEMPLATE.__format__(gazette_text=gazette_text)
        # Add more prompt templates as needed
