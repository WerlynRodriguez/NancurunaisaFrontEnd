import {PageHeader,Typography, Layout, Pagination, List, Button, message} from 'antd';
import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import "../../../Utils/TextUtils.css";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Searchbar from '../../../Components/SearchBar';
import ItemView from "../../../Components/Items/TerapeutaItem";
import { GetByPagTera, SearchTera } from '../../../Utils/FetchingInfo';
import { FormActions } from '../../../Utils/ActionsProviders';
import { MapSelectedItems } from '../../../Utils/TextUtils';
import SelectedItem from '../../../Components/Items/SelectedItem';
import { Terapia } from '../../../Models/Models';
import { AllowFunction, Ranges } from '../../../Utils/RangeProviders';

const { Title } = Typography;

export default function Terapias(props){
    let Navigate = useNavigate();/*Go back */
    const [Teras, setTeras] = useState([]);
    const perPageDefault = 5;
    const [totalItems,setTotalItems] = useState(0);
    const [search,setSearch] = useState("");
    const [page,setPage] = useState(1);
    const [LoadingList,setLoadingList] = useState(true);

    const isPicker = props.picker==true? true:false;
    const isMulti = props.multi==true? true:false

    const [MultiData,setMultiData] = useState(props.data? props.data:[]);
    const grid = isPicker? {}:{ gutter: 16, xs: 1, sm: 1, md: 2,lg: 2,xl: 3,xxl: 3 }
    const [selectionMode,setSelectionMode] = useState(isMulti?true:false);//is selection mode

    useEffect(() => {
        getTeras(page,search)
      }, [])

    const setList = (result) =>{
        setTeras(result);
        setLoadingList(false);
    }

    const getTeras=(Page,search)=>{
        setLoadingList(true);
        GetByPagTera(Page,perPageDefault,search)
        .then((result)=>{
            setTotalItems(result.pages*perPageDefault);
            const data=[];
            result.terapias.map((item)=>{
                data.push(new Terapia(item.idTerapia,item.nombreTerapia,item.duracion,item.precioDomicilio,item.precioLocal,MultiData.find((sel)=>{return sel.idTerapia==item.idTerapia})? true:false));
            });
            setList(data);}).catch((error)=>{message.error(error.message)});
    }

    const setSelectedPac =(index,sel)=>{
        let newArr = [...Teras]; // copying the old datas array
        newArr[index].selected = sel; //key and value
        setTeras(newArr);
    }

    const setMultiSelected =(index,id,selected)=>{//multi selection select or deselect
        if(selected){//if is selected, i want to deselect 
            setMultiData(MultiData.filter(item=>item.idTerapia!=id));
            setSelectedPac(index,false);
            if(MultiData.length == 1){
                setMultiData([]);
                setSelectionMode(false);
            }
        }else{
            setMultiData(MultiData => [...MultiData, Teras[index]]);
            setSelectedPac(index,true);
        }
    }

    const desSelectItem =(id,index) =>{
        setMultiData(MultiData.filter((item,indexF)=>indexF!=index));

        let newArr = [...Teras]; // copying the old datas array
        newArr.map((item)=>{
            if(item.idTerapia==id){
                item.selected = false;
            }
        });

        setTeras(newArr);

        if(MultiData.length == 1){
            setMultiData([]);
            setSelectionMode(false);
        }
    }

    const onLongPress = (id,name,selected,index) => {
        if(isPicker){
            props.onFinish(Teras[index]);
        }else{
           if(selectionMode){//if iam in multi Selection Mode
                setMultiSelected(index,id,selected);
            }else{
                setMultiData(MultiData => [...MultiData, Teras[index]]);
                setSelectedPac(index,true);
                setSelectionMode(true);
            } 
        }        
    }

    const onclick=(id,name,selected,index)=>{
        if(isPicker){
            props.onFinish(Teras[index]);
        }else if (isMulti){
            if(!selectionMode) { setSelectionMode(true); }
            setMultiSelected(index,id,selected);
        }else {
           if(selectionMode){//if iam in multi Selection Mode
                setMultiSelected(index,id,selected);
            }else{
                if(AllowFunction([Ranges.Owner])){//Owner and Employ can edit
                    Navigate("/Personal/Clinica/Terapia/"+FormActions.Update+"/"+id);
                }else{/*Range for ReadOnly */
                    Navigate("/Personal/Clinica/Terapia/"+FormActions.Read+"/"+id);
                }
            }
        }
    }

    const onSearch = (value) =>{
        setSearch(value);
        setPage(1);
        getTeras(1,value);
    }

    const onChangePage = (page) =>{
        setPage(page);
        getTeras(page,search);
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

    const onClickAddTera=()=>{
        Navigate("/Personal/Clinica/Terapia/"+FormActions.Add);
    }

    return(<Layout>
        <PageHeader className="TopTittle" ghost={false} onBack={()=>{onBack()}} title={<Title level={2}>Terapia</Title>}
        extra={<><Button style={{display:selectionMode && !isPicker && !isMulti?"":"none"}} shape="circle" size='large' 
                onClick={()=>{console.log(MultiData)}} icon={<DeleteOutlined/>}/></>}>
            
            <MapSelectedItems data={MultiData} item={(item,index)=>(<SelectedItem key={index} index={index} text={item.nombreTerapia} avatar={""} 
            onClick={(index)=>{desSelectItem(item.idTerapia,index)}} />)}/>
            
        </PageHeader>

        <button className='BottomRoundButton' onClick={()=>{onClickAddTera()}} style={{display:isPicker||isMulti?"none":""}}><PlusOutlined/></button>
        <button className='BottomRoundButton' onClick={()=>{props.onFinish(MultiData)}} style={{display:selectionMode && isMulti?"":"none"}}><CheckOutlined/></button>

        <Layout className='ContentLayout'>
        <Searchbar search={search} onSearch={(value)=>{onSearch(value)}} loading={LoadingList}/>
            <Pagination onChange={(page)=>{onChangePage(page)}} defaultPageSize={perPageDefault} total={totalItems} style={{marginTop:"20px"}}/>
            <List style={{marginTop:"40px"}} loading={LoadingList} grid={grid}
            dataSource={Teras} renderItem={(tera,index) => (
                <ItemView id={tera.idTerapia} avatar={""} onClick={(id,name,selected)=>{onclick(id,name,selected,index)}}
                onLongPress={(id,name,selected)=>{onLongPress(id,name,selected,index)}} mulSelMode={selectionMode}
                text={tera.nombreTerapia} selected={tera.selected}/>
            )}/>
        </Layout>
    </Layout>)
}