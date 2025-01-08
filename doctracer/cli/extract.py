import click
from typing import List
from pathlib import Path
from doctracer.extract.gazette.extragazette import ExtraGazetteProcessor

PROCESSOR_TYPES = {
    'extragazette': ExtraGazetteProcessor,
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
    pdf_paths: List[str] = []
    
    # Handle both single file and directory inputs
    if input_path.is_file():
        pdf_paths = [str(input_path)]
    elif input_path.is_dir():
        pdf_paths = [str(p) for p in input_path.glob("*.pdf")]
    
    if not pdf_paths:
        raise click.BadParameter("No PDF files found in the input path")

    # Initialize the appropriate processor
    processor_class = PROCESSOR_TYPES[processor_type]
    processor = processor_class(pdf_paths)
    
    # Process the gazettes
    results = processor.process_gazettes()
    
    # Save results
    import json
    with open(output_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    click.echo(f"✓ Processed {len(results)} gazette(s). Results saved to {output_path}") 
