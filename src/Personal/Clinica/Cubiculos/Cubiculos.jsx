import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import "../../../Utils/TextUtils.css";
import { PlusOutlined } from '@ant-design/icons';
import { ChangeStatus, Create, Update } from '../../../Utils/FetchingInfo';
import { FormActions } from '../../../Utils/ActionsProviders';
import {Habitacion, Item} from '../../../Models/Models';
import TerapeutaItem from '../../../Components/Items/TerapeutaItem';
import PageList from '../../../Components/PageList';
import { Form, Input, message, Modal } from "antd";

export default function Cubiculos(props){
    let Navigate = useNavigate();/*Go back */
    const {picker, multi, dataPicked, onBack, onFinish, idSU} = props;
    const [form] = Form.useForm();
    const [showModal, setShowModal] = useState(0);
    const [selectedCubic, setSelectedCubic] = 
        useState(new Habitacion(null));

    const [loadModal, setLoadModal] = useState(false);

    const varsToFetch = (search) => {
        return {
            table: "habitaciones",
            items: `idHabitacion
            nombreHabitacion
            activo`,
            searchQuery: `and:[
                {nombreHabitacion: {contains:"${search}"}},
                {idSucursal:{eq:${idSU}}}
            ]`,
            orderQuery: "nombreHabitacion: ASC"
        }
    }

    const adapter = (data,multidata) => {
        return data.map((item) => {
            return new Item(
                item.idHabitacion,
                [item.nombreHabitacion],
                "",
                item.activo, 
                multidata.find((i) => i.id == item.idHabitacion));
        })
    }

    const onClickItem = (item) => {
        form.setFieldsValue({
            nombreHabitacion: item.info[0]
        });
        setSelectedCubic(new Habitacion({
            idHabitacion: item.id,
            nombreHabitacion: item.info[0],
            activo: item.activo,
            idSucursal: idSU
        }));
        setShowModal(2);
    }

    const itemsMenu = [
        {key:"Act",label:"Activar"},
        {key:"Des",label:"Desactivar"},
    ];

    const onClickItemMenu = (key,info) => {
        switch (key) {
            case "Act":
                changeStatusMD(false,info);
                break;
            case "Des":
                changeStatusMD(true,info);
                break;
            default:
                break;
        }
    }

    const changeStatusMD = (status,info) => {
        let ids = info.MultiData.map((item)=>{return item.id});
    
        info.setLoadingList(true);
        ChangeStatus("Habitacion","idHabitaciones","["+ids+"]","activo",status,"idHabitacion").then((response) => {
            if (response == "errors") { info.setLoadingList(false); return; }

            message.success("Habitaciones actualizadas correctamente",1,()=>{
                info.setSelectionMode(false);
                info.setMultiData([]);
                info.fetchData();
            });
      });
    }

    const tools = [
        {icon:<PlusOutlined/>,onClick:()=>{
            form.setFieldsValue({
                nombreHabitacion: ""
            });
            setSelectedCubic(new Habitacion(null));
            setShowModal(1)
        }}
    ];

    const AddCubic = () => {
        setLoadModal(true);
        selectedCubic.idSucursal = idSU;
        const vars = selectedCubic.toString(form.getFieldsValue());

        Create("Habitacion","habitacionInput",vars,"idHabitacion").then((response) => {
            if (response == "errors") { setLoadModal(false); return; }
            message.success("Habitación creada correctamente",1,()=>{
                setLoadModal(false);
                setShowModal(0);
            });
        });

    }

    const UpdateCubic = () => {
        setLoadModal(true);
        const vars = selectedCubic.toString(form.getFieldsValue());

        Update("Habitacion","habitacionInput",vars,"idHabitacion").then((response) => {
            if (response == "errors") { setLoadModal(false); return; }
            message.success("Habitación actualizada correctamente",1,()=>{
                setLoadModal(false);
                setShowModal(0);
            });
        });
    }

    return(<>
        <Modal
        title={(showModal == 1 ? "Añadir":"Editar") + " Cubículo"}
        open={showModal != 0}
        onCancel={()=>{loadModal ? null : setShowModal(0)}}
        onOk={()=>{showModal == 1 ? AddCubic() : UpdateCubic()}}
        confirmLoading={loadModal}
        >
            <Form
            onFinish={()=>{showModal == 1 ? AddCubic() : UpdateCubic()}}
            onFinishFailed={(e)=>{form.scrollToField(e.errorFields[0].name)}} 
            form={form} 
            size='Default' 
            style={{maxWidth:"600px",width:"100%"}}>
                <Form.Item
                label="Nombre del Cubículo"
                name="nombreHabitacion"
                rules={[
                    { required: true, message: 'El nombre del cubículo es requerido' },
                    { min: 3, message: 'El nombre del cubículo debe tener al menos 3 caracteres' },
                ]}
                >
                    <Input
                    type="text"
                    placeholder="Nombre del cubículo"/>
                </Form.Item>
            </Form>
        </Modal>

        <PageList
          title="Cubículos"
          varsToFetch={(search) => varsToFetch(search)}
          adapter={adapter}
          itemsMenu={itemsMenu}
          onClickItemMenu={onClickItemMenu}
          renderItem={(item,index,onclick,onLongPress,selectionMode) => (
      
            <TerapeutaItem
            key={index}
            item={item}
            onClick={(item) => onclick(item,index,onClickItem)}
            onLongPress={(item) => onLongPress(item,index)}
            selectionMode={selectionMode}
            />
          )}
          tools={tools}
          pickerSettings={props}
        />
    </>)
}