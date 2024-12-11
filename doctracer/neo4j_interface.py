import os
from neo4j import GraphDatabase

class Neo4jInterface:
    def __init__(self, uri=None, user=None, password=None):
        uri = uri or os.getenv('NEO4J_URI')
        user = user or os.getenv('NEO4J_USER')
        password = password or os.getenv('NEO4J_PASSWORD')
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

    def close(self):
        self.driver.close()

    def execute_query(self, query, parameters=None):
        with self.driver.session() as session:
            result = session.run(query, parameters)
            return [record for record in result]

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.close()
