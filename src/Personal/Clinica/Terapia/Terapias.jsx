import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import PageList from '../../../Components/PageList';
import { Item } from "../../../Models/Models";
import { Menu } from "antd";

export default function Terapias(props){
    const {picker, multi, dataPicked, onBack, onFinish} = props;

    const varsToFetch = (search) => {
        console.log(search)
        return {
            table: "terapia",
            items: `idTerapia
            nombreTerapia
            duracion
            precioDomicilio
            precioLocal
            activo`,
            searchQuery: `nombreTerapia:{contains:"${search}"}`,
            orderQuery: "nombreTeraia: ASC"
        }
    }

    const adapter = (data) => {
        return data.map((item) => {
            return new Item(item.idTerapia,item.nombreTerapia,item.precioLocal,"",item.activo, false);
        })
    }

    const selectMenu = (
        <Menu
        style={{width:"200px",borderRadius:"20px"}}
        //theme="dark"
        items={[
            {key:"item1",label:"Activar",onClick:()=>{changeStatusMD(false)}},
            {key:"item2",label:"Desactivar",onClick:()=>{changeStatusMD(true)}},
        ]}/>
    );
    
    return (
    <PageList
    title="Terapias"
    varsToFetch={(search)=>varsToFetch(search)}
    adapter={(data)=>adapter(data)}
    selectMenu={selectMenu}
    pickerSettings={props}
    />
    );
}