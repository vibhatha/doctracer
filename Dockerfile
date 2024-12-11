# Use the official Neo4j image as the base
FROM neo4j:latest

# Set environment variables for Neo4j
# TODO: FIX THIS USING A BETTER APPROACH
ARG NEO4J_USER
ARG NEO4J_PASSWORD

# Print the username and password to the console
RUN echo "Neo4j Username: $NEO4J_USER" && echo "Neo4j Password: $NEO4J_PASSWORD"

# Expose ports for Neo4j
EXPOSE 7474 7687

# Add optional configuration files (if needed)
COPY conf/neo4j.conf /var/lib/neo4j/conf/

# Run the Neo4j server
CMD ["neo4j"]

# TRY TO FIX THIS USING A BETTER APPROACH
RUN  neo4j-admin dbms set-initial-password $NEO4J_PASSWORD