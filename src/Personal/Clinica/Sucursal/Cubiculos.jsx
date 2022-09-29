import { Button, Layout, List, PageHeader,Pagination,Typography } from "antd";
import { MapSelectedItems } from "../../../Utils/TextUtils";
import React, {useState,useEffect} from 'react';
import SelectedItem from '../../../Components/Items/SelectedItem';
import ItemView from "../../../Components/Items/TerapeutaItem";
import Searchbar from "../../../Components/SearchBar";
import { GetByPagCubic } from "../../../Utils/FetchingInfo";
import { Habitacion } from "../../../Models/Models";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
const { Title } = Typography;

export default function Cubiculos(props){
    const [Cubi, setCubi] = useState([]);
    const [LoadingList,setLoadingList] = useState(true);
    const perPageDefault = 5;
    const [totalItems,setTotalItems] = useState(0);
    
    const isPicker = props.picker==true? true:false
    const isMulti = props.multi==true? true:false

    const [MultiData,setMultiData] = useState(props.data? props.data:[]);
    const grid = { gutter: 16, xs: 1, sm: 1, md: 2,lg: 2,xl: 3,xxl: 3 };
    const [selectionMode,setSelectionMode] = useState(props.multi?true:false);//is selection mode

    useEffect(() => {
        getCubs(1)
      }, [])

    const setList = (result) =>{
        setCubi(result);
        setLoadingList(false);
    }

    const getCubs=(Page)=>{
        setLoadingList(true);
        GetByPagCubic(props.idSuc,Page,perPageDefault)
        .then((result)=>{
            setTotalItems(result.pages*perPageDefault);
            const data = [];
            result.habitaciones.map((item)=>{
                data.push(new Habitacion(item.idHabitacion,item.idSucursal,item.nombreHabitacion,MultiData.find((sel)=>{return sel.idSucursal==item.id})? true:false,""));
            });
            setList(data);
        })
    }

    const setSelectedItem =(index,sel)=>{
        let newArr = [...Cubi]; // copying the old datas array
        newArr[index].selected = sel; //key and value
        setCubi(newArr);
    }

    const setMultiSelected =(index,id,selected)=>{//multi selection select or deselect
        if(selected){//if is selected, i want to deselect 
            setMultiData(MultiData.filter(item=>item.idHabitacion!=id));
            setSelectedItem(index,false);
            if(MultiData.length == 1){
                setMultiData([]);
                setSelectionMode(false);
            }
        }else{
            setMultiData(MultiData => [...MultiData, Cubi[index]]);
            setSelectedItem(index,true);
        }
    }

    const desSelectItem =(id,index) =>{
        //setMultiData(MultiData.slice(index,1));
        setMultiData(MultiData.filter((item,indexF)=>indexF!=index));

        let newArr = [...Cubi]; // copying the old datas array
        newArr.map((item)=>{
            if(item.idHabitacion==id){
                item.selected = false;
            }
        });

        setCubi(newArr);

        if(MultiData.length == 1){
            setMultiData([]);
            setSelectionMode(false);
        }
    }


    const onLongPress = (id,name,selected,index) => {
        if(isPicker){
            props.onFinish(Cubi[index]);
        }else{
           if(selectionMode){//if iam in multi Selection Mode
                setMultiSelected(index,id,selected);
            }else{
                setMultiData(MultiData => [...MultiData, Cubi[index]]);
                setSelectedItem(index,true);
                setSelectionMode(true);
            } 
        }        
    }

    const onclick=(id,name,selected,index)=>{
        if(isPicker){
            props.onFinish(Cubi[index]);
        }else if (isMulti){
            if(!selectionMode) { setSelectionMode(true); }
            setMultiSelected(index,id,selected);
        }else {
           if(selectionMode){//if iam in multi Selection Mode
                setMultiSelected(index,id,selected);
            }
        }
    }

    const CubiSearch =(bus)=>{
        setLoadingList(true);
        SearchSucur(bus)
        .then((result)=>{
            setList(result);
          }
        )
    }

    const changePage=(Page)=>{
        setLoadingList(true)
        getCubs(Page);
    }

    const onBack=()=>{
        if(isPicker || isMulti){
            if (typeof props.onBack === "function") {
                props.onBack();
            }
        }else{
            Navigate(-1);
        }
    }

    return(<Layout>
        <PageHeader className="TopTittle" ghost={false} onBack={()=>{onBack()}} title={<Title level={2}>Cubiculos</Title>}
        extra={<><Button style={{display:selectionMode && !isPicker && !isMulti?"":"none"}} shape="circle" size='large' 
        onClick={()=>{console.log(MultiData)}} icon={<DeleteOutlined/>}/></>}>
            <MapSelectedItems data={MultiData} item={(item,index)=>(<SelectedItem key={index} index={index} text={item.nombreHabitacion} avatar={""} 
            onClick={(index)=>{desSelectItem(item.idHabitacion,index)}}/>)}/>
        </PageHeader>
        <button className='BottomRoundButton' onClick={()=>{props.onFinish(MultiData)}} style={{display:selectionMode && isMulti?"":"none"}}><CheckOutlined/></button>
        <Layout className='ContentLayout'>
            <Pagination onChange={(page)=>changePage(page)} defaultPageSize={perPageDefault} total={totalItems} style={{marginTop:"20px"}}/>
            <List style={{marginTop:"40px"}} loading={LoadingList} grid={grid}
            dataSource={Cubi} renderItem={(cubi,index) => (
                <ItemView id={cubi.idHabitacion} avatar={""} onClick={(id,name,selected)=>{onclick(id,name,selected,index)}}
                onLongPress={(id,name,selected)=>{onLongPress(id,name,selected,index)}} mulSelMode={selectionMode}
                text={cubi.nombreHabitacion} selected={cubi.selected}/>
            )}/>
        </Layout>
    </Layout>)
}