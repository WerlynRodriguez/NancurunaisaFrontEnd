import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import PageList from '../../../Components/PageList';
import { Item } from "../../../Models/Models";
import { Menu, message } from "antd";
import { ChangeStatus } from "../../../Utils/FetchingInfo";
import { FormActions } from "../../../Utils/ActionsProviders";
import TerapeutaItem from "../../../Components/Items/TerapeutaItem";
import { PlusOutlined } from "@ant-design/icons";

export default function Terapias(props){
    let Navigate = useNavigate();
    const {picker, multi, dataPicked, onBack, onFinish} = props;

    const varsToFetch = (search) => {
        return {
            table: "terapia",
            items: `idTerapia
            nombreTerapia
            precioDomicilio
            precioLocal
            activo`,
            searchQuery: `nombreTerapia:{contains:"${search}"}`,
            orderQuery: "nombreTerapia: ASC"
        }
    }

    const adapter = (data,multidata) => {
        return data.map((item) => {
            return new Item(
                item.idTerapia,
                [item.nombreTerapia,
                "L:$"+item.precioLocal+" / D:$"+item.precioDomicilio],
                "",
                item.activo, 
                multidata.find(itemA => itemA.id == item.idTerapia));
        })
    }

    const onClickItem = (item) => {
        Navigate("/Personal/Clinica/Terapia/"+FormActions.Update+"/"+item.id);
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
        ChangeStatus("Terapia","idTerapias","["+ids+"]","activo",status,"idTerapia").then((response) => {
            if (response == "errors") { info.setLoadingList(false); return; }

            message.success("Usuarios actualizados correctamente",1,()=>{
                info.setSelectionMode(false);
                info.setMultiData([]);
                info.fetchData();
            });
      });
      }

    const tools = [
        {icon:<PlusOutlined/>,onClick:()=>{Navigate("/Personal/Clinica/Terapia/"+FormActions.Add)}}
    ];
    
    return(
        <PageList
        title="Terapias"
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