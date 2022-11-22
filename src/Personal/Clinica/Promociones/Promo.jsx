import { Button, Divider, Form, Input, Layout,Menu,message,Typography } from "antd";
import { BlockRead, ButtonSubmit, FormAvName, FormPageHeader, sectionStyle } from "../../../Utils/TextUtils";
import React, {useState,useEffect} from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getaction, ActionsProviders } from "../../../Utils/ActionsProviders";
import { ChangeStatus, Create, getById, Update } from "../../../Utils/FetchingInfo";
import { Promocion } from "../../../Models/Models";
import "../../../Utils/TextUtils.css";
const { Title } = Typography;

export default function Promo() {
    let Navigate = useNavigate();
    const local = useLocation();/* What is my url */
    const ActionsProvider = new ActionsProviders(getaction(local.pathname,4));/*Actions crud*/
    const {idPR} = useParams(); /* Params react Router fron now what is the id to want a action */

    const [Loading,setLoading] = useState(idPR==null? false:true);/*Fetching terapeuta info */
    const [isLoading,setloading]= useState(false);/*For Add teratas */
    const [form] = Form.useForm();

    const [Promo,setPromo] = useState(new Promocion(null));/*Promo info */
    /* * * * * * * * * * * * * * * * * * *  */
    /*This Functions are Only in Action UPDATE */
    /* * * * * * * * * * * * * * * * * * *  */
    useEffect(() => {
        if (ActionsProvider.isAdd) return;
        PromoGet();
    },[]);

    //=============================================
    // Get promocion
    //=============================================
    const PromoGet = () =>{
        setLoading(true);
        const items = 
        `idPromocion
        nombrePromocion
        descripcion
        activo`;

        getById("promocion","idPromocion",idPR,items).then((response) => {
            if (response == "errors") return;

            let promo = new Promocion(response.data.promocion.items[0]);
            setPromo(new Promocion(promo));

            form.setFieldsValue({
                nombrePromocion:promo.nombrePromocion,
                descripcion:promo.descripcion,
            });
            setLoading(false);
        });

    }

    const onFinish =() =>{
        setloading(true);
        if (ActionsProvider.isAdd) {
            PromoAdd();
        } else {
            PromoUpdate();
        }
    }

    const PromoAdd = () => {
        const vars = Promo.toString(form.getFieldsValue());

        Create("Promocion","promocionInput",vars,"idPromocion").then((response) => {
            if (response == "errors") { setLoading(false); return; }

            message.success("Promocion agregada",1,() => {
                Navigate("/Personal/Clinica/Promos");
            });
        });
    }

    const PromoUpdate = () => {
        const vars = Promo.toString(form.getFieldsValue());

        Update("Promocion","promocionInput",vars,"idPromocion").then((response) => {
            if (response == "errors") { setloading(false); return; }

            message.success("Promocion Actualizada",1,() => {
                Navigate("/Personal/Clinica/Promos");
            });
        });
    }

    //======================================================================
    //This is the menu will be displayed in the header when the action is Read or Update
    //======================================================================
    const userMenu = [
        {key:"item1",label:(Promo.activo?"Deshabilitar":"Habilitar"),
        onClick:() => { ChangeST(); }},
    ];

    const ChangeST = () => {
        setloading(true);
        ChangeStatus("Promocion","idPromociones",idPR,"activo",Promo.activo,"idPromocion").then((response) => {
            if (response == "errors") { setloading(false); return; }

            message.success("Promocion Actualizada",1,() => {
                setloading(false);
                PromoGet();
            });
        });
    }

    return (<div>
        <FormPageHeader 
        ActionProv={ActionsProvider} 
        Text="Promoción" 
        menu={userMenu}/>

        <div 
        className='BackImageCollapsible' 
        style={{display:ActionsProvider.isAdd? "none":""}}/>

        <FormAvName 
        ActionProv={ActionsProvider} 
        Loading={Loading} 
        Activo={Promo.activo}
        Avatar={""} 
        Text={Promo.nombrePromocion}/>

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
                name="nombrePromocion" 
                label="Nombre:" 
                rules={[
                    {required:true,message:"¡Introduzca el Nombre!"},
                    {min:4,message:"¡El nombre debe tener al menos 4 caracteres!"}
                ]}>

                    <Input 
                    type="text" 
                    maxLength={100}
                    placeholder='Nombre'/>
                </Form.Item>

                <Divider/>
                <Form.Item 
                name="descripcion" 
                label="Descripcion:" 
                rules={[{required:true,message:"¡Introduzca una descripción!"}]}>

                    <Input.TextArea 
                    type="text"
                    maxLength={100} 
                    placeholder='Descripción'/>
                </Form.Item>
            </div>

                <ButtonSubmit ActionProv={ActionsProvider} isLoading={isLoading}/>
            </Form>
        </Layout>
    </div>);
}