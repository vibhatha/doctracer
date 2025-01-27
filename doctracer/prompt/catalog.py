from enum import Enum

_METADATA_PROMPT_TEMPLATE: str = """
    You are an assistant tasked with extracting metadata from a government gazette document. Using the provided text, identify and return the following information in a compact JSON string:
    - Gazette ID
    - Gazette Published Date
    - Gazette Published by whom
    Ensure the JSON string is compact, without any additional formatting or escape characters.
    Don't include unnecessary backward slashes or forward slashes unless the data contains them. 
    Input Text:
    {gazette_text}
    Sample JSON Output:
    {{"Gazette ID":"2303/17","Gazette Published Date":"2022-10-26","Gazette Published by":"Authority"}}
    """

_CHANGES_AMENDMENT_PROMPT_TEMPLATE: str = """
    You are an assistant tasked with extracting changes from a government gazette document. Based on the provided text, identify and list the following operation types along with their details:
    - RENAME
    - MERGE
    - MOVE
    - ADD
    - TERMINATE
    Provide the extracted data as a compact JSON string, without any additional formatting or escape characters.
    Don't include unnecessary backward slashes or forward slashes unless the data contains them.
    Input Text:
    {gazette_text}
    Sample JSON Output:
    {{"RENAME":[{{"Previous Name":"No. 03. Minister of Technology","New Name":"No. 03. Minister of Technology","Type":"minister","Date":"2022-10-26"}}],
    "MERGE":[{{"Previous Names":["Dept. A", "Dept. B"],"New Name":"Dept. AB","Type":"department merge","Date":"2022-10-26"}}],
    "MOVE":[{{"Previous Parent Name":"Ministry X","New Parent Name":"Ministry Y","Which Child is Moving":"Dept. Z","Type":"department","Date":"2022-10-26"}}],
    "ADD":[{{"Parent Name":"Ministry X","Child Name":"Dept. Z","Type":"department","Date":"2022-10-26"}}],
    "TERMINATE":[{{"Type":"minister","Date":"2022-10-26"}}]}}
    """

class PromptCatalog(Enum):
    METADATA_EXTRACTION = "metadata_extraction"
    CHANGES_AMENDMENT_EXTRACTION = "changes_amendment_extraction"
    # Add more prompts as needed

    @staticmethod
    def get_prompt(prompt_type, gazette_text):
        if prompt_type == PromptCatalog.METADATA_EXTRACTION:
            return _METADATA_PROMPT_TEMPLATE.format(gazette_text=gazette_text)
        elif prompt_type == PromptCatalog.CHANGES_AMENDMENT_EXTRACTION:
            return _CHANGES_AMENDMENT_PROMPT_TEMPLATE.format(gazette_text=gazette_text)
        
        # Add more prompt templates as needed
