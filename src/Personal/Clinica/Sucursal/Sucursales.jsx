import {PageHeader,Typography, Layout, Input,Empty, List, Pagination, Button} from 'antd';
import { useNavigate} from "react-router-dom";
import { GetByPagSucur, SearchSucur } from '../../../Utils/FetchingInfo';
import React, {useState,useEffect} from 'react';
import ItemView from "../../../Components/Items/TerapeutaItem";
import Searchbar from "../../../Components/SearchBar";
import "../../../Utils/TextUtils.css";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { FormActions } from '../../../Utils/ActionsProviders';
import { Sucursal } from '../../../Models/Models';
import { MapSelectedItems } from '../../../Utils/TextUtils';
import SelectedItem from '../../../Components/Items/SelectedItem';
import { DenyFunction, Ranges } from '../../../Utils/RangeProviders';

const { Title } = Typography;

export default function Sucursales(props){
    let Navigate = useNavigate();/*Go back */
    const [Sucurs, setSucurs] = useState([]);
    const perPageDefault = 5;
    const [totalItems,setTotalItems] = useState(0);
    const [LoadingList,setLoadingList] = useState(true);

    const [search,setSearch] = useState("");
    const [page,setPage] = useState(1);
    
    const isPicker = props.picker==true? true:false
    const isMulti = props.multi==true? true:false

    const [MultiData,setMultiData] = useState(props.data? props.data:[]);
    const grid = { gutter: 16, xs: 1, sm: 1, md: 2,lg: 2,xl: 3,xxl: 3 }

    const [selectionMode,setSelectionMode] = useState(isMulti?true:false);//is selection mode
    useEffect(() => {
        getSucurs(1)
      }, [])

    const setList = (result) =>{
        setSucurs(result);
        setLoadingList(false);
    }

    const getSucurs=(Page,search)=>{
        setLoadingList(true);
        GetByPagSucur(Page,perPageDefault,search)
        .then((result)=>{
            setTotalItems(result.pages*perPageDefault);
            const data = [];
            result.sucursales.map((item)=>{
                data.push(new Sucursal(item.idSucursal,item.nombreSucursal,"",MultiData.find((sel)=>{return sel.idSucursal==item.idSucursal})? true:false));
            });

            setList(data);})
    }

    const setSelectedItem =(index,sel)=>{
        let newArr = [...Sucurs]; // copying the old datas array
        newArr[index].selected = sel; //key and value
        setSucurs(newArr);
    }

    const setMultiSelected =(index,id,selected)=>{//multi selection select or deselect
        if(selected){//if is selected, i want to deselect 
            setMultiData(MultiData.filter(item=>item.idSucursal!=id));
            setSelectedItem(index,false);
            if(MultiData.length == 1){
                setMultiData([]);
                setSelectionMode(false);
            }
        }else{
            setMultiData(MultiData => [...MultiData, Sucurs[index]]);
            setSelectedItem(index,true);
        }
    }

    const desSelectItem =(id,index) =>{
        //setMultiData(MultiData.slice(index,1));
        setMultiData(MultiData.filter((item,indexF)=>indexF!=index));

        let newArr = [...Sucurs]; // copying the old datas array
        newArr.map((item)=>{
            if(item.idSucursal==id){
                item.selected = false;
            }
        });

        setSucurs(newArr);

        if(MultiData.length == 1){
            setMultiData([]);
            setSelectionMode(false);
        }
    }


    const onLongPress = (id,name,selected,index) => {
        if(isPicker){
            props.onFinish(Sucurs[index]);
        }else{
           if(selectionMode){//if iam in multi Selection Mode
                setMultiSelected(index,id,selected);
            }else{
                setMultiData(MultiData => [...MultiData, Sucurs[index]]);
                setSelectedItem(index,true);
                setSelectionMode(true);
            } 
        }        
    }

    const onclick=(id,name,selected,index)=>{
        if(isPicker){
            props.onFinish(Sucurs[index]);
        }else if (isMulti){
            if(!selectionMode) { setSelectionMode(true); }
            setMultiSelected(index,id,selected);
        }else {
           if(selectionMode){//if iam in multi Selection Mode
                setMultiSelected(index,id,selected);
            }else{
                if(DenyFunction([Ranges.Employ])){//Owner and Employ can edit
                    Navigate("/Personal/Clinica/Sucursal/"+FormActions.Update+"/"+id);
                }else{/*Range for ReadOnly */
                    Navigate("/Personal/Clinica/Sucursal/"+FormActions.Read+"/"+id);
                }
            }
        }
    }

    const onSearch = (value) =>{
        setSearch(value);
        setPage(1);
        getSucurs(1,value);
    }

    const onChangePage = (page) =>{
        setPage(page);
        getSucurs(page,search);
    }

    const onBack=()=>{
        if(isPicker || isMulti){
            if (typeof props.onBack === "function") {
                props.onBack();
            }
        }else{
            Navigate(-1)
        }
    }

    const onClickAddSucur=()=>{
        Navigate("/Personal/Clinica/Sucursal/"+FormActions.Add);
    }

    return (
    <Layout>
        <PageHeader className="TopTittle" ghost={false} onBack={()=>{onBack()}} title={<Title level={2}>Sucursales</Title>}
        extra={<><Button style={{display:selectionMode && !isPicker && !isMulti?"":"none"}} shape="circle" size='large' 
        onClick={()=>{console.log(MultiData)}} icon={<DeleteOutlined/>}/></>}>
            <MapSelectedItems data={MultiData} item={(item,index)=>(<SelectedItem key={index} index={index} text={item.nombreSucursal} avatar={""} 
            onClick={(index)=>{desSelectItem(item.idSucursal,index)}}/>)}/>
        </PageHeader>
        <button className='BottomRoundButton' onClick={()=>{onClickAddSucur()}} style={{display:isPicker||isMulti?"none":""}}><PlusOutlined/></button>
        <button className='BottomRoundButton' onClick={()=>{props.onFinish(MultiData)}} style={{display:selectionMode && isMulti?"":"none"}}><CheckOutlined/></button>
        <Layout className='ContentLayout'>
            <Searchbar search={search} onSearch={(value)=>{onSearch(value)}} loading={LoadingList}/>
            <Pagination onChange={(page)=>{onChangePage(page)}} defaultPageSize={perPageDefault} total={totalItems} style={{marginTop:"20px"}}/>
            <List style={{marginTop:"40px"}} loading={LoadingList} grid={grid}
            dataSource={Sucurs} renderItem={(sucur,index) => (
                <ItemView id={sucur.idSucursal} avatar={""} onClick={(id,name,selected)=>{onclick(id,name,selected,index)}}
                onLongPress={(id,name,selected)=>{onLongPress(id,name,selected,index)}} mulSelMode={selectionMode}
                text={sucur.nombreSucursal} selected={sucur.selected}/>
            )}/>
        </Layout>         
    </Layout>)
}