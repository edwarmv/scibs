from sqlite3 import Connection

def select_all_tasks(connection: Connection):
    """
    Query all rows in the tasks table
    :param conn: the Connection object
    :return:
    """
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM entradas")

    rows = cursor.fetchall()

    for row in rows:
        print(row)


def select_task_by_priority(conn, priority):
    """
    Query tasks by priority
    :param conn: the Connection object
    :param priority:
    :return:
    """
    cur = conn.cursor()
    cur.execute("SELECT * FROM tasks WHERE priority=?", (priority,))

    rows = cur.fetchall()

    for row in rows:
        print(row)


