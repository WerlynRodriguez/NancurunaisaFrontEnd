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

export default function Promos(props) {
    let Navigate = useNavigate();/*Go back */
    const {picker, multi, dataPicked, onBack, onFinish} = props;

    const varsToFetch = (search) => {
        return {
            table: "promocion",
            items: `idPromocion
            nombrePromocion
            descripcion
            activo`,
            searchQuery: `nombrePromocion: {contains:"${search}"}`,
            orderQuery: "nombrePromocion: ASC"
        }
    }

    const adapter = (data,multidata) => {
        return data.map((item) => {
            return new Item(
                item.idPromocion,
                [item.nombrePromocion],
                "",
                item.activo, 
                multidata.find((i) => i.id == item.idPromocion));
        })
    }

    const onClickItem = (item) => {
        Navigate("/Personal/Clinica/Promo/"+FormActions.Update+"/"+item.id);
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
        ChangeStatus("Promocion","idPromociones","["+ids+"]","activo",status,"idPromocion").then((response) => {
            if (response == "errors") { info.setLoadingList(false); return; }

            message.success("Usuarios actualizados correctamente",2,()=>{
                info.setSelectionMode(false);
                info.setMultiData([]);
                info.fetchData();
            });
      });
    }

    const tools = [
        {icon:<PlusOutlined/>,onClick:()=>{Navigate("/Personal/Clinica/Promo/"+FormActions.Add);}}
    ];

    return(
        <PageList
          title="Promociones"
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