import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import PageList from '../../../Components/PageList';
import { Item } from "../../../Models/Models";
import { Menu, message } from "antd";
import { FormActions } from "../../../Utils/ActionsProviders";
import TerapeutaItem from "../../../Components/Items/TerapeutaItem";
import { PlusOutlined } from "@ant-design/icons";
import { ChangeStatus } from "../../../Utils/FetchingInfo";

export default function AdRols(props){
    let Navigate = useNavigate();
    const {picker, multi, dataPicked, onBack, onFinish} = props;

    const varsToFetch = (search) => {
        //const filterActivo = Filters.Activo!="All"? `{activo:{eq:${Filters.Activo}}}`:"";
        const filterActivo = "";
    
        return {
            table: "roles",
            items: `idRol
            nombreRol
            descripcion`,
            searchQuery: `
            and:[
            {
                nombreRol: {contains:"${search}"}
            },
              ${filterActivo}
            ]`,
            orderQuery: "nombreRol: ASC"
        }
    }

    const adapter = (data,multidata) => {
        return data.map((elemnt) => {
            return new Item(
                elemnt.idRol,
                [elemnt.nombreRol,
                elemnt.descripcion],
                "",
                true,
                multidata.find((item) => item.id == elemnt.idRol));
        })
    }

    const tools = [
        {icon:<PlusOutlined/>,onClick:()=>{Navigate("/Personal/Ajustes/Admin/Rol/"+FormActions.Add)}}
    ];
    
    const onClickItem = (item) => {
        Navigate("/Personal/Ajustes/Admin/Rol/"+FormActions.Update+"/"+item.id);
    }

    return(
    <PageList
    title="Roles"
    varsToFetch={(search) => varsToFetch(search)}
    adapter={adapter}
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