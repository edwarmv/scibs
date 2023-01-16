from typing import List, TypedDict
from sqlalchemy import create_engine, or_, select
from sqlalchemy.orm import Session, aliased, contains_eager, lazyload

from models import ComprobanteEntradas, ComprobanteSalidas, Entrada, Gestion, Material, OrdenOperacion, Salida

engine = create_engine('sqlite:///../server/database.sqlite')


class KardexRow(TypedDict):
    fecha: str


def getRowKardex(material_id: int, gestion_id: int):
    stmt = select(Material)
    # with engine.connect() as conn:
    #     for row in conn.execute(stmt):
    #         print(row['nombre'])
    kardex: List[KardexRow] = []

    with Session(engine) as session:
        # material_alias1 = aliased(Material)
        # material_alias2 = aliased(Material)
        # gestion_alias1 = aliased(Gestion)
        # gestion_alias2 = aliased(Gestion)
        # q = session.query(OrdenOperacion).\
        #     join(OrdenOperacion.comprobantes_entradas, isouter=True).\
        #     join(ComprobanteEntradas.entradas, isouter=True).\
        #     join(material_alias1, Entrada.material, isouter=True).\
        #     join(gestion_alias1, ComprobanteEntradas.gestion, isouter=True).\
        #     join(OrdenOperacion.comprobantes_salidas, isouter=True).\
        #     join(ComprobanteSalidas.salidas, isouter=True).\
        #     join(material_alias2, Salida.material, isouter=True).\
        #     join(gestion_alias2, ComprobanteSalidas.gestion, isouter=True).\
        #     filter(or_(material_alias1.id == material_id, material_alias2.id == material_id)).\
        #     filter(or_(gestion_alias1.id == gestion_id, gestion_alias2.id == gestion_id)).\
        #     options(contains_eager(OrdenOperacion.comprobantes_entradas).contains_eager(
        #         ComprobanteEntradas.entradas)).\
        #     options(contains_eager(OrdenOperacion.comprobantes_salidas).contains_eager(
        #         ComprobanteSalidas.salidas))
        #
        # for row in q:
        #     for comprobante_entradas in row.comprobantes_entradas:
        #         for entrada in comprobante_entradas.entradas:
        #             print(entrada)
        #
        # for row in q:
        #     for comprobante_salidas in row.comprobantes_salidas:
        #         for salida in comprobante_salidas.salidas:
        #             print(salida)
        q = f'''
            SELECT
                COALESCE(ce.fecha_entrada,
                cs.fecha_salida) as 'fecha',
                COALESCE(m1.nombre,
                m2.nombre) AS 'material',
                COALESCE(IIF(ce.saldo_gestion_anterior = 1,
                'Saldo gestión anterior',
                IIF(ce.saldo_inicial = 1,
                'Saldo inicial',
                p.nombre)),
                IIF(cs.vencido = 1,
                'Vencido',
                so.apellido || ' ' || so.nombre)) as 'detalle',
                COALESCE(COALESCE(ce.documento,
                cs.documento), '000') as 'documento',
                COALESCE(e.cantidad,
                s.cantidad) as 'cantidad',
                e.precio_unitario,
                IIF(ce.id IS NOT NULL,
                'entrada',
                'salida') as 'tipo',
                oo.orden
            FROM
                orden_operaciones oo
            LEFT JOIN comprobantes_entradas ce ON
                oo.id = ce.orden_operaciones_id
            LEFT JOIN comprobantes_salidas cs ON
                oo.id = cs.orden_operaciones_id
            LEFT JOIN proveedores p ON
                ce.proveedores_id = p.id
            LEFT JOIN solicitantes so ON
                cs.solicitantes_id = so.id
            LEFT JOIN gestiones g1 ON
                ce.gestiones_id = g1.id
            LEFT JOIN gestiones g2 ON
                cs.gestiones_id = g2.id
            LEFT JOIN entradas e ON
                ce.id = e.comprobantes_entradas_id
            LEFT JOIN salidas s ON
                cs.id = s.comprobantes_salidas_id
            LEFT JOIN materiales m1 ON
                e.materiales_id = m1.id
            LEFT JOIN materiales m2 ON
                s.materiales_id = m2.id
            WHERE
                (m1.id = {material_id}
                    OR m2.id = {material_id})
                AND (g1.id = {gestion_id}
                    OR g2.id = {gestion_id})
                AND (ce.fecha_entrada BETWEEN '' AND '')
            ORDER BY
                oo.orden ASC;
        '''
        for row in session.execute(q):
            print(row._mapping)
        # print(q)
        return session.execute(q)
