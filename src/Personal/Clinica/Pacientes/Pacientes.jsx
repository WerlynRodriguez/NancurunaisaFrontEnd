import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import "../../../Utils/TextUtils.css";
import { PlusOutlined } from '@ant-design/icons';
import { ChangeStatus } from '../../../Utils/FetchingInfo';
import { FormActions } from '../../../Utils/ActionsProviders';
import {Item} from '../../../Models/Models';
import TerapeutaItem from '../../../Components/Items/TerapeutaItem';
import PageList from '../../../Components/PageList';
import { message } from "antd";

export default function Pacientes(props) {
    let Navigate = useNavigate();/*Go back */
    const {picker, multi, dataPicked, onBack, onFinish} = props;

    const varsToFetch = (search) => {
        return {
            table: "paciente",
            items: `idPaciente
            nombres
            apellidos
            activo`,
            searchQuery: `or:[
                {nombres: {contains:"${search}"}}
                {apellidos: {contains:"${search}"}}
            ]`,
            orderQuery: "nombres: ASC"
        }
    }

    const adapter = (data,multidata) => {
        return data.map((item) => {
            return new Item(
                item.idPaciente,
                [item.nombres+" "+item.apellidos],
                "",
                item.activo, 
                multidata.find((i) => i.id == item.idPaciente));
        })
    }

    const onClickItem = (item) => {
        Navigate("/Personal/Clinica/Paciente/"+FormActions.Update+"/"+item.id);
    }

    const itemsMenu = [
        {key:"Act",label:"Activar"},
        {key:"Des",label:"Desactivar"},
    ];

    const onClickItemMenu = (key,info) => {
        switch (key) {
            case "Act":
                changeStatusMD(false,info);
                break;
            case "Des":
                changeStatusMD(true,info);
                break;
            default:
                break;
        }
    }

    const changeStatusMD = (status,info) => {
        let ids = info.MultiData.map((item)=>{return item.id});
    
        info.setLoadingList(true);
        ChangeStatus("Paciente","idPacientes","["+ids+"]","activo",status,"idPaciente").then((response) => {
            if (response == "errors") { info.setLoadingList(false); return; }

            message.success("Pacientes actualizados correctamente",3, ()=>{
                info.setSelectionMode(false);
                info.setMultiData([]);
                info.fetchData();
            });
      });
      }

    const tools = [
        {icon:<PlusOutlined/>,onClick:()=>{Navigate("/Personal/Clinica/Paciente/"+FormActions.Add);}}
    ];

    return(
        <PageList
          title="Pacientes"
          varsToFetch={(search) => varsToFetch(search)}
          adapter={adapter}
          itemsMenu={itemsMenu}
          onClickItemMenu={onClickItemMenu}
          renderItem={(item,index,onclick,onLongPress,selectionMode) => (
      
            <TerapeutaItem
            key={index}
            item={item}
            onClick={(item) => onclick(item,index,onClickItem)}
            onLongPress={(item) => onLongPress(item,index)}
            selectionMode={selectionMode}
            />
          )}
          tools={tools}
          pickerSettings={props}
        />
    )
}