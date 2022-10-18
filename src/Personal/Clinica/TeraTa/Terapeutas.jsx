import {PageHeader,Typography, Layout, Input, List, Pagination, Collapse, Button, message} from 'antd';/*osiris */
import { useNavigate} from "react-router-dom";
import { getByPag } from '../../../Utils/FetchingInfo';
import React, {useState,useEffect} from 'react';
import "../../../Utils/TextUtils.css";
import Searchbar from '../../../Components/SearchBar';
import { CheckOutlined, ControlOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FormActions } from '../../../Utils/ActionsProviders';
import { getFirstWord, MapSelectedItems } from '../../../Utils/TextUtils';
import { Item } from '../../../Models/Models';
import SelectedItem from '../../../Components/Items/SelectedItem';
import { AllowFunction, Ranges } from '../../../Utils/RangeProviders';
import MultiSelectList from '../../../Utils/MultiSelectList';
const { Title } = Typography;

function getTitle(a,b){
  return getFirstWord(a)+" "+getFirstWord(b);
}

export default function Terapeutas(props){
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
    TeraTasGet()
  }, [])

  //======================================================================
  // Get data from server, pagination + search + filter
  //======================================================================
  const TeraTasGet = () => {
    setLoadingList(true);

    const items = `idTerapeuta
    idUsuarioNavigation{
      nombres
      apellidos
      foto
    }`;

    const searchQuery = `or:[
      {idUsuarioNavigation:{
        nombres:{contains:"${search}"}
      }}
      {idUsuarioNavigation:{
        apellidos:{contains:"${search}"}
      }}
    ]`;

    const orderQuery = `idUsuarioNavigation:{
      nombres:ASC
    }`;
    
    getByPag("terapeutas",items,countItems,perPageDefault,searchQuery,orderQuery).then((res)=>{
      setTotalItems(res.totalCount);

      const data = res.items.map((item)=>{
        return new Item(
          item.idTerapeuta,
          getTitle(item.idUsuarioNavigation.nombres,item.idUsuarioNavigation.apellidos),"","",
          MultiData.find((sel)=>{
            return sel.id==item.idTerapeuta;
          })? true:false)
      });
      setList(data);
    }).catch((err)=>{
      console.log(err);
      message.error("No se pudo cargar la lista de terapeutas");
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
        Navigate(-1)
    }
  }
    
  const onSearch = (value) =>{
    search = value;
    countItems = 0;
    TeraTasGet();
  }

  const onChangePage = (page) =>{
    countItems = (page-1)*perPageDefault;
    TeraTasGet();
  }

  const onClickAddTerata=()=>{
    Navigate("/Personal/Clinica/Terapeuta/"+FormActions.Add);
  }

  return(
    <Layout>
      <PageHeader 
      className="TopTittle" 
      ghost={false} 
      onBack={()=>{onBack()}} 
      title={

      <Title level={2}>
        Terapeutas
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
      onClick={()=>{onClickAddTerata()}} 
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
        onClick={(item)=>{console.log("Clicked in Normal Mode")}}
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