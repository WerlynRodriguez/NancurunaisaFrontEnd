import { getFirstWord } from "../Utils/TextUtils";

export class Paciente{
    constructor(idPaciente,nombres,apellidos,sexo,edad,nacionalidad,profesion_oficio,horas_trabajo,numCel,fecha_nacimiento,selected){
        this.idPaciente = idPaciente;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.sexo = sexo;
        this.edad = edad;
        this.nacionalidad = nacionalidad;
        this.profesion_oficio = profesion_oficio;
        this.horas_trabajo = horas_trabajo;
        this.numCel = numCel;
        this.fecha_nacimiento = fecha_nacimiento;
        this.selected = selected;
    }
    get getShortName(){
        return getFirstWord(this.nombres)+" "+getFirstWord(this.apellidos);
    }
}

export class Promocion{
    constructor(idPromocion,nombrePromocion,descripcion,selected){
        this.idPromocion = idPromocion;
        this.nombrePromocion = nombrePromocion;
        this.descripcion = descripcion;
        this.selected = selected;
    }
}

export class Terapia{
    constructor(idTerapia,nombreTerapia,duracion,precioDomicilio,precioLocal,selected){
        this.idTerapia = idTerapia;
        this.nombreTerapia = nombreTerapia;
        this.duracion = duracion;
        this.precioDomicilio = precioDomicilio;
        this.precioLocal = precioLocal;
        this.selected = selected;
    }
}

export class Terapeuta{
    constructor(idMasajista,nombres,apellidos,fechaNacimiento,correo,password,foto,roll,diaLibre,numCel,selected){
        this.idMasajista = idMasajista;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.fechaNacimiento = fechaNacimiento;
        this.correo = correo;
        this.password = password;
        this.foto = foto;
        this.roll = roll;
        this.diaLibre = diaLibre;
        this.numCel = numCel;
        this.selected = selected;
    }
    get getShortName(){
        return getFirstWord(this.nombres)+" "+getFirstWord(this.apellidos);
    }
}

export class Sucursal{
    constructor(idSucursal,nombreSucursal,direccion,selected){
        this.idSucursal = idSucursal;
        this.nombreSucursal = nombreSucursal;
        this.direccion = direccion;
        this.selected = selected;
    }
}

export class Habitacion{
    constructor(idHabitacion,idSucursal,nombreHabitacion,selected,cita){
        this.idHabitacion = idHabitacion;
        this.idSucursal = idSucursal;
        this.nombreHabitacion = nombreHabitacion;
        this.selected = selected;
        this.cita = cita?cita:null;
    }
}

export class Factura{
    constructor(idFactura,idCita,total,subTotal,descuento){
        this.idFactura = idFactura;
        this.idCita = idCita;
        this.total = total;
        this.subTotal = subTotal;
        this.descuento = descuento;
    }
}