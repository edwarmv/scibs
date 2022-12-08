from sqlalchemy import Column, ForeignKey, Integer, String
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


class ComprobanteEntradas(Base):
    __tablename__ = 'comprobantes_entradas'

    id = Column(Integer, primary_key=True)
    documento = Column(String)
    fecha_entrada = Column(String)
    saldo_inicial = Column(String)
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


class Entrada(Base):
    __tablename__ = 'entradas'

    id = Column(Integer, primary_key=True)
    cantidad = Column(Integer)
    precio_unitario = Column(Integer)
    comprobantes_entradas_id = Column(
        Integer, ForeignKey('comprobantes_entradas.id'))
    comprobante_entradas = relationship(
        'ComprobanteEntradas', back_populates='entradas')
    materiales_id = Column(Integer, ForeignKey('materiales.id'))
    material = relationship('Material', back_populates='entradas')
    entrada_gestion_anterior = Column(Integer)


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
