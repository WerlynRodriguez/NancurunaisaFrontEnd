import { getFirstWord } from "../Utils/TextUtils";
import moment from 'moment';

//For display in a generic list of items
export class Item{
    constructor(id, info, pic, status, selected){
        if (!id) return;

        this.id = id;
        this.info = info;
        this.pic = pic;
        this.status = status;
        this.selected = selected;
    }
}

class Person {
    constructor(nombres, apellidos, fechaNacimiento, sexo, numCel){
        if (nombres == null) return;
        
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.fechaNacimiento = moment(fechaNacimiento);
        this.sexo = sexo;
        this.numCel = numCel;
    }
}

//User of the app
export class User extends Person{
    constructor(user){
        if (user == null) user = {idRol:{[0]:{idRol:1,nombreRol:""}}};

        super(user.nombres, user.apellidos, user.fechaNacimiento, user.sexo, user.numCel);
        this.idUsuario = user.idUsuario
        this.email = user.email;
        this.foto = user.foto;
        this.activo = user.activo;
        this.idRol = user.idRol[0];
        this.terapeuta = user.terapeuta ? user.terapeuta : null;
    }
}

export class Paciente extends Person{
    constructor(paciente){
        if (paciente == null) { 
            super(null, null, null, null, null);
            return;
        }

        super(paciente.nombres, paciente.apellidos, paciente.fechaNacimiento, paciente.sexo, paciente.numCel);
        this.idPaciente = paciente.idPaciente;
        this.nacionalidad = paciente.nacionalidad;
        this.profesionOficio = paciente.profesionOficio;
        this.horasTrabajo = paciente.horasTrabajo;
        this.escolaridad = paciente.escolaridad;
        this.estadoCivil = paciente.estadoCivil;
        this.direccion = paciente.direccion;
        this.activo = paciente.activo;
    }

    toString(fields){
        return `
        ${this.idPaciente ? `idPaciente:${this.idPaciente},` : ""}
        nombres:"${fields.nombres}",
        apellidos:"${fields.apellidos}",
        fechaNacimiento:"${moment(fields.fechaNacimiento).toISOString()}",
        sexo:"${fields.sexo}",
        numCel:"${fields.numCel}",
        nacionalidad:"${fields.nacionalidad}",
        profesionOficio:"${fields.profesionOficio}",
        horasTrabajo:${fields.horasTrabajo},
        escolaridad:"${fields.escolaridad}",
        estadoCivil:"${fields.estadoCivil}",
        direccion:"${fields.direccion}",
        activo:${this.activo ? this.activo : true}
        `
    }
}

export class Terapeuta extends User{
    constructor (terapeuta){
        if (terapeuta == null){
            terapeuta = {idUsuarioNavigation:null, idTerapia:[]};
        }

        super(terapeuta.idUsuarioNavigation);
        this.idTerapeuta = terapeuta.idTerapeuta;
        this.idSucursal = terapeuta.idSucursalNavigation;

        this.idTerapia = terapeuta.idTerapia ? 
            terapeuta.idTerapia.map(t => new Item(t.idTerapia, [t.nombreTerapia], null, false, false)) : [];

        //horaEntrada from format ISO to HH:mm
        this.horaEntrada = moment(terapeuta.horaEntrada).format("HH:mm");
        this.horaSalida = moment(terapeuta.horaSalida).format("HH:mm");
        this.diaLibre = terapeuta.diaLibre;
    }

    //getter and setter for idSucursal
    get idSucursal(){
        return this._idSucursal;
    }

    set idSucursal(idSucursal){
        this._idSucursal = idSucursal;
    }

    getDiasLibres(){
        let dias = [];
        this.diaLibre.forEach(dia => {
            dias.push(dia.idDia);
        });
        return dias;
    }

    getDiasLibresBy(days){
        let dias = "[";

        days.forEach(day => {
            dias += `{idDia:${day}},`;
        });

        return dias + "]";
    }

    toString(fields){
        //convert horaEntrada to ISO format
        let date = new Date();
        let HE = date.toISOString().split("T")[0] + "T" + fields.horaEntrada + ":00.000Z";
        let HS = date.toISOString().split("T")[0] + "T" + fields.horaSalida + ":00.000Z";

        return `
        ${this.idTerapeuta ? `idTerapeuta:${this.idTerapeuta},` : ""}
        ${this.idUsuario ? `idUsuario:${this.idUsuario},` : ""}
        ${this.idSucursal ? `idSucursal:${this.idSucursal.idSucursal},` : ""}
        horaEntrada:"${HE}"
        horaSalida:"${HS}"
        diasLibres:${this.getDiasLibresBy(fields.diaLibre)}
        terapias:[${this.idTerapia.map(t => {return t.id} )}]

        `;
    }
}

export class Rol{
    constructor(rol){
        if (rol == null) { this.permisos = []; return; }

        this.idRol = rol.idRol;
        this.nombreRol = rol.nombreRol;
        this.descripcion = rol.descripcion;
        this.permisos = rol.idOperacion;
        this.activo = rol.activo;
    }

