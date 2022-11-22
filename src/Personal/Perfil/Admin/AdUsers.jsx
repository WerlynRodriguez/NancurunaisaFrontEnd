import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import PageList from '../../../Components/PageList';
import { Item } from "../../../Models/Models";
import { Menu, message } from "antd";
import { FormActions } from "../../../Utils/ActionsProviders";
import TerapeutaItem from "../../../Components/Items/TerapeutaItem";
import { PlusOutlined } from "@ant-design/icons";
import { ChangeStatus } from "../../../Utils/FetchingInfo";

function getTitle(a,b){
  return a+" "+b;
}

export default function AdUsers(props){
  let Navigate = useNavigate();
  const {picker, multi, dataPicked, onBack, onFinish} = props;

  const varsToFetch = (search) => {
    //const filterActivo = Filters.Activo!="All"? `{activo:{eq:${Filters.Activo}}}`:"";
    const filterActivo = "";

    return {
        table: "usuarios",
        items: `idUsuario
        nombres
        apellidos
        activo
        idRol{
          nombreRol
        }
        terapeuta{
          idTerapeuta
        }`,
        searchQuery: `
        and:[
          {or:[
            {nombres: {contains:"${search}"}}
            {apellidos: {contains:"${search}"}}
          ]},
          ${filterActivo}
        ]`,
        orderQuery: "nombres: ASC"
    }
  }

  const adapter = (data,multidata) => {
    return data.map((elemnt) => {
        return new Item(
          elemnt.idUsuario,
          [getTitle(elemnt.nombres,elemnt.apellidos),
          elemnt.idRol[0] ? elemnt.idRol[0].nombreRol : "Sin rol",
          elemnt.terapeuta],
          "",
          elemnt.activo,
          multidata.find((item) => item.id == elemnt.idUsuario));
    })
  }

  const changeStatusMD = (status,info) => {
    let ids = info.MultiData.map((item)=>{return item.id});

    info.setLoadingList(true);
    ChangeStatus("Usuario","idUsuarios","["+ids+"]","activo",status,"idUsuario").then((response) => {
      if (response != "errors") {
        message.success("Usuarios actualizados correctamente",3);
        info.setSelectionMode(false);
        info.setMultiData([]);
        info.fetchData();
      } else {
        message.error("Error al actualizar los usuarios");
        info.setLoadingList(false);
      }
  });
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

  const tools = [
    {icon:<PlusOutlined/>,onClick:()=>{Navigate("/Personal/Ajustes/Admin/Usuario/"+FormActions.Add)}}
  ];

  const onClickItem = (item) => {
    Navigate("/Personal/Ajustes/Admin/Usuario/"+FormActions.Update+"/"+item.id);
  }

  return(
  <PageList
    title="Usuarios"
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