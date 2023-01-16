# import os
# from db import Db
# from queries import select_all_tasks
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# from reports.models import Partida, Usuario
# from openpyxl import load_workbook
# from openpyxl.styles import Border, Side
#
# engine = create_engine("sqlite:///../database.sqlite", echo=True)
# Session = sessionmaker(bind=engine)
#
#
# def relative_path(path: str):
#     absolute_path = os.path.dirname(__file__)
#     relative_path = path
#     full_path = os.path.join(absolute_path, relative_path)
#     return full_path
#
#
# def main():
#     database = Db(relative_path("../../database.sqlite"))
#     connection = database.connection
#
#     wb = load_workbook(filename=relative_path("../reports.xlsx"))
#     sheet_ranges = wb['kardex']
#     sheet_ranges['A1'].value = 'Edwar martinez vale'
#     # sheet_ranges.move_range('A13:L13', rows=8, cols=0)
#     sheet_ranges.insert_rows(12, 10)
#     thin = Side(border_style="thin", color="000000")
#     for row in sheet_ranges.iter_rows(min_row=12, max_col=12, max_row=22):
#         for cell in row:
#             cell.border = Border(top=thin, left=thin, right=thin, bottom=thin)
#             cell.value = 'Edwar'
#     # sheet_ranges['A12'].border = Border(top=thin, left=thin, right=thin, bottom=thin)
#     wb.save('test.xlsx')
#     # print(sheet_ranges['A1'].value)
#
#     # if connection:
#     # print("1. Query task by priority:")
#     # select_task_by_priority(conn, 1)
#     # print("2. Query all tasks")
#     # select_all_tasks(connection)
#
#     # session = Session()
#     # for x in session.query(Usuario):
#     #     print(x.nombre, x.apellido)
#
#
# if __name__ == '__main__':
#     main()

from aiohttp import web
import socketio
from queries import getRowKardex

sio = socketio.AsyncServer(cors_allowed_origins="*")

app = web.Application()

sio.attach(app)


@sio.on('message')
async def print_message(sid, message):
    # When we receive a new event of type
    # 'message' through a socket.io connection
    # we print the socket ID and the message
    print("Socket ID: ", sid)
    print(message)
    return 'message from python'

@sio.on('connect')
async def connect(sid, environ, auth):
    print('connect')

def main():
    # web.run_app(app, host='localhost', port=3012)
    getRowKardex(material_id=1, gestion_id=2)

if __name__ == '__main__':
    main()
