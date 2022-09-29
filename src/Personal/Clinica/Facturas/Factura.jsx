import { TerataFormActionProvider } from "../../../Utils/ActionsProviders";
import { BlockRead, ButtonSubmit, FormPageHeader, sectionStyle } from "../../../Utils/TextUtils";
import React, {useState,useEffect} from 'react';
import { Factura } from "../../../Models/Models";
import { Button, Divider, Form, Input, InputNumber, Layout, Menu, message, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { CreateFact } from "../../../Utils/FetchingInfo";
const { Title } = Typography;

export default function FacturaDet (props) {
    let Navigate = useNavigate();
    const {idCita,idFactura,action} = props;
    const [isLoading,setloading]= useState(false);

    const [Loading,setLoading] = useState(idFactura==null? false:true);
    const ActionsProvider = new TerataFormActionProvider(action);/*Actions crud*/
    const [Factu,setFactu] = useState([]);/* All terapeuta info after fetching */

    const [form] = Form.useForm();

    if (!ActionsProvider.isAdd) {
        useEffect(() => {FactGet(idFactura)},[])
    }

    const FactGet = (idFactura) =>{
        setTimeout(() => {
            const Facttura = new Factura(idFactura,1,1000,1000,0);
            const data = new Factura(Facttura.idFactura,Facttura.idCita,Facttura.total,Facttura.descuento,Facttura.subtotal);
            setFactu(data);
            setLoading(false);
            form.resetFields();
        }, 1000);
    }

    const onBack = () => {
        if (typeof props.onBack === "function") {
            props.onBack();
        }
    }

    const onFinish = () => {
        setloading(true);
        if (ActionsProvider.isAdd) {
            let data = {
                idCita: idCita,
                descuento: form.getFieldValue("Des"),
                subTotal: form.getFieldValue("Sub"),
                total: form.getFieldValue("Total")
            }
            CreateFact(data).then(res => {
                message.success("Facturado",1).then(()=>{
                setloading(false);
                Navigate("/Personal/Citas",{replace:true});
                })
            }).catch(err => {
                message.error("Error al facturar",1);
                setloading(false);
            });
        }else{
            if (true){
                message.success("Factura Modificada",1).then(()=>{
                setloading(false);
                Navigate(-1);
                })
            }else{message.error("No se pudo Modificar la Factura",2);setloading(false);}
        }
    }

    const userMenu = (
        <Menu style={{width:"200px",padding:"0px"}}>
            <Menu.Item key="0" onClick={()=>{}} 
            style={{display:true?"":"none"}}>Generar PDF</Menu.Item>
            <Menu.Item key="2" style={{display:true?"":"none"}}>
            <Button  onClick={()=>{}} 
            style={{width:"100%",color:"red"}}>Eliminar</Button>
            </Menu.Item>
        </Menu>
    );

    return (<div>
        <BlockRead Show={ActionsProvider.isRead}/>
        <FormPageHeader ActionProv={ActionsProvider} Text="Factura" menu={userMenu} onBack={()=>{onBack()}}/>

        <Layout className='ContentLayout' style={{display:Loading ? "None":""}}>
            <Form onFinish={()=>{onFinish()}} onFinishFailed={(e)=>{form.scrollToField(e.errorFields[0].name)}} 
            initialValues={{Sub:Factu.subtotal,Des:Factu.descuento,Total:Factu.total}} 
            form={form} size='Default' style={{marginTop:"25px",maxWidth:"600px",width:"100%"}}>

                <div style={sectionStyle}>
                    <Title level={4}>Descripción</Title>
                    <Form.Item name="Sub" label="Sub total:" rules={[{
                        required:true,message:"¡Ingrese el subtotal!"}]}>
                        <InputNumber style={{width:"100%"}} type="number" maxLength={6} placeholder='Subtotal'/>
                    </Form.Item>
                    <Divider/>
                    <Form.Item name="Des" label="Descuento:">
                        <InputNumber style={{width:"100%"}} type="number" maxLength={6} placeholder='Descuento'/>
                    </Form.Item>
                    <Divider/>
                    <Form.Item name="Total" label="Total:" rules={[{
                        required:true,message:"¡Ingrese el Total!"}]}>
                        <InputNumber style={{width:"100%"}} type="number" maxLength={6} placeholder='Total'/>
                    </Form.Item>
                </div>
                <ButtonSubmit ActionProv={ActionsProvider} isLoading={isLoading}/>
            </Form>
        </Layout>

    </div>)
}