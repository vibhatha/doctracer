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

_CHANGES_TABLE_PROMPT_TEMPLATE: str = """
        What are the ministers found in the image? There will always be at least one minister. Use this information to find the minister(s):
        - The minister begins with a number (example 1. Minister of Defence)
        - The minister is in the format "Minister of ..."
        - The minister is in bold
        - The minister is not found inside any table or columns

        Also retrieve lists of the 'subjects and functions', 'departments, statutory institutions and public corporations' and 'laws, acts and ordinances to be implemented' in this image for each minister identified. If there are none in either column leave the list empty for that column.

        Return the information as a JSON object, for example:

        {
            "ministers": 
            [
                {
                    "name": "Minister of Defence",
                    "functions": [
                        "Ensure national security",
                        "Coordinate armed forces",
                        "Develop defense policies"
                    ],
                    "departments": [
                        "Office of the Chief of Defence Staff",
                        "Sri Lanka Army",
                        "Sri Lanka Navy"
                    ],
                    "laws": [
                        "National Security Act No. 45 of 2003",
                        "Military Ordinance No. 12 of 1945"
                    ]
                },
            ]
        }

        Don't add any extra text such as ```json so that i can directly save the response to a json file.
    """

class PromptCatalog(Enum):
    METADATA_EXTRACTION = "metadata_extraction"
    CHANGES_AMENDMENT_EXTRACTION = "changes_amendment_extraction"
    CHANGES_TABLE_EXTRACTION = "changes_table_extraction"
    # Add more prompts as needed

    @staticmethod
    def get_prompt(prompt_type, gazette_text=None):
        if prompt_type == PromptCatalog.METADATA_EXTRACTION:
            if gazette_text is None:
                raise ValueError("The 'gazette_text' parameter is required for METADATA_EXTRACTION.")
            return _METADATA_PROMPT_TEMPLATE.format(gazette_text=gazette_text)
        
        elif prompt_type == PromptCatalog.CHANGES_AMENDMENT_EXTRACTION:
            if gazette_text is None:
                raise ValueError("The 'gazette_text' parameter is required for CHANGES_AMENDMENT_EXTRACTION.")
            return _CHANGES_AMENDMENT_PROMPT_TEMPLATE.format(gazette_text=gazette_text)
        elif prompt_type == PromptCatalog.CHANGES_TABLE_EXTRACTION:
            # No gazette_text needed for this prompt
            return _CHANGES_TABLE_PROMPT_TEMPLATE
        else:
            raise ValueError(f"Unsupported prompt type: {prompt_type}")

