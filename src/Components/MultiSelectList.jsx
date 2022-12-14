import { List } from "antd";
import TerapeutaItem from "./Items/TerapeutaItem";
import React, {useEffect} from 'react';
import { NavLink } from "react-router-dom";
//This is the display of generic items in the list
//but supporting the selection of multiple items
//for normal and picker mode.
export default function MultiSelectList(props) {
    const {
        items,
        setItems,
        renderItem,
        loading,
        selectionMode,
        setSelectionMode,
        multiData,
        setMultiData,
        pickerSettings,
    } = props;

    const {picker, multi, dataPicked, onBack, onFinish} = pickerSettings;

    //Add an item in selection mode
    //item is for Multidata, index is for Items
    const addMSItem = (item, index) => {
        setMultiData(multiData => [...multiData, item]);
        changeSelectedItem(index, true);
    }

    //Remove an item in selection mode
    //item is for Multidata, index is for Items
    const removeMSItem = (itemA, index) => {
        setMultiData(multiData.filter(item => item.id != itemA.id));
        changeSelectedItem(index, false);

        if (multiData.length != 1) return;
        setMultiData([]);
        
        if (!multi)
            setSelectionMode(false);
    }

    // Change the value of selected in list of selected item by index
    const changeSelectedItem = (index, value) => {
        let newArr = [...items]; // copying the old datas array
        newArr[index].selected = value; //key and value
        setItems(newArr);
    }

    // When click on item in list in selection mode
    const setMultiSelected =(item,index)=>{
        if(item.selected){
            removeMSItem(item, index);
        }else{
            addMSItem(item, index);
        }
    }

    //======================================================================
    // Validate when the user clicks on an item in the list
    // and if it is in multi selection mode, in normal mode and in picker mode
    //======================================================================
    const onclick=(item,index,Click)=>{
        if(picker){
            if(multi){
                //If it is a multi picker mode, it will add or remove the item from the list
                if(!selectionMode) { setSelectionMode(true); }
                setMultiSelected(item,index);
            }else{
                //On picker mode, the item is selected and the list is closed
                onFinish(item);
            }
        }else {
           if(selectionMode){
                //On normal mode, start the selection of multiple items
                setMultiSelected(item,index);
            }else{
                //On normal mode, just select the item
                Click(item);
            }
        }
    }

    //======================================================================
    //Validate when the user makes a long click on an item in the list
    //and if it is in multi selection mode, in normal mode and in picker mode
    //======================================================================
    const onLongPress = (item,index) => {
        //If is in picker mode but isn't a multi picker mode, the item is selected and the list is closed
        if(picker && !multi){
            onFinish(item);
            return;
        }
        if(selectionMode){
            //On normal or multi picker mode, continue the selection of multiple items
            setMultiSelected(item,index);
        }else{
            //On normal or multi picker mode, start the selection of multiple items
            setMultiData(MultiData => [...MultiData, item]);
            changeSelectedItem(index,true);
            setSelectionMode(true);
        }
    }

    return (
        <List
        style={{width:"100%",marginTop:"40px"}}
        itemLayout="horizontal" 
        loading={loading} 
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2,lg: 2,xl: 3,xxl: 3 }}
        dataSource={items} 
        renderItem={(item,index) => 
            renderItem(item,index,onclick,onLongPress,selectionMode)
        }/>
    )
}