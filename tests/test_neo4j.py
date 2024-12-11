from doctracer.neo4j_interface import Neo4jInterface

def test_neo4j_connection():
    neo4j_interface = Neo4jInterface()
    assert neo4j_interface.driver is not None
