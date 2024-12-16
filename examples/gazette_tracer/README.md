## gazette_tracer

Move this application to a separate repo

This example demonstrates how to use the Gazette Tracer to trace the relationships between gazettes.

### Setup

```bash
pip install -r requirements.txt
```

### Insert data

```bash
python setup_database.py insert data/gazettes.csv data/gazette_relationships_with_dates.csv
```

### Delete data

```bash
python setup_database.py delete
```

## Run the Flask server

```bash
export NEO4J_URI=bolt://localhost:7687
export NEO4J_USER=your_username
export NEO4J_PASSWORD=your_password

export FLASK_APP=render.py
flask run
```


