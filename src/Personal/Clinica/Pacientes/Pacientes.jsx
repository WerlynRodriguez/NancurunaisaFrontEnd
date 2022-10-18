import {PageHeader,Typography, Layout, Pagination, List, Button, Avatar} from 'antd';
import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import "../../../Utils/TextUtils.css";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ItemView from '../../../Components/Items/TerapeutaItem';
import { MapSelectedItems } from '../../../Utils/TextUtils';
import Searchbar from '../../../Components/SearchBar';
import { getByPag } from '../../../Utils/FetchingInfo';
import { FormActions } from '../../../Utils/ActionsProviders';
import { AllowFunction, Ranges } from '../../../Utils/RangeProviders';
import {Paciente} from '../../../Models/Models';
import SelectedItem from '../../../Components/Items/SelectedItem';

const { Title } = Typography;

export default function Pacientes(props){
    let Navigate = useNavigate();/*Go back */
    const [PacS, setPacS] = useState([]);
    
    const [totalItems,setTotalItems] = useState(0);
    const [LoadingList,setLoadingList] = useState(true);
    
    var countItems = 0;
    var search = "";
    const [perPageDefault,setpPD] = useState(5);

    const isPicker = props.picker==true? true:false
    const isMulti = props.multi==true? true:false

    const [MultiData,setMultiData] = useState(props.data? props.data:[]);
    const grid = isPicker? {}:{ gutter: 16, xs: 1, sm: 1, md: 2,lg: 2,xl: 3,xxl: 3 }

    const [selectionMode,setSelectionMode] = useState(isMulti?true:false);//is selection mode
    useEffect(() => {
        getPacS()
      }, [])

    const setList = (result) =>{
        setPacS(result);
        setLoadingList(false);
    }

    const getPacS=()=>{
        setLoadingList(true);

        const items = `idPaciente
        nombres
        apellidos`;

        const searchQuery = `or:[
            {nombres: {contains:"${search}"}}
            {apellidos: {contains:"${search}"}}
        ]`;

        const orderQuery = `nombres: ASC`;

        console.log(perPageDefault)
        getByPag("paciente",items,countItems,perPageDefault,searchQuery,orderQuery)
        .then((res)=>{
            setTotalItems(res.totalCount);
            const data = res.items.map((item)=>{
                return new Paciente(item.idPaciente,item.nombres,item.apellidos,"F",12,"","","","","",MultiData.find((sel)=>{return sel.idPaciente==item.id})? true:false);
            });
            setList(data);
        }).catch((error)=>{
            console.log(error);
        });
    }

    const onSearch = (value) =>{
        search = value;
        countItems = 0;
        getPacS();
    }

    const onChangePage = (page) =>{
        countItems = (page-1)*perPageDefault;
        getPacS();
    }
    const setSelectedPac =(index,sel)=>{
        let newArr = [...PacS]; // copying the old datas array
        newArr[index].selected = sel; //key and value
        setPacS(newArr);
    }

    const setMultiSelected =(index,id,selected)=>{//multi selection select or deselect
        if(selected){//if is selected, i want to deselect 
            setMultiData(MultiData.filter(item=>item.idPaciente!=id));
            setSelectedPac(index,false);
            if(MultiData.length == 1){
                setMultiData([]);
                setSelectionMode(false);
            }
        }else{
            setMultiData(MultiData => [...MultiData, PacS[index]]);
            setSelectedPac(index,true);
        }
    }

    const desSelectItem =(id,index) =>{
        //setMultiData(MultiData.slice(index,1));
        setMultiData(MultiData.filter((item,indexF)=>indexF!=index));

        let newArr = [...PacS]; // copying the old datas array
        newArr.map((item)=>{
            if(item.idPaciente==id){
                item.selected = false;
            }
        });

        setPacS(newArr);

        if(MultiData.length == 1){
            setMultiData([]);
            setSelectionMode(false);
        }
    }

    const onLongPress = (id,selected,index) => {
        if(isPicker){
            props.onFinish(PacS[index]);
        }else{
           if(selectionMode){//if iam in multi Selection Mode
                setMultiSelected(index,id,selected);
            }else{
                setMultiData(MultiData => [...MultiData, PacS[index]]);
                setSelectedPac(index,true);
                setSelectionMode(true);
            } 
        }        
    }

    const onclick=(id,selected,index)=>{
        if(isPicker){
            props.onFinish(PacS[index]);
        }else if (isMulti){
            if(!selectionMode) { setSelectionMode(true); }
            setMultiSelected(index,id,selected);
        }else {
           if(selectionMode){//if iam in multi Selection Mode
                setMultiSelected(index,id,selected);
            }else{
                if(AllowFunction([Ranges.Owner,Ranges.Employ])){//Owner and Employ can edit
                    Navigate("/Personal/Clinica/Paciente/"+FormActions.Update+"/"+id);
                }else{
                    Navigate("/Personal/Clinica/Paciente/"+FormActions.Read+"/"+id);
                }
            }
        }
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

    const onClickAddPacs=()=>{
        Navigate("/Personal/Clinica/Paciente/"+FormActions.Add);
    }

    return(<Layout>
        <PageHeader className="TopTittle" ghost={false} onBack={()=>{onBack()}} title={<Title level={2}>Pacientes</Title>}
        extra={<><Button style={{display:selectionMode && !isPicker && !isMulti?"":"none"}} shape="circle" size='large' 
                onClick={()=>{console.log(MultiData)}} icon={<DeleteOutlined/>}/></>}>
            
            <MapSelectedItems data={MultiData} item={(item,index)=>(<SelectedItem key={index} index={index} text={item.getShortName} avatar={""} 
            onClick={(index)=>{desSelectItem(item.idPaciente,index)}} />)}/>
            
        </PageHeader>
        <button className='BottomRoundButton' onClick={()=>{onClickAddPacs()}} style={{display:isPicker||isMulti?"none":""}}><PlusOutlined/></button>
        <button className='BottomRoundButton' onClick={()=>{props.onFinish(MultiData)}} style={{display:selectionMode && isMulti?"":"none"}}><CheckOutlined/></button>
        <Layout className='ContentLayout'>
            <Searchbar onSearch={(value)=>{onSearch(value)}} loading={LoadingList}/>
            <Pagination onChange={(page)=>{onChangePage(page)}} defaultPageSize={5} total={totalItems} defaultCurrent={1}
            style={{marginTop:"10px"}} onShowSizeChange={(current, size)=>{setpPD(size);onChangePage(current)}}/>
            <List style={{marginTop:"10px"}} loading={LoadingList} grid={grid}
            dataSource={PacS} renderItem={(pacS,index) => (
                <ItemView id={pacS.idPaciente} avatar={""} onClick={(id,selected)=>{onclick(id,selected,index)}}
                onLongPress={(id,selected)=>{onLongPress(id,selected,index)}} mulSelMode={selectionMode}
                text={pacS.getShortName} selected={pacS.selected}/>
            )}/>
        </Layout>
    </Layout>)
}