    //function order by module
    orderModules(){
        let modules = {};
        this.permisos.forEach((permiso) => {
            if (modules[permiso.idModulo] == null){
                modules[permiso.idModulo] = [];
            }
            modules[permiso.idModulo].push(permiso.idOperacion);
        });
        this.permisos = modules;
    }

    //function to get array list pf permisos
    getArrayPermisos(){
        let permisos = [];
        Object.keys(this.permisos).forEach((key) => {
            this.permisos[key].forEach((permiso) => {
                permisos.push(permiso);
            });
        });
        return permisos;
    }

    //Remove permiso
    removePermiso(idPermiso, idModulo){
        this.permisos[idModulo] = this.permisos[idModulo].filter((permiso) => permiso != idPermiso);
    }

    //Add permiso
    addPermiso(idPermiso, idModulo){
        if (this.permisos[idModulo] == null){
            this.permisos[idModulo] = [];
        }
        this.permisos[idModulo].push(idPermiso);
    }

    //Check if has permiso
    hasPermiso(idPermiso, idModulo){
        if (this.permisos[idModulo] == null) return false;
        return this.permisos[idModulo].includes(idPermiso);
    }
}

export class Promocion{
    constructor(promocion){
        if (promocion == null) return;

        this.idPromocion = promocion.idPromocion;
        this.nombrePromocion = promocion.nombrePromocion;
        this.descripcion = promocion.descripcion;
        this.activo = promocion.activo;
    }

    toString(fields){
        return `
        ${this.idPromocion?`idPromocion: ${this.idPromocion},`:''}
        nombrePromocion: "${fields.nombrePromocion}"
        descripcion: "${fields.descripcion}"
        activo: ${this.activo ? this.activo : true}
        `;
    };
}

export class Habitacion{
    constructor(habitacion){
        if (habitacion == null) return

        this.idSucursal = habitacion.idSucursal;
        this.idHabitacion = habitacion.idHabitacion;
        this.nombreHabitacion = habitacion.nombreHabitacion;
        this.activo = habitacion.activo;
    }

    toString(fields){
        return `
        ${this.idHabitacion?`idHabitacion: ${this.idHabitacion},`:''}
        idSucursal: ${this.idSucursal}
        nombreHabitacion: "${fields.nombreHabitacion}"
        activo: ${this.activo ? this.activo : true}
        `;
    }
}

export class Sucursal{
    constructor (sucursal){
        if (sucursal == null) return;

        this.idSucursal = sucursal.idSucursal;
        this.nombreSucursal = sucursal.nombreSucursal;
        this.direccion = sucursal.direccion;
        this.activo = sucursal.activo;

        this.habitacion = [];
        sucursal.habitacion.forEach((habitacion) => {
            this.habitacion.push(new Habitacion(habitacion));
        });
    }

    toString(fields){
        return `
        ${this.idSucursal?`idSucursal: ${this.idSucursal},`:''}
        nombreSucursal: "${fields.nombreSucursal}"
        direccion: "${fields.direccion}"
        activo: ${this.activo ? this.activo : true}
        `;
    }
}

export class Terapia{
    constructor(terapia){
        if (terapia == null) return;

        this.idTerapia = terapia.idTerapia;
        this.nombreTerapia = terapia.nombreTerapia;
        this.duracion = terapia.duracion;
        this.precioDomicilio = terapia.precioDomicilio;
        this.precioLocal = terapia.precioLocal;
        this.activo = terapia.activo;
    }

    toSelectedItem(){
        return new Item (this.idTerapia, [this.nombreTerapia], null, false, false);
    }

    toString(fields){
        return `
        ${this.idTerapia?`idTerapia: ${this.idTerapia},`:''}
        nombreTerapia: "${fields.nombreTerapia}"
        duracion: ${fields.duracion}
        precioDomicilio: ${fields.precioDomicilio}
        precioLocal: ${fields.precioLocal}
        activo: ${this.activo ? this.activo : true}
        `;
    }
}

export const Estados = {
    2: {
        text: "Cita agendada",
        color: "#52c41a",
        badge: "success"
    },
    6: {
        text: "Cita cancelada",
        color: "#ff4d4f",
        badge: "error"
    },
    4: {
        text: "Cita en progreso",
        color: "#1890ff",
        badge: "processing"
    },
    3: {
        text: "Cita en espera de facturar",
        color: "#faad14",
        badge: "warning"
    },
    5: {
        text: "Cita facturada",
        color: "#d9d9d9",
        badge: "default"
    }
}

function getEstadoFromDate(date){
    let now = new Date();
    let fecha = new Date(date);
    if (now > fecha){
        return 5;
    }
    return 2;
}

