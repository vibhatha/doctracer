# doctracer

## Prerequisites

```bash
mamba create -n doctracer_env python=3.9
```

### Setup Neo4j

#### Environment Variables

Before using the `Neo4jInterface`, ensure the following environment variables are set:

- `NEO4J_URI`: The URI of your Neo4j database.
- `NEO4J_USER`: The username for your Neo4j database.
- `NEO4J_PASSWORD`: The password for your Neo4j database.

You can set these variables in your shell like this:

```bash
export NEO4J_URI=bolt://localhost:7687
export NEO4J_USER=neo4j_username
export NEO4J_PASSWORD=your_password
```

```bash
docker build --build-arg NEO4J_USER=$NEO4J_USER --build-arg NEO4J_PASSWORD=$NEO4J_PASSWORD -t doctracer_neo4j .
```

Ensure you have a `.env` file in your project directory with the following content:

```plaintext
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
```


#### Running the Docker Container

To run the Docker container with the environment variables from the `.env` file, use the following command:

```bash
docker run -p 7474:7474 -p 7687:7687 --name doctracer_neo4j_server \
    --env-file .env \
    -v neo4j_data:/data doctracer_neo4j:latest
```

```bash
docker exec -it doctracer_neo4j_server bash
```

```bash
neo4j-admin set-initial-password test
```

## Running Doctracer

```bash
$ doctracer --help
Usage: doctracer [OPTIONS] COMMAND [ARGS]...

  Doctracer command line interface.

Options:
  --help  Show this message and exit.

Commands:
  extract  Extract information from gazette PDFs.
```

```bash
doctracer extract --type extragazette --input gzt.pdf --output output.json
```

```bash
{
  "metadata": {
    "Gazette ID": "2382/35",
    "Gazette Published Date": "2024-05-03",
    "Gazette Published by": "Authority"
  },
  "changes": {
    "RENAME": [],
    "MERGE": [],
    "MOVE": [],
    "ADD": [
      {
        "Parent Name": "Minister of Defence",
        "Child Name": "National Hydrographic Act No. 7 of 2024",
        "Type": "legislation",
        "Date": "2024-05-03"
      },
      {
        "Parent Name": "Minister of Education",
        "Child Name": "Formulation and implementation of a national policy for pre-schools",
        "Type": "policy",
        "Date": "2024-05-03"
      }
    ],
    "TERMINATE": [
      {
        "Type": "policy",
        "Date": "2024-05-03"
      }
    ]
  }
}
```
