import { CheckOutlined, FilterFilled } from "@ant-design/icons";
import { Button, Layout, Menu, PageHeader, Pagination, Typography} from "antd";
import { DropdownMenu, MapSelectedItems } from '../Utils/TextUtils';
import SelectedItem from './Items/SelectedItem';
import Searchbar from "./SearchBar";
import MultiSelectList from "./MultiSelectList";
import React, {useState,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { getByPag } from "../Utils/FetchingInfo";
import { FormActions } from '../Utils/ActionsProviders';
//import { BottomSheet } from "react-spring-bottom-sheet";

import "../Utils/TextUtils.css";
import ToolBar from "./ToolBar";

const { Title } = Typography;

/* This  is a Page with the next comun features:
    * - Search
    * - Filter
    * - Pagination
    * - List of items
    * - MultiSelect
    * - Tools buttons
    * - Picker mode with multi selection
*/
export default function PageList(props){
    let Navigate = useNavigate();
    let { title, itemsMenu, onClickItemMenu, varsToFetch, adapter, selectMenu, renderItem, tools, pickerSettings } = props;
    const {picker, multi, dataPicked, onBack, onFinish} = pickerSettings;

    const [Items, setItems] = useState([]);
    const [LoadingList,setLoadingList] = useState(true);
    const perPageDefault = 6;
    const [totalItems,setTotalItems] = useState(0);

    // Page * perPage = offset
    var countItems = 0;
    var search = "";

    const [MultiData,setMultiData] = useState(dataPicked ? dataPicked : []);

    //If is multi picker mode, the multi selection is enabled automatically
    const [selectionMode,setSelectionMode] = useState(multi ? true : false);

    const [showFilter,setShowFilter] = useState(false);

    // This menu is used when the user is in multi selection mode, 
    // and the user can select the action to do with the selected items
    const menuItems = !itemsMenu? [] : itemsMenu.map((item) => {
        return {key: item.key, label: item.label, onClick: () => {
            onClickItemMenu(item.key,{MultiData,setMultiData,setSelectionMode,setLoadingList,fetchData});
        }}
    });

    const userMenu = ( 
        <Menu
        style={{width:"200px",borderRadius:"15px"}}
        items={menuItems}
        />
    );

    useEffect(() => {
        fetchData();
    }, [])

    //======================================================================
    // Get data from server, pagination + search + filter
    //======================================================================
    const fetchData = () => {
        setLoadingList(true);

        const vars = varsToFetch(search);

        getByPag(vars.table, vars.items, countItems, perPageDefault, vars.searchQuery, vars.orderQuery)
        .then((res) => {
            if (res=="errors") return;

            setItems(adapter(res.items,MultiData));
            setTotalItems(res.totalCount);
            setLoadingList(false);
        });
    }

    const GoBack = () => {
        if (picker || onBack){
            onBack();
        }else{
            Navigate(-1);
        }
    }

    const desSelectItem =(id,index) =>{
        setMultiData(MultiData.filter((item,indexF)=>indexF!=index));
        let newArr = [...Items]; // copying the old datas array
        newArr.map((item)=>{
            if(item.id==id){
                item.selected = false;
            }
        });
    
        setItems(newArr);
    
        if (MultiData.length != 1) return;
        setMultiData([]);
        
        if (!multi)
            setSelectionMode(false);
    }

    return (<Layout>
        
        <PageHeader
        ghost={false}
        onBack={GoBack} 
        title={

        <Title level={selectionMode ? 4 : 2 }>
            {selectionMode ? "Seleccionando " + MultiData.length + " "+title : title}
        </Title>}

        extra={<>
            
            <Button
            shape='circle'
            size='large'
            onClick={()=>{setShowFilter(!showFilter)}}
            icon={<FilterFilled />}/>

            <DropdownMenu
            key="1"
            active={selectionMode && !picker}
            menu={userMenu}/>
        </>}
        >
            
            <MapSelectedItems 
            data={MultiData} 
            itemRender={(item,index)=>(

                <SelectedItem 
                key={index}
                index={index}
                item={item} 
                onClick={(id,index)=>{desSelectItem(id,index)}} 
                />)}
            />
        </PageHeader>

        <ToolBar tools={picker ? null : tools}/>

        <button 
        className='BottomRoundButton'
        style={{display: multi ? "" : "none"}}
        onClick={() => {onFinish(MultiData)}}>
            <CheckOutlined />
        </button>

        <Layout className='ContentLayout'>
            <Searchbar 
            onSearch={(value)=>{search = value; fetchData();}} 
            loading={LoadingList}/>

            <Pagination 
            onChange={(page)=>{countItems = (page-1)*perPageDefault; fetchData();}} 
            defaultPageSize={perPageDefault} 
            total={totalItems} 
            style={{marginTop:"20px"}}/>

            <MultiSelectList
            items={Items}
            setItems={(v)=>{setItems(v)}}
            renderItem={renderItem}
            loading={LoadingList}
            selectionMode={selectionMode}
            setSelectionMode={(v)=>{setSelectionMode(v)}}
            multiData={MultiData}
            setMultiData={(v)=>{setMultiData(v)}}
            pickerSettings={pickerSettings}
            />
      </Layout>

    </Layout>);
}