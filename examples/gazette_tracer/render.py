from flask import Flask, jsonify
from flask_cors import CORS
from doctracer.neo4j_interface import Neo4jInterface

app = Flask(__name__)
neo4j = Neo4jInterface()

# Allow all origins or specify a list of allowed origins
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route("/timeline")
def timeline():
    query = """
    MATCH (g:Gazette)
    RETURN g.gazette_id AS id,
           g.date AS date,
           g.name AS name,
           g.url AS url
    ORDER BY g.date
    """
    results = neo4j.execute_query(query)
    return jsonify(results)

@app.route("/graph")
def graph():
    query = """
    MATCH (child:Gazette)-[r:AMENDS]->(parent:Gazette)
    RETURN child.gazette_id AS child_id,
           parent.gazette_id AS parent_id,
           child.date AS child_date,
           parent.date AS parent_date,
           child.url AS child_url,
           parent.url AS parent_url
    """
    results = neo4j.execute_query(query)
    return jsonify(results)


@app.route("/parents")
def parents():
    query = """
    // Query for nodes with no relationships
    MATCH (node:Gazette)
    WHERE NOT (node)--()
    RETURN DISTINCT node.gazette_id AS id,
           node.date AS date,
           node.name AS name,
           node.url AS url

    UNION

    // Query for distinct parent nodes in AMENDS relationships
    MATCH (child:Gazette)-[:AMENDS]->(parent:Gazette)
    RETURN DISTINCT parent.gazette_id AS id,
           parent.date AS date,
           parent.name AS name,
           parent.url AS url;
    """
    results = neo4j.execute_query(query)
    return jsonify(results)
