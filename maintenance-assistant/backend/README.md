# Maintenance Assistant Demo API

This folder contains a lightweight SQLite-backed demo API for the Maintenance Assistant application.

## Files
- `database.py` - creates the SQLite schema and demo records
- `app.py` - Flask API routes for an overview dashboard and maintenance data
- `seed_demo_data.py` - convenience script to initialize the database with sample data

## Usage

From the project root:

```bash
cd maintenance-assistant/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Then browse:

- http://localhost:5000/api/health
- http://localhost:5000/api/dashboard
- http://localhost:5000/api/workorders
- http://localhost:5000/api/downtime
- http://localhost:5000/api/pm-tasks
- http://localhost:5000/api/handover

This gives you a demo-ready backend for showing equipment, downtime, PM tasks, alerts, and shift handover data to customers.
