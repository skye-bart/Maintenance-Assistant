import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / 'demo_maintenance.db'


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS equipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            area TEXT NOT NULL,
            status TEXT NOT NULL,
            criticality TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS work_orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equipment_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            priority TEXT NOT NULL,
            status TEXT NOT NULL,
            assignee TEXT NOT NULL,
            due_date TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (equipment_id) REFERENCES equipment(id)
        );

        CREATE TABLE IF NOT EXISTS downtime_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equipment_id INTEGER NOT NULL,
            reason TEXT NOT NULL,
            minutes_lost INTEGER NOT NULL,
            shift TEXT NOT NULL,
            date TEXT NOT NULL,
            FOREIGN KEY (equipment_id) REFERENCES equipment(id)
        );

        CREATE TABLE IF NOT EXISTS pm_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equipment_id INTEGER NOT NULL,
            task_name TEXT NOT NULL,
            due_date TEXT NOT NULL,
            status TEXT NOT NULL,
            FOREIGN KEY (equipment_id) REFERENCES equipment(id)
        );

        CREATE TABLE IF NOT EXISTS handover_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shift_name TEXT NOT NULL,
            notes TEXT NOT NULL,
            created_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equipment_id INTEGER,
            message TEXT NOT NULL,
            severity TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (equipment_id) REFERENCES equipment(id)
        );
        """
    )
    conn.commit()
    conn.close()


def _fetch_all(query, params=()):
    conn = get_connection()
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def ensure_demo_data():
    conn = get_connection()
    equipment_count = conn.execute('SELECT COUNT(*) FROM equipment').fetchone()[0]
    if equipment_count > 0:
        conn.close()
        return

    equipment_rows = [
        ('Hydraulic Press', 'Press Area', 'Running', 'Critical'),
        ('Conveyor Line 2', 'Packaging', 'Running', 'High'),
        ('Air Compressor', 'Utilities', 'Monitoring', 'High'),
        ('Boiler Feed Pump', 'Boiler House', 'Warning', 'Critical'),
        ('Cooling Tower', 'Utilities', 'Running', 'Medium'),
    ]

    conn.executemany(
        'INSERT INTO equipment (name, area, status, criticality) VALUES (?, ?, ?, ?)',
        equipment_rows,
    )
    conn.commit()

    equipment = conn.execute('SELECT id, name FROM equipment').fetchall()
    equipment_by_name = {row['name']: row['id'] for row in equipment}

    work_orders = [
        (equipment_by_name['Hydraulic Press'], 'Inspect seal set and hydraulic pressure', 'High', 'Open', 'A. Morris', '2026-10-30', '2026-10-28T07:00:00'),
        (equipment_by_name['Conveyor Line 2'], 'Replace belt tension arm', 'Critical', 'In Progress', 'T. Brooks', '2026-10-29', '2026-10-28T06:30:00'),
        (equipment_by_name['Air Compressor'], 'Replace inlet filter element', 'Medium', 'Scheduled', 'R. Patel', '2026-10-31', '2026-10-27T12:15:00'),
        (equipment_by_name['Boiler Feed Pump'], 'Check vibration baseline and bearings', 'Critical', 'Open', 'K. Nguyen', '2026-10-30', '2026-10-28T08:00:00'),
    ]

    conn.executemany(
        'INSERT INTO work_orders (equipment_id, title, priority, status, assignee, due_date, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        work_orders,
    )

    downtime_events = [
        (equipment_by_name['Conveyor Line 2'], 'Mechanical jam', 42, 'Day', '2026-10-27'),
        (equipment_by_name['Hydraulic Press'], 'Sensor fault', 28, 'Night', '2026-10-26'),
        (equipment_by_name['Air Compressor'], 'Power fluctuation', 19, 'Swing', '2026-10-25'),
        (equipment_by_name['Boiler Feed Pump'], 'Bearing wear', 33, 'Day', '2026-10-27'),
    ]

    conn.executemany(
        'INSERT INTO downtime_events (equipment_id, reason, minutes_lost, shift, date) VALUES (?, ?, ?, ?, ?)',
        downtime_events,
    )

    pm_tasks = [
        (equipment_by_name['Hydraulic Press'], 'Inspect seal kit and hydraulic oil', '2026-10-28', 'Due now'),
        (equipment_by_name['Air Compressor'], 'Change inlet filters and verify pressure', '2026-10-29', 'Scheduled'),
        (equipment_by_name['Conveyor Line 2'], 'Lubricate bearings and verify belt tension', '2026-10-30', 'Planned'),
        (equipment_by_name['Cooling Tower'], 'Clean basin and inspect fan motor', '2026-10-31', 'Upcoming'),
    ]

    conn.executemany(
        'INSERT INTO pm_tasks (equipment_id, task_name, due_date, status) VALUES (?, ?, ?, ?)',
        pm_tasks,
    )

    handover_logs = [
        ('Night', 'Conveyor belt replaced and line restarted without issue.', '2026-10-27T21:30:00'),
        ('Day', 'Hydraulic press seal inspection passed. Temperature stable at 73C.', '2026-10-28T07:05:00'),
        ('Swing', 'Boiler feed pump vibration trending upward. Monitor before next shift.', '2026-10-28T15:20:00'),
    ]

    conn.executemany(
        'INSERT INTO handover_logs (shift_name, notes, created_at) VALUES (?, ?, ?)',
        handover_logs,
    )

    alerts = [
        (equipment_by_name['Boiler Feed Pump'], 'Bearing temperature above threshold', 'Critical', '2026-10-28T08:00:00'),
        (equipment_by_name['Air Compressor'], 'Filter replacement due within two shifts', 'Medium', '2026-10-28T07:15:00'),
        (equipment_by_name['Hydraulic Press'], 'Safety inspection due before next start-up', 'High', '2026-10-28T06:47:00'),
    ]

    conn.executemany(
        'INSERT INTO alerts (equipment_id, message, severity, created_at) VALUES (?, ?, ?, ?)',
        alerts,
    )

    conn.commit()
    conn.close()


def get_overview():
    rows = _fetch_all(
        """
        SELECT
            (SELECT COUNT(*) FROM work_orders WHERE status != 'Completed') AS open_work_orders,
            (SELECT COUNT(*) FROM alerts WHERE severity IN ('Critical', 'High')) AS critical_alerts,
            (SELECT ROUND(AVG(CASE WHEN minutes_lost IS NOT NULL THEN minutes_lost END), 1) FROM downtime_events) AS avg_downtime_minutes,
            (SELECT COUNT(*) FROM pm_tasks WHERE status IN ('Due now', 'Scheduled')) AS pm_due_now
        """
    )
    return rows[0] if rows else {}


def get_equipment():
    return _fetch_all('SELECT * FROM equipment ORDER BY criticality DESC, name ASC')


def get_work_orders():
    return _fetch_all(
        '''
        SELECT w.*, e.name AS equipment_name
        FROM work_orders w
        LEFT JOIN equipment e ON e.id = w.equipment_id
        ORDER BY w.created_at DESC
        '''
    )


def get_downtime_events():
    return _fetch_all(
        '''
        SELECT d.*, e.name AS equipment_name
        FROM downtime_events d
        LEFT JOIN equipment e ON e.id = d.equipment_id
        ORDER BY d.date DESC
        '''
    )


def get_pm_tasks():
    return _fetch_all(
        '''
        SELECT p.*, e.name AS equipment_name
        FROM pm_tasks p
        LEFT JOIN equipment e ON e.id = p.equipment_id
        ORDER BY p.due_date ASC
        '''
    )


def get_handover_logs():
    return _fetch_all('SELECT * FROM handover_logs ORDER BY created_at DESC')


def get_alerts():
    return _fetch_all(
        '''
        SELECT a.*, e.name AS equipment_name
        FROM alerts a
        LEFT JOIN equipment e ON e.id = a.equipment_id
        ORDER BY a.created_at DESC
        '''
    )


if __name__ == '__main__':
    init_db()
    ensure_demo_data()
    print(f"Database initialized at: {DB_PATH}")
