import {PageHeader,Typography, Layout, Form, message, Menu, Button, InputNumber, Input, Divider, Space} from 'antd';
import { useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import "../../../Utils/TextUtils.css";
import { getaction, ActionsProviders } from '../../../Utils/ActionsProviders';
import { BlockRead, ButtonSubmit, FormAvName, FormPageHeader, sectionStyle } from '../../../Utils/TextUtils';
import { NIOConvUSD, RateUSDNIO, USDConvNIO } from '../../../Utils/Calwulator';
import { Terapia } from '../../../Models/Models';
import { ChangeStatus, Create, getById, Update } from '../../../Utils/FetchingInfo';
const { Title } = Typography;

export default function TeraDetail(){
    let Navigate = useNavigate();
    const local = useLocation();/* What is my url */
    const ActionsProvider = new ActionsProviders(getaction(local.pathname,4));/*Actions crud*/
    const {idTE} = useParams(); /* Params react Router fron now what is the id to want a action */

    const [Loading,setLoading] = useState(idTE==null? false:true);/*Fetching terapeuta info */
    const [isLoading,setloading]= useState(false);/*For Add teratas */
    const [form] = Form.useForm();

    const [Terap,setTerapia] = useState(new Terapia(null));
    //Conversiones de monedas Local y Domicilio
    const [convL,setConvL] = useState(0);
    const [convD,setConvD] = useState(0);

    /* * * * * * * * * * * * * * * * * * *  */
    /*This Functions are Only in Action UPDATE */
    /* * * * * * * * * * * * * * * * * * *  */
    useEffect(() => {
        if (ActionsProvider.isAdd) return; 
        TeraGet();
    },[])

        
    const TeraGet = () =>{
        setLoading(true);
        const items = `idTerapia
        nombreTerapia
        duracion
        precioDomicilio
        precioLocal
        activo
        `;

        getById("terapia","idTerapia",idTE,items).then((data)=>{
            if(data == "errors") return;
            
            let tera = new Terapia(data.data.terapia.items[0]);
            setTerapia(tera);
            form.setFieldsValue({
                nombreTerapia:tera.nombreTerapia,
                duracion:tera.duracion,
                precioDomicilio:tera.precioDomicilio,
                precioLocal:tera.precioLocal,
            });
            setConvL(USDConvNIO(tera.precioLocal));
            setConvD(USDConvNIO(tera.precioDomicilio));
            setLoading(false);
            setloading(false);
        })
    }

    const onFinish=()=>{
        setloading(true);
        if (ActionsProvider.isAdd) {
            AddTera();
        }else{
            UpdateTera();
        }
    }

    const AddTera = () => {
        setloading(true);
        const vars = Terap.toString(form.getFieldsValue());

        Create("Terapia","terapiaInput",vars,"idTerapia").then((data)=>{
            if(data == "errors") { setloading(false); return;}
            message.success("Terapia Creada",2,() => {
                Navigate("/Personal/Clinica/Terapias", { replace: true });
            });
        })
    }

    const UpdateTera = () => {
        setloading(true);
        const vars = Terap.toString(form.getFieldValue());

        Update("Terapia","terapiaInput",vars,"idTerapia",idTE).then((data)=>{
            if(data == "errors") { setloading(false); return;}
            message.success("Terapia Actualizada",2,
            () => {
                TeraGet();
            });
        })
    }

    const changeST = () => {
        setLoading(true);
        ChangeStatus("Terapia","idTerapias",idTE,"activo",Terap.activo,"idTerapia").then((data)=>{
            if(data == "errors") { setloading(false); return;}

            message.success("Terapia "+(Terap.activo?"Deshabilitada":"Habilitada"),2,() => {
                TeraGet();
            });
        })
    }

    const userMenu = [
        {key:"HabDes",label:(Terap.activo?"Deshabilitar":"Habilitar"),onClick:changeST},
    ]

    return(<div>

        <FormPageHeader 
        ActionProv={ActionsProvider} 
        Text="Terapia" 
        menu={userMenu}/>

        <div 
        className='BackImageCollapsible' 
        style={{display:ActionsProvider.isAdd? "none":""}}/>

        <FormAvName 
        ActionProv={ActionsProvider} 
        Loading={Loading} 
        Avatar={""} 
        Text={Terap.nombreTerapia}
        Activo={Terap.activo}/>

        <Layout 
        className='ContentLayout' 
        style={{display:Loading ? "None":""}}>

            <Form 
            disabled={ActionsProvider.isRead}
            onFinish={()=>{onFinish()}}
            onFinishFailed={(e)=>{form.scrollToField(e.errorFields[0].name)}}
            form={form} 
            size='Default' 
            style={{marginTop:"25px",maxWidth:"600px",width:"100%"}}>
                
                <div style={sectionStyle}>
                    <Title level={4}>Descripción</Title>
                    <Form.Item 
                    name="nombreTerapia" 
                    label="Nombre:" 
                    rules={[{required:true,message:"¡Introduzca el Nombre!"}]}>

                        <Input 
                        type="text" 
                        maxLength={30} 
                        placeholder='Nombre'/>

                    </Form.Item>
                </div>

                <div style={{float:"right",backgroundColor:"rgb(89,32,133)",borderRadius:"25px",padding:"5px",marginTop:"5px"}}>
                    <Typography.Text 
                    style={{color:"white"}}>
                        {"1$ = C$"+RateUSDNIO}
                    </Typography.Text>
                </div>
                <div style={sectionStyle}>
                    <Title level={4}>Detalles</Title>

                    <Form.Item name="duracion" label="Duracion:" rules={[{
                        required:true,message:"¡Introduzca la Duración!"}]}>
                        <InputNumber 
                        style={{width:"60%"}} 
                        type="number"
                        min={0}
                        max={240}
                        prefix="Minutos" 
                        placeholder='Duración'/>
                    </Form.Item>

                    <Form.Item
                    name="precioLocal"
                    label="Precio Local:"
                    // extra={"C$ "+USDConvNIO(Terap.precioLocal)}
                    extra={"C$ "+convL}
                    rules={[{required:true,message:"¡Introduzca el precio en el local!"}]}>
                        <InputNumber
                        style={{width:"60%"}}
                        type="number"
                        min={0}
                        max={100}
                        prefix="$"
                        placeholder='Precio'
                        onChange={(e) => {setConvL(USDConvNIO(e))}}/>
                    </Form.Item>
                    
                    <Form.Item
                    name="precioDomicilio"
                    label="Precio Domicilio:"
                    extra={"C$ "+convD}
                    rules={[{required:true,message:"¡Introduzca el precio en el domicilio!"}]}>
                        <InputNumber
                        style={{width:"60%"}}
                        type="number"
                        min={0}
                        max={100}
                        prefix="$"
                        placeholder='Precio'
                        onChange={(e) => {setConvD(USDConvNIO(e))}}/>
                    </Form.Item>
                                  
                </div>

                <ButtonSubmit ActionProv={ActionsProvider} isLoading={isLoading}/>
            </Form>
        </Layout>
    </div>)
}