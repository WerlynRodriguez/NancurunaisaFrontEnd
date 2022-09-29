import { Button, Collapse, Divider, Input, Layout, List, Menu, message, Radio, Skeleton, Space, Tabs, Typography } from "antd";
import './CitaDetail.css';
import React, {useState,useEffect} from 'react';
import { useLocation, useNavigate, useParams} from "react-router-dom";
import { FormActions, TerataFormActionProvider } from "../../Utils/ActionsProviders";
import { CarFilled, EditOutlined, EnvironmentFilled, LayoutFilled, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import MiniPicker from "../../Components/Picker/miniPicker";
import TeraTaItem from "../../Components/Items/TerapeutaItem";

import Pacientes from "../Clinica/Pacientes/Pacientes";
import Terapias from "../Clinica/Terapia/Terapias";
import Promos from "../Clinica/Promociones/Promos";
import Terapeutas from "../Clinica/TeraTa/Terapeutas";

import { BlockRead, ButtonSubmit, FormPageHeader, getFirstWord } from "../../Utils/TextUtils";
import { BottomSheet } from 'react-spring-bottom-sheet';
import 'react-spring-bottom-sheet/dist/style.css';
import {Habitacion, Paciente, Promocion, Sucursal, Terapeuta, Terapia} from "../../Models/Models";
import moment from 'moment';
import { AllowFunction, DenyFunction, Ranges } from "../../Utils/RangeProviders";
import Sucursales from "../Clinica/Sucursal/Sucursales";
import Cubiculos from "../Clinica/Sucursal/Cubiculos";
import FacturaDet from "../Clinica/Facturas/Factura";
import { AddPacsCita, CreateCita, GetByIdCita } from "../../Utils/FetchingInfo";

function getaction(url){
    const action = url.split("/");
    return action[3];
}

export default function CitaDetail(){
    let Navigate = useNavigate();
    const local = useLocation();/* What is my url */
    const ActionsProvider = new TerataFormActionProvider(getaction(local.pathname));/*Actions crud*/
    const {idCita} = useParams();
    const [isLoading,setloading]= useState(false);/*For Add teratas */
    
    const [showSheet,setShowSheet] = useState(false);//showBottomSheetLayout
    const [Picker,setPicker] = useState("0");;//0:Pacientes, 1:Terapias, 2:Terapeutas

    const [gettingCita, setGettingCita] = useState(idCita==null? false:true);//is fetching specific cita

    const today = moment().format('YYYY-MM-DD');
    const [date, setDate] = useState(today);//date of cita
    const [time, setTime] = useState(moment().format('HH:mm'));//time of cita
    const [hasFactura,setHasFactura] = useState(false);//has factura

    const [SucDom, setSucDom] = useState("0");//is sucursal or domicilio

    const [Pacs, setPacs] = useState([]);//Pacientes
    const [Teras, setTeras] = useState([]);//Terapias
    const [PromoS, setPromos] = useState([]);//Promociones
    const [TeraTas, setTeraTas] = useState([]);//Terapeutas
    const [Sucur, setSucur] = useState([]);//Sucursal
    const [Cub,setCub] = useState([]);//Cubiculo
    const [Direccion,setDireccion] = useState([]);//Direccion

    const grid = { gutter: 16, xs: 1, sm: 1, md: 2,lg: 2,xl: 3,xxl: 3 }

    if (!ActionsProvider.isAdd) {
        useEffect(() => {CitaGet(idCita);},[])
    }

    const CitaGet = (id) =>{
        setGettingCita(true);
        GetByIdCita(id).then((res) => {
            setHasFactura(res[0].pendiente?false:true);

            setDate(moment(res[0].fechaHora).format('YYYY-MM-DD'));
            setTime(moment(res[0].fechaHora).format('HH:mm'));
            
            let data = []
            res[0].pacienteCita.map((item)=>{
                data.push(new Paciente(item.idPaciente,item.nombres,item.apellidos,"F",12,"","","","","",false));
            });
            setPacs(data);

            setPromos(res[0].idPromocion);
            data=[];

            res[0].idTerapia.map((item)=>{
                data.push(new Terapia(item.idTerapia,item.nombreTerapia,"","","",false));
            });
            setTeras(data);
            data=[];

            res[0].idMasajista.map((item)=>{
                data.push(new Terapeuta(item.idMasajista,item.nombres,item.apellidos,"","","","","","","",false));
            });
            setTeraTas(data);

            const isDomc = res[0].idHabitacion==null?true:false;
            setSucDom(isDomc==true?"1":"0");

            if(isDomc){
                setDireccion(res[0].direccion_domicilio);
            }else{
                setSucur(new Sucursal(0,res[0].idHabitacionNavigation.idSucursalNavigation.nombreSucursal,"",false))
                setCub(new Habitacion(0,0,res[0].idHabitacionNavigation.nombreHabitacion,false));
            }

            setGettingCita(false);
        }).catch(err => {
            message.error("Error al obtener la cita",2);
            setGettingCita(false);
        });

            
    }

    const getPicker=()=>{
        switch (Picker) {
            case 0: return <Pacientes multi={true} data={Pacs} onBack={()=>{setShowSheet(false)}} 
                            onFinish={(value)=>{setPacs(value);setShowSheet(false)}}/>

            case 1: return <Terapias multi={true} data={Teras} onBack={()=>{setShowSheet(false)}} 
                            onFinish={(value)=>{setTeras(value);setShowSheet(false)}}/>

            case 2: return <Terapeutas multi={true} data={TeraTas} onBack={()=>{setShowSheet(false)}}
                            onFinish={(value)=>{setTeraTas(value);setShowSheet(false)}}/>

            case 3: return <Promos multi={true} data={PromoS} onBack={()=>{setShowSheet(false)}}
                            onFinish={(value)=>{setPromos(value);setShowSheet(false)}}/>

            case 4: return <Sucursales picker={true} onBack={()=>{setShowSheet(false)}} onFinish={(value)=>{setSucur(value);setCub([]);setShowSheet(false)}}/>

            case 5: return <Cubiculos idSuc={Sucur.idSucursal} picker={true} onBack={()=>{setShowSheet(false)}} onFinish={(value)=>{setCub(value);setShowSheet(false)}}/>

            case 6: return <FacturaDet action={FormActions.Add} idCita={0} onBack={()=>{setShowSheet(false)}}/>

            case 7: return <FacturaDet action={FormActions.Update} idFactura={1} onBack={()=>{setShowSheet(false)}}/>
            default:
                return <div> MAMA? </div>
        }
    }

    const onFinish = () => {
        if (Pacs.length==0) {
            message.error("Debe seleccionar al menos un paciente",2);return;
        }else if (Teras.length==0) {
            message.error("Debe seleccionar al menos una terapia",2);return;
        }else if (TeraTas.length==0) {
            message.error("Debe seleccionar al menos un terapeuta",2);return;
        }else if (SucDom == 0){
            if (Sucur.idSucursal == null) {
                message.error("Debe seleccionar una sucursal",2);return;
            }else if (Cub.idHabitacion == null) {
                message.error("Debe seleccionar un cubiculo",2);return;
            }
        }else if(Direccion.length <= 5){
            message.error("Debe ingresar una direccion válida",2);return;
        }
        setloading(true);
        if (ActionsProvider.isAdd) {
            let data = {
                idHabitacion:SucDom==0?null:Cub.idHabitacion,
                fechaHora: moment(`${date} ${time}`).format('YYYY-MM-DD HH:mm:ss'),
                direccion_domicilio:SucDom==0? null:Direccion,
                color:"#000000",
                idMasajista:TeraTas.map((item)=>{return item.idMasajista}),
                idTerapia:Teras.map((item)=>{return item.idTerapia}),
                idPromocion:PromoS.map((item)=>{return item.idPromocion})
            }
            CreateCita(data).then((res) => {
                Pacs.map((item)=>{
                    let data2 = {
                        idCita:res.idCita,
                        idPaciente:item.idPaciente,
                        idCitaNavigation: null,
                        idPacienteNavigation: null,
                        amnanesisInfo: null
                    }
                    AddPacsCita(data2).then((res) => {
                      message.success("Paciente añadido correctamente",2);
                        setloading(false); 
                    }).catch(err => {
                        message.error("Error al añadir Pacientes",2);
                        setloading(false); 
                    });
                });
                
            }).catch(err => {
                message.error("Error al crear la cita",2);
                setloading(false);
            });
        }else{
            
        }
    }

    const userMenu = (
        <Menu style={{width:"200px",padding:"0px"}}>
            <Menu.Item key="0" onClick={()=>{setPicker(6);setShowSheet(true)}} 
            style={{display:DenyFunction([Ranges.Manager]) && !hasFactura?"":"none"}}>Facturar</Menu.Item>
            <Menu.Item key="1" onClick={()=>{setPicker(7);setShowSheet(true)}}
            style={{display:DenyFunction([Ranges.Manager]) && hasFactura?"":"none"}}>Ver Factura</Menu.Item>
            <Menu.Item key="2" style={{display:DenyFunction([Ranges.Manager])?"":"none"}}>
            <Button  onClick={()=>{}} 
            style={{width:"100%",color:"red"}}>Eliminar</Button>
            </Menu.Item>
        </Menu>
    );

    return (<div>
    <BlockRead Show={ActionsProvider.isRead}/>
    <FormPageHeader ActionProv={ActionsProvider} Text="Cita" menu={userMenu} normal={showSheet}/>
    <div className='BackImageCollapsible' style={{display:ActionsProvider.isAdd? "none":""}}/>
    <BottomSheet snapPoints={({ minHeight, maxHeight }) => [300, 650]} open={showSheet} onDismiss={()=>{setShowSheet(false)}}>
        {getPicker()}
    </BottomSheet>
    
    <Layout className='ContentLayout'>
    <Skeleton style={{display:gettingCita?"":"none"}} loading active/>
    <div style={{width:"100%",maxWidth:"800px",paddingTop:"15px",
    display:gettingCita?"none":"flex",flexDirection:"column",paddingLeft:"10px",paddingRight:"10px",paddingBottom:"10px",
    borderRadius:"25px",textAlign:"center",backgroundColor:"#212121",boxShadow:"0 5px 15px rgba(14,21,37,0.8)"}}>
        <input style={{width:"100%",backgroundColor:"#212121",color:"white",borderWidth:"0",fontSize:"50px"}}
        type="time" value={time} onChange={(e)=>{setTime(e.target.value)}}/>
        <input style={{width:"100%",backgroundColor:"#212121",color:"white",borderWidth:"0",fontSize:"25px"}}
        type="date" value={date} onChange={(e)=>{setDate(e.target.value?e.target.value:today)}}/>
    </div>
    <div style={{marginTop:"20px",width:"100%",maxWidth:"800px",display:gettingCita?"none":""}}>
        <Collapse accordion>
            <Collapse.Panel header="Pacientes" key="1">
                <List style={{backgroundColor:"whiteSmoke",paddingTop:"10px",paddingBottom:"10px"}}
                    dataSource={Pacs} grid={grid} renderItem={(pacS) => (
                        <TeraTaItem id={pacS.idPaciente} avatar={""} text={pacS.getShortName}/>
                )}/>
                <Button type="primary" shape="round" icon={<PlusOutlined/>} style={{width:"100%"}} 
                onClick={()=>{setPicker(0); setShowSheet(true)}}>
                    Pacientes
                </Button>
            </Collapse.Panel>
            <Collapse.Panel header="Terapias" key="2">
                <List style={{backgroundColor:"whiteSmoke",paddingTop:"10px",paddingBottom:"10px"}}
                    dataSource={Teras} grid={grid} renderItem={(Tera) => (
                        <TeraTaItem id={Tera.idTerapia} avatar={""} text={Tera.nombreTerapia} onClick={(id)=>{}}/>
                )}/>
                <Button type="primary" shape="round" icon={<PlusOutlined/>} style={{width:"100%"}} 
                onClick={()=>{setPicker(1); setShowSheet(true)}}>
                    Terapias
                </Button>
            </Collapse.Panel>
            <Collapse.Panel header="Terapeutas" key="3">
                <List style={{backgroundColor:"whiteSmoke",paddingTop:"10px",paddingBottom:"10px"}}
                    dataSource={TeraTas} grid={grid} renderItem={(Terata) => (
                        <TeraTaItem id={Terata.dMasajista} avatar={""} text={getFirstWord(Terata.nombres)+" "+getFirstWord(Terata.apellidos)} onClick={(id)=>{}}/>
                )}/>
                <Button type="primary" shape="round" icon={<PlusOutlined/>} style={{width:"100%"}} 
                onClick={()=>{setPicker(2); setShowSheet(true)}}>
                    Terapeutas
                </Button>
            </Collapse.Panel>
            <Collapse.Panel header="Promociones" key="4">
                <List style={{backgroundColor:"whiteSmoke",paddingTop:"10px",paddingBottom:"10px"}}
                    dataSource={PromoS} grid={grid} renderItem={(Promo) => (
                        <TeraTaItem id={Promo.idPromocion} avatar={""} text={Promo.nombrePromocion} onClick={(id)=>{}}/>
                )}/>
                <Button type="primary" shape="round" icon={<PlusOutlined/>} style={{width:"100%"}} 
                onClick={()=>{setPicker(3);setShowSheet(true)}}>
                    Promociones
                </Button>
            </Collapse.Panel>
        </Collapse>

        <Tabs activeKey={SucDom} onChange={(activeKey)=>{setSucDom(activeKey)}}>
            <Tabs.TabPane tab={<span><EnvironmentFilled/> Sucursal </span>} key="0"><Space>
                <MiniPicker visible={true} title={Sucur.nombreSucursal} icon={<EnvironmentFilled style={{fontSize:"50px",color:"white"}}/>} 
                button="Cambiar Sucursal" onClick={()=>{setPicker(4);setShowSheet(true)}}/>
                <MiniPicker visible={Sucur.idSucursal!=null? true:false} title={Cub.nombreHabitacion} icon={<LayoutFilled style={{fontSize:"50px",color:"white"}}/>} 
                button="Cambiar Cubículo" onClick={()=>{setPicker(5);setShowSheet(true)}}/>
            </Space></Tabs.TabPane>
            <Tabs.TabPane tab={<span><CarFilled/> Domicilio</span>} key="1">
                <Input.TextArea value={Direccion} onChange={(e)=>{setDireccion(e.target.value)}} maxLength={100} rows={4} placeholder="Direccion"></Input.TextArea>
            </Tabs.TabPane>
        </Tabs>
        <Button icon={ActionsProvider.isUpdt?<EditOutlined/>:<PlusOutlined/>} type='primary' 
        style={{width:"100%",marginTop:"20px"}} size='large' loading={isLoading} shape='round' onClick={()=>{onFinish()}}>
        {ActionsProvider.isUpdt? "Actualizar":"Añadir"}</Button>
        <Divider/>
    </div>
    </Layout>
    </div>)
}