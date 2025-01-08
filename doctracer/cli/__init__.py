import click
from doctracer.cli.extract import extract
# Import other subcommands as needed
# from doctracer.cli.run import run

@click.group()
def cli():
    """Doctracer command line interface."""
    pass

# Add subcommands to the main CLI group
cli.add_command(extract, name='extract')
# cli.add_command(run, name='run')  # Uncomment and implement when ready

if __name__ == "__main__":
    cli()
