import { message } from "antd";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import LoadPage from "../Personal/Perfil/LoadPage";
import { getById } from "./FetchingInfo";

export function OnlyAdmin(){
    const location = useLocation();
    const rangeProvider = new RangeProvider();
    const [value,setValue] = useState(null);

    useEffect(() => {
        setValue(rangeProvider.matchRol(1))
    }, []);

    switch (value) {
        case true:
            return(<Outlet/>);
        case false:
            return (<Navigate to= "/Personal/Ajustes" state={{from:location}} replace/>);
        default:
            return(<LoadPage/>);
    }
}
// Citas
// : 
// (4) ['Añadir', 'Editar', 'Ver', 'Listar']
// Facturas
// : 
// (4) ['Añadir', 'Editar', 'Ver', 'Listar']
// Pacientes
// : 
// (5) ['Añadir', 'Editar', 'Ver', 'Listar', 'Cambiar estado']
// Promociones
// : 
// (5) ['Añadir', 'Editar', 'Ver', 'Listar', 'Cambiar estado']
// Sucursales
// : 
// (5) ['Añadir', 'Editar', 'Ver', 'Listar', 'Cambiar estado']
// Terapeutas
// : 
// (5) ['Añadir', 'Editar', 'Ver', 'Listar', 'Cambiar estado']
// Terapias
// : 
// (5) ['Añadir', 'Editar', 'Ver', 'Listar', 'Cambiar estado']
export class RangeProvider {
    constructor(){
        this.permisos = {};
    }

    getRolUser(){
        const user = JSON.parse(localStorage.getItem('user'));
        return JSON.parse(user.permisos)[0];

    }

    async loadPermisos(onSuccess){
        const rol = this.getRolUser();
            
        const items = `
        idOperacion{
            nombre
            idModuloNavigation{
            nombre
            
            }
        }`;

        getById("roles","idRol",rol.idRol,items).then((response) => {
            if (response == "erros") return
            let perm = {};

            response.data.roles.items[0].idOperacion.forEach((element) => {
                if (perm[element.idModuloNavigation.nombre] == null){
                    perm[element.idModuloNavigation.nombre] = [];
                }
                perm[element.idModuloNavigation.nombre].push(element.nombre);
            });

            this.permisos = perm;
            onSuccess();
        });
    }

    verifyPermiso(nombrePermiso,module){
        if (this.permisos == null) return false;
        if (this.permisos[module] == null) return false;
        return this.permisos[module].includes(nombrePermiso);
    }

    matchRol(idRol){
        const rol = this.getRolUser();
        if (rol == null) return false;
        return rol.idRol == idRol;
    }
}