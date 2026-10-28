from flask import Flask, jsonify
from flask_cors import CORS

try:
    from .database import (
        get_overview,
        get_equipment,
        get_work_orders,
        get_downtime_events,
        get_pm_tasks,
        get_handover_logs,
        get_alerts,
        init_db,
        ensure_demo_data,
    )
except ImportError:  # pragma: no cover
    from database import (
        get_overview,
        get_equipment,
        get_work_orders,
        get_downtime_events,
        get_pm_tasks,
        get_handover_logs,
        get_alerts,
        init_db,
        ensure_demo_data,
    )

app = Flask(__name__)
CORS(app)


@app.route('/api/health', methods=['GET'])
def healthcheck():
    return jsonify({"status": "ok", "service": "maintenance-demo-api"})


@app.route('/api/overview', methods=['GET'])
def overview():
    return jsonify(get_overview())


@app.route('/api/equipment', methods=['GET'])
def equipment():
    return jsonify({"items": get_equipment()})


@app.route('/api/workorders', methods=['GET'])
def workorders():
    return jsonify({"items": get_work_orders()})


@app.route('/api/downtime', methods=['GET'])
def downtime():
    return jsonify({"items": get_downtime_events()})


@app.route('/api/pm-tasks', methods=['GET'])
def pm_tasks():
    return jsonify({"items": get_pm_tasks()})


@app.route('/api/handover', methods=['GET'])
def handover_logs():
    return jsonify({"items": get_handover_logs()})


@app.route('/api/alerts', methods=['GET'])
def alerts():
    return jsonify({"items": get_alerts()})


@app.route('/api/dashboard', methods=['GET'])
def dashboard():
    return jsonify({
        "overview": get_overview(),
        "equipment": get_equipment(),
        "work_orders": get_work_orders(),
        "downtime": get_downtime_events(),
        "pm_tasks": get_pm_tasks(),
        "handover": get_handover_logs(),
        "alerts": get_alerts(),
    })


if __name__ == '__main__':
    init_db()
    ensure_demo_data()
    app.run(debug=True, host='0.0.0.0', port=5000)
