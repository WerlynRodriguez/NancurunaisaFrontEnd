import { Button, Collapse, Divider, Form, Input, Layout, List, Menu, message, Space, Table, Typography } from "antd";
import { EditOutlined, EyeFilled, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import React, {useState,useEffect} from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ActionsProviders, getaction } from "../../../Utils/ActionsProviders";
import { BlockRead, ButtonSubmit, FormAvName, FormPageHeader, sectionStyle } from "../../../Utils/TextUtils";
//import { BottomSheet } from "react-spring-bottom-sheet";
import ItemView from "../../../Components/Items/TerapeutaItem";
import { ChangeStatus, Create, getById, Update } from "../../../Utils/FetchingInfo";
import { Sucursal } from "../../../Models/Models";
import "../../../Utils/TextUtils.css";
import Cubiculos from "../Cubiculos/Cubiculos";

const { TextArea } = Input;
const {Title} = Typography;
const {Panel} = Collapse;

export default function SucurDetail(){
    let Navigate = useNavigate();
    const local = useLocation();/* What is my url */
    const ActionsProvider = new ActionsProviders(getaction(local.pathname,4));/*Actions crud*/
    const {idSU} = useParams(); /* Params react Router fron now what is the id to want a action */

    const [Loading,setLoading] = useState(idSU==null? false:true);/*Fetching terapeuta info */
    const [isLoading,setloading]= useState(false);/*For Add teratas */
    const [form] = Form.useForm();

    const [Sucur,setSucursal] = useState(new Sucursal(null));
    const [showCubic,setShowCubic] = useState(false);

    /* * * * * * * * * * * * * * * * * * *  */
    /*This Functions are Only in Action UPDATE */
    /* * * * * * * * * * * * * * * * * * *  */
    useEffect(() => {
        if (ActionsProvider.isAdd) return;
        SucurGet()
    },[])
        
    const SucurGet = () =>{
        setLoading(true);
        const items = `idSucursal
        nombreSucursal
        direccion
        activo
        habitacion {
          idHabitacion
          idSucursal
          nombreHabitacion
          activo
        }`;

        getById("sucursales","idSucursal",idSU,items).then((res) => {
            if (res == "errors")  return; 

            const suc = new Sucursal(res.data.sucursales.items[0]);
            setSucursal(suc);
            form.setFieldsValue({
                nombreSucursal: suc.nombreSucursal,
                direccion: suc.direccion,
            });
            setLoading(false);
            setloading(false);
        })

    }

    const onFinish=()=>{
        setloading(true);
        if (ActionsProvider.isAdd) {
            SucurAdd();
        }else{
            SucurUpdate();
        }
    }

    const SucurAdd = () => {
        const vars = Sucur.toString(form.getFieldsValue());

        Create("Sucursal","sucursalInput",vars,"idSucursal").then((res) => {
            if (res == "errors") { setloading(false); return; }
            message.success("Sucursal Creada",2,
            () => { Navigate("/Personal/Clinica/Sucursals");});
        })
    }

    const SucurUpdate = () => {
        const vars = Sucur.toString(form.getFieldsValue());

        Update("Sucursal","sucursalInput",vars,"idSucursal").then((res) => {
            if (res == "errors") { setloading(false); return; }

            message.success("Sucursal actualizada",2,() => {
                SucurGet();
            })
        })
    }

    const ChangeST = () => {
        setloading(true);
        ChangeStatus("Sucursal","idSucursales",idSU,"activo",Sucur.activo,"idSucursal").then((response) => {
            if (response == "errors") { setloading(false); return; }

            message.success("Sucursal Actualizada",1,() => {
                setloading(false);
                SucurGet();
            });
        });
    }

    const userMenu = [
        {key:"item1",label:(Sucur.activo?"Deshabilitar":"Habilitar"),
        onClick:() => { ChangeST(); }},
    ];

    if (showCubic)
    return(
        <Cubiculos 
        idSU={idSU} 
        onBack={() => {setShowCubic(false)}}/>
    )

    return (<>
        <FormPageHeader 
        ActionProv={ActionsProvider} 
        Text="Sucursal" 
        menu={userMenu}/>
        
        <div 
        className='BackImageCollapsible' 
        style={{display:ActionsProvider.isAdd? "none":""}}/>

        <FormAvName 
        ActionProv={ActionsProvider} 
        Activo={Sucur.activo}
        Loading={Loading} 
        Avatar={""} 
        Text={Sucur.nombreSucursal}/>

        <Layout 
        className='ContentLayout' 
        style={{display:Loading ? "None":""}}>

            <Form 
            onFinish={()=>{onFinish()}} 
            onFinishFailed={(e)=>{form.scrollToField(e.errorFields[0].name)}} 
            form={form} 
            size='Default' 
            style={{marginTop:"25px",maxWidth:"600px",width:"100%"}}>

                <div style={sectionStyle}>
                    <Title level={4}>Descripción</Title>

                    <Form.Item 
                    name="nombreSucursal" 
                    label="Nombre:" rules={[
                        {required:true,message:"¡Introduzca el Nombre!"},
                        {min:4,message:"¡El nombre debe tener al menos 4 caracteres!"}
                    ]}>
                        <Input 
                        type="text" 
                        maxLength={30} 
                        placeholder='Nombre'/>
                    </Form.Item>

                    <Divider/>
                    <Form.Item 
                    name="direccion" 
                    label="Dirección:" 
                    rules={[
                        {required:true,message:"¡Introduzca la Dirección!"},
                        {min:10,message:"¡La dirección debe tener al menos 10 caracteres!"}
                    ]}>
                        <TextArea 
                        rows={4} 
                        maxLength={230} 
                        placeholder="Dirección"/>
                    </Form.Item>
                </div>

                <div style={sectionStyle}>
                    <Title level={4}>Habitaciones</Title>
                    <Button
                    type="primary"
                    shape="round"
                    icon={<EyeFilled />}
                    loading={isLoading}
                    size='large'
                    style={{marginBottom:"10px"}}
                    onClick={() => {setShowCubic(true)}}>
                        Ver Habitaciones
                    </Button>
                </div>
                
                <ButtonSubmit 
                ActionProv={ActionsProvider} 
                isLoading={isLoading}/>
            </Form>
        </Layout>
    </>)
}