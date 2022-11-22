import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import "../../../Utils/TextUtils.css";
import { PlusOutlined } from '@ant-design/icons';
import { ChangeStatus } from '../../../Utils/FetchingInfo';
import { FormActions } from '../../../Utils/ActionsProviders';
import {Item} from '../../../Models/Models';
import TerapeutaItem from '../../../Components/Items/TerapeutaItem';
import PageList from '../../../Components/PageList';
import { getFirstWord } from "../../../Utils/TextUtils";
import { message } from "antd";

function getTitle(a,b){
  return getFirstWord(a)+" "+getFirstWord(b);
}

export default function Terapeutas(props){
  let Navigate = useNavigate();/*Go back */
  const {picker, multi, dataPicked, onBack, onFinish} = props;

  const varsToFetch = (search) => {
      return {
          table: "terapeutas",
          items: `idTerapeuta
          idUsuarioNavigation{
            idUsuario
            nombres
            apellidos
            foto
            activo
          }`,
          searchQuery: `or:[
            {idUsuarioNavigation:{
              nombres:{contains:"${search}"}
            }}
            {idUsuarioNavigation:{
              apellidos:{contains:"${search}"}
            }}
          ]`,
          orderQuery: `idUsuarioNavigation:{
            nombres:ASC
          }`
      }
  }

  const adapter = (data,multidata) => {
      return data.map((item) => {
          return new Item(
              item.idTerapeuta,
              [getTitle(item.idUsuarioNavigation.nombres,item.idUsuarioNavigation.apellidos),"",
              item.idUsuarioNavigation.idUsuario],
              "",
              item.idUsuarioNavigation.activo, 
              multidata.find((i) => i.id == item.idTerapeuta));
      })
  }

  const onClickItem = (item) => {
      Navigate("/Personal/Clinica/Terapeuta/"+FormActions.Update+"/"+item.id);
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
      let ids = info.MultiData.map((item)=>{return item.info[2]});

      info.setLoadingList(true);
      ChangeStatus("Usuario","idUsuarios","["+ids+"]","activo",status,"idUsuario").then((response) => {
          if (response == "errors") { info.setLoadingList(false); return; }

          message.success("Usuarios actualizados correctamente",2,()=>{
              info.setSelectionMode(false);
              info.setMultiData([]);
              info.fetchData();
          });
    });
  }

  const tools = [
    {icon:<PlusOutlined/>,onClick:()=>{Navigate("/Personal/Clinica/Terapeuta/"+FormActions.Add);}}
  ];

  return(
    <PageList
      title="Terapeutas"
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