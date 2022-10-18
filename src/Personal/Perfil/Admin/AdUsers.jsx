import { CheckOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Layout, List, message, PageHeader, Pagination, Typography } from "antd";
import "../../../Utils/TextUtils.css";
import { getFirstWord, MapSelectedItems } from '../../../Utils/TextUtils';
import SelectedItem from '../../../Components/Items/SelectedItem';
import Searchbar from "../../../Components/SearchBar";
import MultiSelectList from "../../../Utils/MultiSelectList";
import React, {useState,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { Item } from "../../../Models/Models";
import { getByPag } from "../../../Utils/FetchingInfo";
import { FormActions } from '../../../Utils/ActionsProviders';

const { Title } = Typography;

function getTitle(a,b){
  return a+" "+b;
}

export default function AdUsers(props){
  let Navigate = useNavigate();
  const {picker, multi, data} = props;

  const [Items, setItems] = useState([]);
  const [LoadingList,setLoadingList] = useState(true);
  const perPageDefault = 6;
  const [totalItems,setTotalItems] = useState(0);

  // Page * perPage = offset
  var countItems = 0;
  var search = "";

  //If is picker mode, the list can be initialized with data
  const [MultiData,setMultiData] = useState(data? data:[]);

  //If is multi picker mode, the multi selection is enabled automatically
  const [selectionMode,setSelectionMode] = useState(multi?true:false);

  useEffect(() => {
    UsersGet()
  }, [])

  //======================================================================
  // Get data from server, pagination + search + filter
  //======================================================================
  const UsersGet = () => {
    setLoadingList(true);

    const items = `idUsuario
    nombres
    apellidos`;

    const searchQuery = `or:[
      {nombres: {contains:"${search}"}}
      {apellidos: {contains:"${search}"}}
    ]`;

    const orderQuery = `nombres: ASC`;
    
    getByPag("usuarios",items,countItems,perPageDefault,searchQuery,orderQuery).then((res)=>{
      setTotalItems(res.totalCount);

      const data = res.items.map((item)=>{
        return new Item(
          item.idUsuario,
          getTitle(item.nombres,item.apellidos),"","",
          MultiData.find((sel)=>{
            return sel.id==item.id
          })? true:false)
      });
      setList(data);
    }).catch((err)=>{
      message.error("No se pudo cargar la lista de usuarios");
      console.log(err);
      setLoadingList(false);
    });
  }

  const setList = (result) =>{
    setItems(result);
    setLoadingList(false);
  }

  //======================================================================
  // Deselect an item when is clicked from top list
  //======================================================================
  const desSelectItem =(id,index) =>{
    setMultiData(MultiData.filter((item,indexF)=>indexF!=index));
    let newArr = [...Items]; // copying the old datas array
    newArr.map((item)=>{
        if(item.id==id){
            item.selected = false;
        }
    });

    setItems(newArr);

    if(MultiData.length == 1){
        setMultiData([]);
        setSelectionMode(false);
    }
  }

  const onBack=()=>{
    if(picker){
        if (typeof props.onBack === "function") {
            props.onBack();
        }
    }else{
        Navigate(-1);
    }
  }
    
  const onSearch = (value) =>{
    search = value;
    countItems = 0;
    UsersGet();
  }

  const onChangePage = (page) =>{
    countItems = (page-1)*perPageDefault;
    UsersGet();
  }

  const onClickAddUser=()=>{
    Navigate("/Personal/Ajustes/Admin/Usuario/"+FormActions.Add);
  }

  return(
    <Layout>
      <PageHeader 
      className="TopTittle" 
      ghost={false} 
      onBack={()=>{onBack()}} 
      title={

      <Title level={2}>
        Usuarios
      </Title>}
      extra={<>

        <Button 
        style={{display:selectionMode && !picker?"":"none"}} 
        shape="circle" 
        size='large' 
        onClick={()=>{/*This will be Delete */}} 
        icon={<DeleteOutlined/>}/>
      </>}>
          
          <MapSelectedItems 
          data={MultiData} 
          item={(item,index)=>(

            <SelectedItem 
            key={index}
            index={index}
            item={item} 
            onClick={(id,index)=>{desSelectItem(id,index)}} 
            />)}
          />
      </PageHeader>

      <button 
      className='BottomRoundButton' 
      onClick={()=>{onClickAddUser()}} 
      style={{display:picker?"none":""}}>
        <PlusOutlined/>
      </button>

      <button 
      className='BottomRoundButton' 
      onClick={()=>{props.onFinish(MultiData)}} 
      style={{display:selectionMode && multi?"":"none"}}>
        <CheckOutlined/>
      </button>

      <Layout className='ContentLayout'>
        <Searchbar 
        onSearch={(value)=>{onSearch(value)}} 
        loading={LoadingList}/>

        <Pagination 
        onChange={(page)=>{onChangePage(page)}} 
        defaultPageSize={perPageDefault} 
        total={totalItems} 
        style={{marginTop:"20px"}}/>

        <MultiSelectList
        items={Items}
        setItems={(v)=>{setItems(v)}}
        loading={LoadingList}
        selectionMode={selectionMode}
        setSelectionMode={(v)=>{setSelectionMode(v)}}
        multiData={MultiData}
        setMultiData={(v)=>{setMultiData(v)}}
        onClick={(item)=>{Navigate("/Personal/Ajustes/Admin/Usuario/"+FormActions.Update+"/"+item.id)}}
        pickerMode={({
          picker:picker,
          multi:multi,
          onFinish:(items)=>{console.log("Finish Picker Mode")}
        })}
        />
      </Layout>
    </Layout>
  )
}