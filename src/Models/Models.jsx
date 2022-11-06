import { getFirstWord } from "../Utils/TextUtils";

//For display in a generic list of items
export class Item{
    constructor(id, info, pic, status, selected){
        this.id = id;
        this.info = info;
        this.pic = pic;
        this.status = status;
        this.selected = selected;
    }
}

class Person {
    constructor(nombres, apellidos, fechaNacimiento, sexo, numCel){
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.fechaNacimiento = fechaNacimiento;
        this.sexo = sexo;
        this.numCel = numCel;
    }
}

//User of the app
export class User extends Person{
    constructor(user){
        super(user.nombres, user.apellidos, user.fechaNacimiento, user.sexo, user.numCel);
        this.idUsuario = user.idUsuario
        this.email = user.email;
        this.foto = user.foto;
        this.activo = user.activo;
        this.idRol = user.idRol;
    }
}

export class Terapeuta extends User{
    constructor (terapeuta){
        if (terapeuta == null){
            terapeuta = {idUsuarioNavigation:{nombres:"",apellidos:"",fechaNacimiento:"",sexo:"",numCel:""}};
        }

        super(terapeuta.idUsuarioNavigation);
        this.idTerapeuta = terapeuta.idTerapeuta;
        this.idSucursal = terapeuta.idSucursal;
        this.horaEntrada = terapeuta.horaEntrada;
        this.horaSalida = terapeuta.horaSalida;
    }
}

export class Rol{
    constructor(rol){
        this.idRol = rol.idRol;
        this.nombreRol = rol.nombreRol;
        this.descripcion = rol.descripcion;
    }
}

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