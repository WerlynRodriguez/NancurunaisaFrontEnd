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
        activo`,
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

  const adapter = (data) => {
    return data.map((elemnt) => {
        return new Item(
          elemnt.idUsuario,
          [getTitle(elemnt.nombres,elemnt.apellidos)],
          "",
          elemnt.activo,
          false,
        );
    })
  }

  const changeStatusMD = (status,MultiData,setMultiData,setSelectionMode,setLoadingList,fetchData) => {
    let ids = MultiData.map((item)=>{return item.id});

    setLoadingList(true);
    ChangeStatus("Usuario","idUsuarios","["+ids+"]","activo",status,"idUsuario").then((response) => {
      if (response != "errors") {
        message.success("Usuarios actualizados correctamente",3);
        setSelectionMode(false);
        setMultiData([]);
        fetchData();
      } else {
        message.error("Error al actualizar los usuarios");
        setLoadingList(false);
      }
  });
  }

  const itemsMenu = [
    {key:"Act",label:"Activar"},
    {key:"Des",label:"Desactivar"},
  ];

  const onClickItemMenu = (key,MultiData,setMultiData,setSelectionMode,setLoadingList,fetchData) => {
    switch (key) {
      case "Act":
        changeStatusMD(false,MultiData,setMultiData,setSelectionMode,setLoadingList,fetchData);
        break;
      case "Des":
        changeStatusMD(true,MultiData,setMultiData,setSelectionMode,setLoadingList,fetchData);
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
    adapter={(data) => adapter(data)}
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