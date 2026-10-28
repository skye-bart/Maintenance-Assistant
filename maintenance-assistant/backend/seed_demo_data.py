from backend.database import init_db, ensure_demo_data


if __name__ == '__main__':
    init_db()
    ensure_demo_data()
    print('Demo database initialized.')
