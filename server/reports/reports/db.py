import sqlite3


class Db:
    db_file_path = ''
    connection: sqlite3.Connection | None = None

    def __new__(cls, db_file_path: str):
        if not hasattr(cls, 'instance'):
            cls.instance = super(Db, cls).__new__(cls)
        return cls.instance

    def __init__(self, db_file_path: str) -> None:
        self.db_file_path = db_file_path
        try:
            if not self.connection:
                self.connection = sqlite3.connect(db_file_path)
        except sqlite3.Error as e:
            print(e)

    def get_connection(self):
        return self.connection