export class Cita{
    constructor(cita){
        if (cita == null) return;

        this.idCita = cita.idCita;
        this.fechaHora = cita.fechaHora;
        this.direccionDomicilio = cita.direccionDomicilio;
        this.idEstado = cita.idEstado;
        this.horaInicio = cita.horaInicio;
        this.horaFin = cita.horaFin;

        this.idHabitacion = cita.idHabitacionNavigation ? new Item(
            cita.idHabitacionNavigation.idHabitacion, 
            [cita.idHabitacionNavigation.nombreHabitacion], null, false, false) : undefined;

        this.idSucursal = cita.idSucursalNavigation ? new Item(
            cita.idSucursalNavigation.idSucursal,
            [cita.idSucursalNavigation.nombreSucursal], null, false, false) : undefined;

        // detalleHC {
        // idDetalle
        // }
        
        this.idFactura = cita.factura.length ? cita.factura[0].idFactura : undefined;

        this.idPaciente = [];
        cita.idPaciente.forEach((paciente) => {
            this.idPaciente.push(new Item(
                paciente.idPaciente,
                [paciente.nombres, paciente.apellidos],null,false,false));
        });

        this.idPromocion = [] 

        if (cita.idPromocion)
            cita.idPromocion.forEach((promocion) => {
                this.idPromocion.push(new Item(
                    promocion.idPromocion,
                    [promocion.nombrePromocion], null, false, false));
            });

        this.idTerapeuta = []; 
        cita.idTerapeuta.forEach((terapeuta) => {
            this.idTerapeuta.push(new Item(
                terapeuta.idTerapeuta,
                [terapeuta.idUsuarioNavigation.nombres, terapeuta.idUsuarioNavigation.apellidos], null, false, false))
        });

        this.idTerapia = [];
        cita.idTerapia.forEach((terapia) => {
            this.idTerapia.push( new Item(
                terapia.idTerapia,
                [terapia.nombreTerapia,terapia.duracion], null, false, false));
        });
    }

    //Setter and getter of direccionDomilicio
    get direccionDomicilio(){
        return this._direccionDomicilio;
    }

    set direccionDomicilio(value){
        this._direccionDomicilio = value;
    }

    toStringHoras(idEstado){
        let fechaInicio, fechaFinal;
        if (idEstado == 4){
            fechaInicio = new Date();
            fechaInicio = fechaInicio.toISOString().split('T')[0] + "T" + fechaInicio.toTimeString().split(' ')[0];
            fechaInicio = `horaInicio: "${fechaInicio}"`;
            fechaFinal = "";
        } else {
            fechaFinal = new Date();
            fechaFinal = fechaFinal.toISOString().split('T')[0] + "T" + fechaFinal.toTimeString().split(' ')[0];
            fechaFinal = `horaFin: "${fechaFinal}"`;
            fechaInicio = `horaInicio: "${this.horaInicio ? this.horaInicio : "2022-11-22T15:05:00"}"`;
        }

        return `
        idCita: ${this.idCita}
        fechaHora: "${this.fechaHora}"
        direccionDomicilio: "${this.direccionDomicilio ? this.direccionDomicilio : ''}"
        idEstado: ${idEstado}
        ${fechaInicio}
        ${fechaFinal}
        idHabitacion: ${this.idHabitacion ? this.idHabitacion.id : null}
        idPacientes: [${this.idPaciente.map((paciente) => paciente.id)}]
        ${this.idPromocion?`idPromociones: [${this.idPromocion.map((promocion) => promocion.id)}]`:''}
        idTerapeutas: [${this.idTerapeuta.map((terapeuta) => terapeuta.id)}]
        idTerapias: [${this.idTerapia.map((terapia) => terapia.id)}]
        `;
    }

    toString(date, time){
        const myEstado = this.idEstado ? 
        this.idEstado 
        : 
        getEstadoFromDate(moment(date + " " + time).format('YYYY-MM-DD HH:mm:ss'));
        // console.log(moment(date + " " + time).format('YYYY-MM-DD HH:mm:ss'));
        console.log(date + "T" + time)
        const fechaHora = date + " " + time + ":00";

        return `
        ${this.idCita?`idCita: ${this.idCita},`:''}
        fechaHora: "${fechaHora}"
        direccionDomicilio: "${this.direccionDomicilio ? this.direccionDomicilio : ''}"
        idEstado: ${myEstado}
        ${this.horaInicio?`horaInicio: "${this.horaInicio}",`:''}
        ${this.horaFin?`horaFin: "${this.horaFin}",`:''}
        idHabitacion: ${this.idHabitacion ? this.idHabitacion.id : null}
        idPacientes: [${this.idPaciente.map((paciente) => paciente.id)}]
        ${this.idPromocion?`idPromociones: [${this.idPromocion.map((promocion) => promocion.id)}]`:''}
        idTerapeutas: [${this.idTerapeuta.map((terapeuta) => terapeuta.id)}]
        idTerapias: [${this.idTerapia.map((terapia) => terapia.id)}]
        `;
    }
}

export class Factura{
    constructor(factura) {
        if (!factura) return;

        this.idFactura = factura.idFactura;
        this.idCita = factura.idCita;
        this.descuento = factura.descuento;
        this.subTotal = factura.subTotal;
        this.total = factura.total;
        this.activo = factura.activo;
    }

    toString(fields,idCita){
        return `
        ${this.idFactura?`idFactura: ${this.idFactura}`:''}
        idCita: ${idCita}
        descuento: ${fields.descuento}
        subTotal: ${fields.subTotal}
        total: ${fields.total}
        activo: true
        `;
    }
}