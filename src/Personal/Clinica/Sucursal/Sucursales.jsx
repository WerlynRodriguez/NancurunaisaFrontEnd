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

export default function Sucursales(props){
    let Navigate = useNavigate();/*Go back */
    const {picker, multi, dataPicked, onBack, onFinish} = props;

    const varsToFetch = (search) => {
        return {
            table: "sucursales",
            items: `idSucursal
            nombreSucursal
            activo`,
            searchQuery: `or:[
                {nombreSucursal: {contains:"${search}"}}
            ]`,
            orderQuery: "nombreSucursal: ASC"
        }
    }

    const adapter = (data,multidata) => {
        return data.map((item) => {
            return new Item(
                item.idSucursal,
                [item.nombreSucursal],
                "",
                item.activo, 
                multidata.find((i) => i.id == item.idSucursal));
        })
    }

    const onClickItem = (item) => {
        Navigate("/Personal/Clinica/Sucursal/"+FormActions.Update+"/"+item.id);
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
        ChangeStatus("Sucursal","idSucursales","["+ids+"]","activo",status,"idSucursal").then((response) => {
            if (response == "errors") { info.setLoadingList(false); return; }

            message.success("Sucursales actualizadas correctamente",2,()=>{
                info.setSelectionMode(false);
                info.setMultiData([]);
                info.fetchData();
            });
      });
    }

    const tools = [
        {icon:<PlusOutlined/>,onClick:()=>{Navigate("/Personal/Clinica/Sucursal/"+FormActions.Add);}}
    ];

    return(
        <PageList
          title="Sucursales"
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