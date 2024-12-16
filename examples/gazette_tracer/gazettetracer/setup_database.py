import click
import pandas as pd
from doctracer.neo4j_interface import Neo4jInterface

neo4j_interface = Neo4jInterface()

def load_gazette_data_from_csv(driver: Neo4jInterface, csv_file: str):
    # Load CSV data
    gazettes = pd.read_csv(csv_file)
    
    # Insert nodes into Neo4j
    for _, row in gazettes.iterrows():
        query = """
        CREATE (:Gazette {gazette_id: $gazette_id, date: $date, url: $url, name: $name, description: $description})
        """
        parameters = {
            "gazette_id": row["gazette_id"],
            "date": row["date"],
            "url": row["url"],
            "name": row["name"],
            "description": row["description"],
        }
        driver.execute_query(query, parameters)

# Load relationships CSV
def load_relationships_from_csv(driver: Neo4jInterface, rel_csv_file: str):
    relationships = pd.read_csv(rel_csv_file)
    
    for _, row in relationships.iterrows():
        query = """
        MATCH (parent:Gazette {gazette_id: $parent_id}), (child:Gazette {gazette_id: $child_id})
        CREATE (child)-[:AMENDS {parent_date: $parent_date, child_date: $child_date}]->(parent)
        """
        parameters = {
            "parent_id": row["parent_id"],
            "child_id": row["child_id"],
            "parent_date": row["parent_date"],
            "child_date": row["child_date"]
        }
        driver.execute_query(query, parameters)


def delete_gazette_data(driver: Neo4jInterface):
    query = """
    MATCH (n:Gazette)
    DETACH DELETE n
    """
    driver.execute_query(query)


# Example usage

@click.group()
def cli():
    pass

@cli.command()
@click.argument('gazette_file', type=click.Path(exists=True))
@click.argument('gazette_relationship_file', type=click.Path(exists=True))
def insert(gazette_file, gazette_relationship_file):
    """Insert data from CSV files into the database."""
    load_gazette_data_from_csv(neo4j_interface, gazette_file)
    load_relationships_from_csv(neo4j_interface, gazette_relationship_file)
    print("Data and relationships loaded successfully.")

@cli.command()
def delete():
    """Delete all Gazette data from the database."""
    delete_gazette_data(neo4j_interface)
    print("All Gazette data deleted successfully.")

if __name__ == '__main__':
    cli()

# delete_gazette_data(neo4j_interface)
