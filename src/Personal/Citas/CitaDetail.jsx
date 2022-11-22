import { Badge, Button, Collapse, Divider, Input, Layout, List, Menu, message, Radio, Segmented, Skeleton, Slider, Space, Tabs, Typography } from "antd";
import './CitaDetail.css';
import React, {useState,useEffect} from 'react';
import { useLocation, useNavigate, useParams} from "react-router-dom";
import { FormActions, ActionsProviders } from "../../Utils/ActionsProviders";
import { CaretRightOutlined, CarFilled, EditOutlined, EnvironmentFilled, LayoutFilled, PauseOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import TeraTaItem from "../../Components/Items/TerapeutaItem";

import Pacientes from "../Clinica/Pacientes/Pacientes";
import Terapias from "../Clinica/Terapia/Terapias";
import Promos from "../Clinica/Promociones/Promos";
import Terapeutas from "../Clinica/TeraTa/Terapeutas";
import Sucursales from "../Clinica/Sucursal/Sucursales";
import Cubiculos from "../Clinica/Cubiculos/Cubiculos";
import FacturaDet from "../Clinica/Facturas/Factura";

import MiniPicker from "../../Components/Picker/miniPicker";
import { ButtonSubmit, FormPageHeader, getFirstWord } from "../../Utils/TextUtils";
import moment from 'moment';
import { ChangeStatusCita, Create, getByIdCita, Update } from "../../Utils/FetchingInfo";
import { Cita, Estados } from "../../Models/Models";

function getaction(url){
    const action = url.split("/");
    return action[3];
}

export default function CitaDetail(){
    let Navigate = useNavigate();
    const local = useLocation();/* What is my url */
    const ActionsProvider = new ActionsProviders(getaction(local.pathname));/*Actions crud*/
    const {idCita} = useParams();
    const [isLoading,setloading]= useState(false);/*For Add citas */
    
    //=======================================================================
    //-1: Nothing, 0: Paciente, 1: Terapia, 2: Promocion, 3: Terapeuta, 4: Sucursal, 5: Cubiculo
    const [Picker,setPicker] = useState(-1);
    const [ActualList,setActualList] = useState(0);

    const [gettingCita, setGettingCita] = useState(idCita ? true : false);
    const [cita, setCita] = useState(new Cita(null));//Cita

    const today = moment().format('YYYY-MM-DD');
    const [date, setDate] = useState(today);//date of cita
    const [time, setTime] = useState(moment().format('HH:mm'));//time of cita

    const [SucDom, setSucDom] = useState("0");//is sucursal or domicilio

    const [actionFactura, setActionFactura] = useState(FormActions.Read);

    const modules = [
        { label: "Pacientes", value: 0, lista: cita.idPaciente},
        { label: "Terapias", value: 1, lista: cita.idTerapia},
        { label: "Terapeutas", value: 2, lista: cita.idTerapeuta},
        { label: "Promociones", value: 3, lista: cita.idPromocion}
    ]

    const grid = { gutter: 16, xs: 1, sm: 1, md: 2,lg: 2,xl: 3,xxl: 3 }

    useEffect(() => {
        if (ActionsProvider.isAdd) return;
        CitaGet();
    },[])

    const CitaGet = () => {
        setGettingCita(true);
        const items = `idCita
        fechaHora
        direccionDomicilio
        idEstado
        horaInicio
        horaFin
        idHabitacionNavigation {
          idHabitacion
          nombreHabitacion
          idSucursalNavigation{
            idSucursal
            nombreSucursal
          }
        }
        detalleHC {
          idDetalle
        }
        factura {
          idFactura
        }
        idPaciente {
          idPaciente
          nombres
          apellidos
        }
        idPromocion {
          idPromocion
          nombrePromocion
        }
        idTerapeuta {
          idTerapeuta
          idUsuarioNavigation{
            nombres
            apellidos
          }
        }
        idTerapia {
          idTerapia
          nombreTerapia
          duracion
        }`;

        getByIdCita(idCita,items).then((res) => {
            if (res == "errors") return;

            const auxCita = new Cita(res.data.citas[0]);

            if (!auxCita.idSucursal) setSucDom("1");
            setCita(auxCita);
            setDate(moment(auxCita.fechaHora).format('YYYY-MM-DD'));
            setTime(moment(auxCita.fechaHora).format('HH:mm'));

            setGettingCita(false);
            setloading(false);
        })            
    }

    const onFinish = () => {
        if (cita.idPaciente ? cita.idPaciente.length == 0 : true) 
            { message.error("No se ha seleccionado un paciente"); setActualList(0); return; }
        if (cita.idTerapia ? cita.idTerapia.length == 0 : true)
            { message.error("No se ha seleccionado una terapia"); setActualList(1); return; }
        if (cita.idTerapeuta ? cita.idTerapeuta.length == 0 : true)
            { message.error("No se ha seleccionado un terapeuta"); setActualList(2); return; }
        if (cita.idHabitacion ? !cita.idHabitacion.id : true){ 
            if (!cita.direccionDomicilio){
                message.error("¿Donde se hará la cita?"); 
                return;
            }
        }

        setloading(true);
        if (ActionsProvider.isAdd) {
            CitaAdd();
        }else{
            UpdateCita();
        }
    }

    const CitaAdd = () => {
        //Union date and time
        const vars = cita.toString(date, time);

        Create("Cita","citaInput",vars,"idCita").then((res) => {
            if (res == "errors") { setloading(false); return; }

            message.success("Cita creada", 2, () => {
                Navigate("/Personal/Citas");
            });
        })
    }

    const UpdateCita = () => {
        //Union date and time
        const vars = cita.toString(date, time);

        Update("Cita","citaInput",vars,"idCita").then((res) => {
            if (res == "errors") { setloading(false); return; }

            message.success("Cita actualizada", 1, () => {
                CitaGet();
            });
        })
    }

    const StartStopCita = (start) => {
        let vars;
        if (start) {
            vars = cita.toStringHoras(4);
        }else{
            vars = cita.toStringHoras(3);
        }

        Update("Cita","citaInput",vars,"idCita").then((res) => {
            if (res == "errors") { setloading(false); return; }

            message.success("Cita actualizada", 1, () => {
                CitaGet();
            });
        })
    }

    const ChangeSt = (idEstado,onFinish) => {
        setloading(true);
        ChangeStatusCita("DeCita","idCita",idCita,"estado",idEstado,"idCita").then((response) => {
            if (response == "errors") { setloading(false); return; }

            if (typeof onFinish == "function") onFinish();
            else
            message.success("Cita actualizada",1,() => {
                CitaGet();
            });
        });
    }

    const showPlay = () => {
        if (gettingCita || isLoading) return false;
        if (!(cita.idEstado == 2 || cita.idEstado == 4)) return false;
        let today = moment();
        let citaDate = moment(cita.fechaHora);
        let diff = citaDate.diff(today, 'minutes');

        if (diff > -60 && diff < 60)
            return true;
        else
            return false;
    }

    const userMenu = [];
    if (cita.idEstado == 2)
        userMenu.push({key:"item1",label:"Cancelar cita",
                    onClick:() => {ChangeSt(6)}});
    if (cita.idEstado == 3)
        userMenu.push({key:"item2",label:"Facturar",
                    onClick:() => {
                        setActionFactura(FormActions.Add);
                        setPicker(6);
                    }});
    if (cita.idEstado == 5)
        userMenu.push({key:"item3",label:"Ver factura",
                    onClick:() => {
                        setActionFactura(FormActions.Read);
                        setPicker(6);
                    }});

    // When a picker is selected
    if (Picker != -1) 
        switch (Picker) {
            case 0: 
                return <Pacientes 
                        picker 
                        multi
                        dataPicked={cita.idPaciente}
                        onBack={()=>{setPicker(-1)}}
                        onFinish={(value)=>{cita.idPaciente = value; setPicker(-1);}}/>
            case 1:
                return <Terapias
                        picker
                        multi
                        dataPicked={cita.idTerapia}
                        onBack={()=>{setPicker(-1)}}
                        onFinish={(value)=>{cita.idTerapia = value; setPicker(-1);}}/>
            case 2:
                return <Terapeutas
                        picker
                        multi
                        dataPicked={cita.idTerapeuta}
                        onBack={()=>{setPicker(-1)}}
                        onFinish={(value)=>{cita.idTerapeuta = value; setPicker(-1);}}/>
            case 3:
                return <Promos
                        picker
                        multi
                        dataPicked={cita.idPromocion}
                        onBack={()=>{setPicker(-1)}}
                        onFinish={(value)=>{cita.idPromocion = value; setPicker(-1);}}/>
            case 4:
                return <Sucursales
                        picker
                        onBack={()=>{setPicker(-1)}}
                        onFinish={(value)=>{cita.idSucursal = value; setPicker(-1);}}/>
            case 5:
                return <Cubiculos
                        picker
                        idSU={cita.idSucursal.id}
                        onBack={()=>{setPicker(-1)}}
                        onFinish={(value)=>{cita.idHabitacion = value; setPicker(-1);}}/>
            default:
                return <FacturaDet
                        action={actionFactura}
                        onBack={() => {setPicker(-1)}}
                        idCita={idCita}
                        idFactura={cita.idFactura}
                        onAddFactura={()=>{ChangeSt(5)}}/>
        }

    return (<div>

    <FormPageHeader 
    ActionProv={ActionsProvider} 
    Text="Cita" 
    menu={userMenu}/>

    <div 
    className='BackImageCollapsible' 
    style={{display:ActionsProvider.isAdd? "none":""}}/>
    
    <Layout 
    className='ContentLayout'>

        <Skeleton 
        style={{display:gettingCita?"":"none"}} 
        loading 
        active/>

        {/* //=======================================================================
        //============================= RELOJ ===================================
        //======================================================================= */}
        <div 
        style={{width:"100%", maxWidth:"800px", paddingTop:"15px", display:gettingCita?"none":"flex",
        flexDirection:"column", paddingLeft:"10px", paddingRight:"10px", paddingBottom:"10px", borderRadius:"25px",
        textAlign:"center", backgroundColor:"#212121", boxShadow:"0 5px 15px rgba(14,21,37,0.8)"}}>

            <input 
            style={{width:"100%",backgroundColor:"#212121",color:"white",borderWidth:"0",fontSize:"50px"}}
            type="time" 
            value={time} 
            onChange={(e)=>{setTime(e.target.value)}}/>

            <input 
            style={{width:"100%",backgroundColor:"#212121",color:"white",borderWidth:"0",fontSize:"25px"}}
            type="date" 
            value={date} 
            onChange={(e)=>{setDate(e.target.value?e.target.value:today)}}/>

        </div>

        <div style={{marginTop:"10px"}}>
            {Estados[`${cita.idEstado}`] ? 
                <Badge status={Estados[`${cita.idEstado}`].badge} /> 
                : 
                null}
            {Estados[`${cita.idEstado}`] ? " "+Estados[`${cita.idEstado}`].text : "Sin estado"}
        </div>

        <div style={{marginTop:"10px"}}>
            <Slider style={{width:"100%",minWidth:"300px"}}
            disabled
            marks={{
                0: (cita.horaInicio ? "Inició: " + moment(cita.horaInicio).format("HH:mm") : "Sin iniciar"),
                50: (cita.horaInicio ? "Tiempo: " + moment(cita.horaInicio).fromNow(true) : "Sin iniciar"),
                100: (cita.horaFin ? "Terminó: " + moment(cita.horaFin).format("HH:mm") : "Sin terminar")
            }}/>
        </div>

        <div 
        style={{marginTop:"20px",width:"100%",maxWidth:"800px",display:gettingCita?"none":""}}>

            { showPlay() ?
                <button 
                className='BottomRoundButton'
                onClick={() => {
                    // if cita id is running
                    if (cita.idEstado == 4){
                        StartStopCita(false)
                    }
                    else{
                        StartStopCita(true)
                    }
                }}>
                    {cita.idEstado == 4 ? 
                        <PauseOutlined style={{fontSize:"22px"}}/> 
                    :
                        <CaretRightOutlined style={{fontSize:"22px"}}/>
                    }
                </button>
            :
                null
            }

            <Segmented
            block
            options={modules}
            value={ActualList}
            onChange={setActualList}/>

            <List 
            style={{backgroundColor:"white",margin:"20px 0px"}}
            dataSource={modules[ActualList].lista} 
            grid={grid} 
            renderItem={(item) => (
                <TeraTaItem item={item} />
            )}/>

            <Button 
            type="primary" 
            shape="round" 
            icon={<PlusOutlined/>} 
            style={{width:"100%"}} 
            onClick={()=>{setPicker(ActualList)}}>
                {modules[ActualList].label}
            </Button>

            <Tabs 
            activeKey={SucDom} 
            onChange={(activeKey) => {
                if (activeKey == "1" && (cita.idSucursal ? cita.idSucursal.id : false) )
                    { message.info("Elimine la sucursal para poder cambiar a domicilio"); return; }
                if (activeKey == "0" && cita.direccionDomicilio)
                    { message.info("Elimine la direccion para poder cambiar a sucursal"); return; }
                setSucDom(activeKey)
            }}
            items={[
                {label:<span><EnvironmentFilled/> Sucursal </span>, key:"0", children:
                    <Space>
                        <MiniPicker
                        visible={true} 
                        title={cita.idSucursal ? cita.idSucursal.info[0] : "No hay sucursal"} 
                        icon={<EnvironmentFilled style={{fontSize:"50px",color:"white"}}/>} 
                        button="Cambiar Sucursal" 
                        onClick={()=>{setPicker(4)}}/>

                        <MiniPicker 
                        visible={cita.idSucursal ? true : false}
                        title={cita.idHabitacion ? cita.idHabitacion.info[0] : "No hay habitacion"}
                        icon={<LayoutFilled style={{fontSize:"50px",color:"white"}}/>} 
                        button="Cambiar Cubículo" 
                        onClick={()=>{setPicker(5)}}/>
                    </Space>
                },
                {label:<span><CarFilled/> Domicilio</span>, key:"1", children:
                    <Input.TextArea 
                    defaultValue={cita.direccionDomicilio}
                    onChange={(e)=>{cita.direccionDomicilio = e.target.value;}} 
                    maxLength={150}
                    showCount
                    autoSize={{minRows:3, maxRows:5}}
                    placeholder="Direccion"/>
                }
            ]}/>

            <Button 
            icon={ActionsProvider.isUpdt?<EditOutlined/>:<PlusOutlined/>}
            type='primary' 
            style={{width:"100%",marginTop:"20px"}} 
            size='large' 
            loading={isLoading} 
            shape='round' 
            onClick={onFinish}>
                {ActionsProvider.isUpdt? "Actualizar":"Añadir"}
            </Button>
            
            <Divider/>
        </div>
    </Layout>
    </div>)
}