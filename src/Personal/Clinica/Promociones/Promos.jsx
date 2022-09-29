import { Button, Layout, List, message, PageHeader, Pagination, Typography} from "antd";
import SelectedItem from '../../../Components/Items/SelectedItem';
import Searchbar from "../../../Components/SearchBar";
import ItemView from '../../../Components/Items/TerapeutaItem';
import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import { GetbyPagPromos, SearchPromos } from "../../../Utils/FetchingInfo";
import { Promocion } from "../../../Models/Models";
import { CheckOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { MapSelectedItems } from "../../../Utils/TextUtils";
import { FormActions } from "../../../Utils/ActionsProviders";
import { AllowFunction, Ranges } from "../../../Utils/RangeProviders";

const { Title } = Typography;

export default function Promos(props) {
    let Navigate = useNavigate();/*Go back */
    const [Proms, setProms] = useState([]);
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
        getPromos(page,search);
      }, [])

    const setList = (result) =>{
        setProms(result);
        setLoadingList(false);
    }

    const getPromos=(Page,search)=>{
        setLoadingList(true);
        GetbyPagPromos(Page,perPageDefault,search).then((result)=>{
            setTotalItems(result.pages*perPageDefault);
            const data = [];
            result.promociones.map((item)=>{
                data.push(new Promocion(item.idPromocion,item.nombrePromocion,item.descripcion,MultiData.find((sel)=>{return sel.idPromocion==item.idPromocion})? true:false));
            });
            setList(data);
        }).catch((err)=>{
            message.error(err);});
    }

    const onSearch = (value) =>{
        setSearch(value);
        setPage(1);
        getPromos(1,value);
    }

    const onChangePage = (page) =>{
        setPage(page);
        getPromos(page,search);
    }

    const setSelectedItem =(index,sel)=>{
        let newArr = [...Proms]; // copying the old datas array
        newArr[index].selected = sel; //key and value
        setProms(newArr);
    }

    const setMultiSelected =(index,id,selected)=>{//multi selection select or deselect
        if(selected){//if is selected, i want to deselect 
            setMultiData(MultiData.filter(item=>item.idPromocion!=id));
            setSelectedItem(index,false);
            if(MultiData.length == 1){
                setMultiData([]);
                setSelectionMode(false);
            }
        }else{
            setMultiData(MultiData => [...MultiData, Proms[index]]);
            setSelectedItem(index,true);
        }
    }

    const desSelectItem =(id,index) =>{
        //setMultiData(MultiData.slice(index,1));
        setMultiData(MultiData.filter((item,indexF)=>indexF!=index));

        let newArr = [...Proms]; // copying the old datas array
        newArr.map((item)=>{
            if(item.idPromocion==id){
                item.selected = false;
            }
        });

        setProms(newArr);

        if(MultiData.length == 1){
            setMultiData([]);
            setSelectionMode(false);
        }
    }


    const onLongPress = (id,name,selected,index) => {
        if(isPicker){
            props.onFinish(Proms[index]);
        }else{
           if(selectionMode){//if iam in multi Selection Mode
                setMultiSelected(index,id,selected);
            }else{
                setMultiData(MultiData => [...MultiData, Proms[index]]);
                setSelectedItem(index,true);
                setSelectionMode(true);
            } 
        }        
    }

    const onclick=(id,name,selected,index)=>{
        if(isPicker){
            props.onFinish(Proms[index]);
        }else if (isMulti){
            if(!selectionMode) { setSelectionMode(true); }
            setMultiSelected(index,id,selected);
        }else {
           if(selectionMode){//if iam in multi Selection Mode
                setMultiSelected(index,id,selected);
            }else{
                if(AllowFunction([Ranges.Owner])){//Owner and Employ can edit
                    Navigate("/Personal/Clinica/Promo/"+FormActions.Update+"/"+id);
                }else{
                    Navigate("/Personal/Clinica/Promo/"+FormActions.Read+"/"+id);
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

    const onClickAddPromos=()=>{
        Navigate("/Personal/Clinica/Promo/"+FormActions.Add);
    }

    return (<Layout>
        <PageHeader className="TopTittle" ghost={false} onBack={()=>{onBack()}} title={<Title level={2}>Promociones</Title>}
        extra={<><Button style={{display:selectionMode && !isPicker && !isMulti?"":"none"}} shape="circle" size='large' 
        onClick={()=>{console.log(MultiData)}} icon={<DeleteOutlined/>}/></>}>
            <MapSelectedItems data={MultiData} item={(item,index)=>(<SelectedItem key={index} index={index} text={item.nombrePromocion} avatar={""} 
            onClick={(index)=>{desSelectItem(item.idPromocion,index)}}/>)}/>
        </PageHeader>
        <button className='BottomRoundButton' onClick={()=>{onClickAddPromos()}} style={{display:isPicker||isMulti?"none":""}}><PlusOutlined/></button>
        <button className='BottomRoundButton' onClick={()=>{props.onFinish(MultiData)}} style={{display:selectionMode && isMulti?"":"none"}}><CheckOutlined/></button>
        <Layout className='ContentLayout'>
            <Searchbar search={search} onSearch={(value)=>{onSearch(value)}} loading={LoadingList}/>
            <Pagination onChange={(page)=>{onChangePage(page)}} defaultPageSize={perPageDefault} total={totalItems} style={{marginTop:"10px"}}/>
            <List style={{marginTop:"10px"}} loading={LoadingList} grid={grid}
            dataSource={Proms} renderItem={(promo,index) => (
                <ItemView id={promo.idPromocion} avatar={""} onClick={(id,name,selected)=>{onclick(id,name,selected,index)}}
                onLongPress={(id,name,selected)=>{onLongPress(id,name,selected,index)}} mulSelMode={selectionMode}
                text={promo.nombrePromocion} selected={promo.selected}/>
            )}/>
        </Layout>
        </Layout>);
        }