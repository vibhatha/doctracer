import os
from neo4j import GraphDatabase

class Neo4jInterface:
    def __init__(self):
        uri = os.getenv('NEO4J_URI')
        with open('/run/secrets/neo4j_user') as f:
            user = f.read().strip()
        with open('/run/secrets/neo4j_password') as f:
            password = f.read().strip()
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def execute_query(self, query, parameters=None):
        with self.driver.session() as session:
            result = session.run(query, parameters)
            return [record for record in result]
    # Add more methods as needed for your application
