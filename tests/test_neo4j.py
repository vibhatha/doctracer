from doctracer.neo4j_interface import Neo4jInterface

def test_neo4j_connection():
    with Neo4jInterface() as neo4j_interface:
        assert neo4j_interface.driver is not None

def test_neo4j_insert_verify_delete():
    with Neo4jInterface() as neo4j_interface:
        # Insert dummy data
        insert_query = "CREATE (n:Person {name: 'John Doe', age: 30})"
        neo4j_interface.execute_query(insert_query)

        # Verify the data is inserted
        verify_query = "MATCH (n:Person {name: 'John Doe', age: 30}) RETURN n"
        result = neo4j_interface.execute_query(verify_query)
        assert len(result) == 1  # Ensure the node exists

        # Delete the dummy data
        delete_query = "MATCH (n:Person {name: 'John Doe', age: 30}) DELETE n"
        neo4j_interface.execute_query(delete_query)

        # Verify the data is deleted
        verify_deletion_query = "MATCH (n:Person {name: 'John Doe', age: 30}) RETURN n"
        result_after_deletion = neo4j_interface.execute_query(verify_deletion_query)
        assert len(result_after_deletion) == 0  # Ensure the node is deleted
