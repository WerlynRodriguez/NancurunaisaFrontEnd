import {PageHeader,Typography, Layout, Pagination, List, Button, Avatar} from 'antd';
import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import "../../../Utils/TextUtils.css";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ItemView from '../../../Components/Items/TerapeutaItem';
import { getFirstWord, MapSelectedItems } from '../../../Utils/TextUtils';
import Searchbar from '../../../Components/SearchBar';
import { GetByPagPacS, SearchPacS } from '../../../Utils/FetchingInfo';
import { FormActions } from '../../../Utils/ActionsProviders';
import { AllowFunction, Ranges } from '../../../Utils/RangeProviders';
import {Paciente} from '../../../Models/Models';
import SelectedItem from '../../../Components/Items/SelectedItem';

const { Title } = Typography;

export default function Pacientes(props){
    let Navigate = useNavigate();/*Go back */
    const [PacS, setPacS] = useState([]);
    const perPageDefault = 5;
    const [totalItems,setTotalItems] = useState(0);
    const [LoadingList,setLoadingList] = useState(true);
    const [search,setSearch] = useState("");
    const [page,setPage] = useState(1);

    const isPicker = props.picker==true? true:false
    const isMulti = props.multi==true? true:false

    const [MultiData,setMultiData] = useState(props.data? props.data:[]);
    const grid = isPicker? {}:{ gutter: 16, xs: 1, sm: 1, md: 2,lg: 2,xl: 3,xxl: 3 }

    const [selectionMode,setSelectionMode] = useState(isMulti?true:false);//is selection mode
    useEffect(() => {
        getPacS(page,search)
      }, [])

    const setList = (result) =>{
        setPacS(result);
        setLoadingList(false);
    }

    const getPacS=(Page,search)=>{
        setLoadingList(true);
        GetByPagPacS(Page,perPageDefault,search)
        .then((result)=>{
            setTotalItems(result.pages*perPageDefault);
            const data = [];
            result.pacientes.map((item)=>{
                data.push(new Paciente(item.idPaciente,item.nombres,item.apellidos,"F",12,"","","","","",MultiData.find((sel)=>{return sel.idPaciente==item.id})? true:false));
            });
            setList(data);})
    }

    const onSearch = (value) =>{
        setSearch(value);
        setPage(1);
        getPacS(1,value);
    }

    const onChangePage = (page) =>{
        setPage(page);
        getPacS(page,search);
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

    const onLongPress = (id,name,selected,index) => {
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

    const onclick=(id,name,selected,index)=>{
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
            <Searchbar search={search} onSearch={(value)=>{onSearch(value)}} loading={LoadingList}/>
            <Pagination onChange={(page)=>{onChangePage(page)}} defaultPageSize={perPageDefault} total={totalItems} style={{marginTop:"10px"}}/>
            <List style={{marginTop:"10px"}} loading={LoadingList} grid={grid}
            dataSource={PacS} renderItem={(pacS,index) => (
                <ItemView id={pacS.idPaciente} avatar={""} onClick={(id,name,selected)=>{onclick(id,name,selected,index)}}
                onLongPress={(id,name,selected)=>{onLongPress(id,name,selected,index)}} mulSelMode={selectionMode}
                text={pacS.getShortName} selected={pacS.selected}/>
            )}/>
        </Layout>
    </Layout>)
}