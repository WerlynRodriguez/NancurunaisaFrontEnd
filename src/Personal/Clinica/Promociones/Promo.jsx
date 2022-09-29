import { Button, Divider, Form, Input, Layout,Menu,message,Typography } from "antd";
import { BlockRead, ButtonSubmit, FormAvName, FormPageHeader, sectionStyle } from "../../../Utils/TextUtils";
import React, {useState,useEffect} from 'react';
import { Promocion } from "../../../Models/Models";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getaction, TerataFormActionProvider } from "../../../Utils/ActionsProviders";
import { CreatePromo, GetByIdPromo, GetbyPagPromos, UpdatePromo } from "../../../Utils/FetchingInfo";
const { Title } = Typography;

export default function Promo() {
    let Navigate = useNavigate();
    const local = useLocation();/* What is my url */
    const ActionsProvider = new TerataFormActionProvider(getaction(local.pathname));/*Actions crud*/
    const {idP} = useParams(); /* Params react Router fron now what is the id to want a action */

    const [Loading,setLoading] = useState(idP==null? false:true);/*Fetching terapeuta info */
    const [isLoading,setloading]= useState(false);/*For Add teratas */
    const [form] = Form.useForm();

    const [Promo,setPromo] = useState([]);/* All terapeuta info after fetching */
    /* * * * * * * * * * * * * * * * * * *  */
    /*This Functions are Only in Action UPDATE */
    /* * * * * * * * * * * * * * * * * * *  */
    if (!ActionsProvider.isAdd) {
        useEffect(() => {PromoGet(idP)},[])
    }
    const PromoGet = () =>{
        setLoading(true);
        GetByIdPromo(idP).then((result)=>{
            setPromo(result);
            setLoading(false);
            form.resetFields();
        }).catch((error)=>{
            message.error("Hubo un error",2);
            setloading(false);
            Navigate(-1);
        });
    }

    const onFinish =() =>{
        setloading(true);
        if (ActionsProvider.isAdd) {
            var data ={
                "nombrePromocion": form.getFieldValue("Nombre"),
                "descripcion": form.getFieldValue("Desc"),
                "activo": true,
                "idCita":[]
            }
            CreatePromo(data).then((result)=>{
                message.success("Promocion creada",2);
                setloading(false);
                Navigate(-1);
            }).catch((error)=>{
                message.error("Hubo un error",2);
                setloading(false);
            });
        }else{
            var data = {
                "idPromocion": idP,
                "nombrePromocion": form.getFieldValue("Nombre"),
                "descripcion": form.getFieldValue("Desc"),
                "activo": true,
                "idCita":[]
            }
            UpdatePromo(idP,data).then((result)=>{
                message.success("Promocion actualizada",2);
                setloading(false);
                Navigate(-1);
            }).catch((error)=>{
                message.error("Hubo un error",2);
                setloading(false);
            });
        }
    }

    const userMenu = (
        <Menu style={{width:"200px",padding:"0px"}}>
            <Menu.Item key="1" >
            <Button  onClick={()=>{}} 
            style={{width:"100%",color:"red"}}>Eliminar</Button>
            </Menu.Item>
        </Menu>
    );

    return (<div>
        <BlockRead Show={ActionsProvider.isRead}/>
        <FormPageHeader ActionProv={ActionsProvider} Text="Promocion" menu={userMenu}/>
        <div className='BackImageCollapsible' style={{display:ActionsProvider.isAdd? "none":""}}/>
        <FormAvName ActionProv={ActionsProvider} Loading={Loading} Avatar={""} Text={Promo.nombrePromocion}/>

        <Layout className='ContentLayout' style={{display:Loading ? "None":""}}>
        <Form onFinish={()=>{onFinish()}} onFinishFailed={(e)=>{form.scrollToField(e.errorFields[0].name)}} 
            initialValues={{Nombre:Promo.nombrePromocion,Desc:Promo.descripcion}} 
            form={form} size='Default' style={{marginTop:"25px",maxWidth:"600px",width:"100%"}}>
                
                <div style={sectionStyle}>
                    <Title level={4}>Descripción</Title>
                    <Form.Item name="Nombre" label="Nombre:" rules={[{
                        required:true,message:"¡Introduzca el Nombre!"}]}>
                        <Input type="text" maxLength={30} placeholder='Nombre'/>
                    </Form.Item>
                    <Divider/>
                    <Form.Item name="Desc" label="Descripcion:" rules={[{
                        required:true,message:"¡Introduzca una descripción!"}]}>
                        <Input.TextArea type="text" maxLength={100} placeholder='Descripción'/>
                    </Form.Item>
                </div>
                <ButtonSubmit ActionProv={ActionsProvider} isLoading={isLoading}/>
            </Form>
        </Layout>
    </div>);
}