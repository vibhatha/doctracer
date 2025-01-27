import click
from typing import List
from pathlib import Path
from doctracer.extract.gazette.extragazette import ExtraGazetteAmendmentProcessor
import json

PROCESSOR_TYPES = {
    'extragazette_amendment': ExtraGazetteAmendmentProcessor,
    # Add more processor types here
}

@click.command()
@click.option(
    '--type',
    'processor_type',
    type=click.Choice(PROCESSOR_TYPES.keys()),
    required=True,
    help='Type of gazette processor to use'
)
@click.option(
    '--input',
    'input_path',
    type=click.Path(exists=True),
    required=True,
    help='Input PDF file or directory'
)
@click.option(
    '--output',
    'output_path',
    type=click.Path(),
    required=True,
    help='Output file path'
)
def extract(processor_type: str, input_path: str, output_path: str):
    """Extract information from gazette PDFs."""
    input_path = Path(input_path)
    
    # Handle both single file and directory inputs
    if input_path.is_file():
        pdf_path = input_path
    elif input_path.is_dir():
        raise click.BadParameter("Directory input is not supported for this processor")
    
    if not pdf_path:
        raise click.BadParameter("No PDF files found in the input path")

    # Initialize the appropriate processor
    processor_class = PROCESSOR_TYPES[processor_type]

    processor = processor_class(pdf_path)
    
    # Process the gazettes
    output: str = processor.process_gazettes()
    # Save the output as a text file
    with open(output_path, 'w') as text_file:
        text_file.write(output)
    
    click.echo(f"✓ Processed. Results saved to {output_path}") 