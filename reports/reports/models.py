from sqlalchemy import Column, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.orm import declarative_base


Base = declarative_base()


class Usuario(Base):
    __tablename__ = 'usuarios'

    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    apellido = Column(String)
    username = Column(String)
    key = Column(String)
    salt = Column(String)
    comprobantes_entradas = relationship(
        'ComprobanteEntradas', back_populates='usuario')
    comprobantes_salidas = relationship(
        'ComprobanteSalidas', back_populates='usuario')


class Gestion(Base):
    __tablename__ = 'gestiones'

    id = Column(Integer, primary_key=True)
    fecha_apertura = Column(String)
    fecha_cierre = Column(String)
    comprobantes_entradas = relationship(
        'ComprobanteEntradas', back_populates='gestion')
    comprobantes_salidas = relationship(
        'ComprobanteSalidas', back_populates='gestion')


class Solicitante(Base):
    __tablename__ = 'solicitantes'

    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    apellido = Column(String)
    ci = Column(String)
    comprobantes_salidas = relationship(
        'ComprobanteSalidas', back_populates='solicitante')


class Proveedor(Base):
    __tablename__ = 'proveedores'

    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    nit_ci = Column(String)
    comprobantes_entradas = relationship(
        'ComprobanteEntradas', back_populates='proveedor')


class OrdenOperacion(Base):
    __tablename__ = 'orden_operaciones'

    id = Column(Integer, primary_key=True)
    orden = Column(Integer)
    comprobantes_entradas = relationship(
        'ComprobanteEntradas', back_populates='orden_operacion')
    comprobantes_salidas = relationship(
        'ComprobanteSalidas', back_populates='orden_operacion')

    def __repr__(self) -> str:
        return f'OrdenOperacion(id={self.id!r}, orden={self.orden!r}, comprobantes_entradas={self.comprobantes_entradas!r}, comprobantes_salidas={self.comprobantes_salidas!r})'


class UnidadManejo(Base):
    __tablename__ = 'unidades_manejo'

    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    materiales = relationship('Material', back_populates='unidadManejo')


class Partida(Base):
    __tablename__ = 'partidas'

    id = Column(Integer, primary_key=True)
    numero = Column(Integer)
    nombre = Column(String)
    materiales = relationship('Material', back_populates='partida')

    def __repr__(self) -> str:
        return f'Partida(id={self.id!r}, numero={self.numero!r}, nombre={self.nombre!r})'


class ComprobanteEntradas(Base):
    __tablename__ = 'comprobantes_entradas'

    id = Column(Integer, primary_key=True)
    documento = Column(String)
    fecha_entrada = Column(String)
    saldo_inicial = Column(Boolean)
    saldo_gestion_anterior = Column(Boolean)
    usuarios_id = Column(Integer, ForeignKey('usuarios.id'))
    usuario = relationship('Usuario', back_populates='comprobantes_entradas')
    proveedores_id = Column(Integer, ForeignKey('proveedores.id'))
    proveedor = relationship(
        'Proveedor', back_populates='comprobantes_entradas')
    gestiones_id = Column(Integer, ForeignKey('gestiones.id'))
    gestion = relationship('Gestion', back_populates='comprobantes_entradas')
    orden_operaciones_id = Column(Integer, ForeignKey('orden_operaciones.id'))
    orden_operacion = relationship(
        'OrdenOperacion', back_populates='comprobantes_entradas')
    entradas = relationship('Entrada', back_populates='comprobante_entradas')

    def __repr__(self) -> str:
        return f'ComprobanteEntradas(id={self.id}, entradas={self.entradas!r})'


class ComprobanteSalidas(Base):
    __tablename__ = 'comprobantes_salidas'

    id = Column(Integer, primary_key=True)
    documento = Column(String)
    fecha_salida = Column(String)
    vencido = Column(String)
    usuarios_id = Column(Integer, ForeignKey('usuarios.id'))
    usuario = relationship('Usuario', back_populates='comprobantes_salidas')
    solicitantes_id = Column(Integer, ForeignKey('solicitantes.id'))
    solicitante = relationship(
        'Solicitante', back_populates='comprobantes_salidas')
    gestiones_id = Column(Integer, ForeignKey('gestiones.id'))
    gestion = relationship('Gestion', back_populates='comprobantes_salidas')
    orden_operaciones_id = Column(Integer, ForeignKey('orden_operaciones.id'))
    orden_operacion = relationship(
        'OrdenOperacion', back_populates='comprobantes_salidas')
    salidas = relationship('Salida', back_populates='comprobante_salidas')

    def __repr__(self) -> str:
        return f'ComprobanteSalidas(id={self.id}, salidas={self.salidas!r})'


class Material(Base):
    __tablename__ = 'materiales'

    id = Column(Integer, primary_key=True)
    codigo_index = Column(String)
    nombre = Column(String)
    stock_minimo = Column(Integer)
    caracteristicas = Column(String)
    partidas_id = Column(Integer, ForeignKey('partidas.id'))
    partida = relationship('Partida', back_populates='materiales')
    unidades_manejo_id = Column(Integer, ForeignKey('unidades_manejo.id'))
    unidadManejo = relationship('UnidadManejo', back_populates='materiales')
    entradas = relationship('Entrada', back_populates='material')
    salidas = relationship('Salida', back_populates='material')

    def __repr__(self) -> str:
        return f"Material(id={self.id!r}, codigo_index={self.codigo_index!r}, nombre={self.nombre!r}, stock_minimo={self.stock_minimo!r}, caracteristicas={self.caracteristicas!r})"


class Entrada(Base):
    __tablename__ = 'entradas'

    id = Column(Integer, primary_key=True)
    cantidad = Column(Integer)
    precio_unitario = Column(Integer)
    comprobantes_entradas_id = Column(
        Integer, ForeignKey('comprobantes_entradas.id'))
    comprobante_entradas = relationship(
        'ComprobanteEntradas', back_populates='entradas', lazy="select")
    materiales_id = Column(Integer, ForeignKey('materiales.id'))
    material = relationship('Material', back_populates='entradas')
    movimientos = relationship('Movimiento', back_populates='entradas')

    def __repr__(self) -> str:
        return f'Entrada(id={self.id!r}, material={self.material!r})'


class Salida(Base):
    __tablename__ = 'salidas'

    id = Column(Integer, primary_key=True)
    cantidad = Column(String)
    comprobantes_salidas_id = Column(
        Integer, ForeignKey('comprobantes_salidas.id'))
    comprobante_salidas = relationship(
        'ComprobanteSalidas', back_populates='salidas')
    materiales_id = Column(Integer, ForeignKey('materiales.id'))
    material = relationship('Material', back_populates='salidas')
    movimientos = relationship('Movimiento', back_populates='salidas')

    def __repr__(self) -> str:
        return f'Salida(id={self.id!r}, material={self.material!r})'


class Movimiento(Base):
    __tablename__ = 'movimientos'

    cantidad = Column(Integer)
    orden = Column(Integer)
    entradas_id = Column(Integer, ForeignKey('entradas.id'), primary_key=True)
    entradas = relationship('Entrada', back_populates='movimientos')
    salidas_id = Column(Integer, ForeignKey('salidas.id'), primary_key=True)
    salidas = relationship('Salida', back_populates='movimientos')
