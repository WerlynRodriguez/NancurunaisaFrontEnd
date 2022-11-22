import {Typography, Layout,List, Badge, Skeleton, Calendar, Select} from 'antd';
const { Option } = Select;
import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import ItemViewCita from '../../Components/Items/ItemViewCita';
import "../../Utils/TextUtils.css";
import { PlusOutlined } from '@ant-design/icons';
import { FormActions } from '../../Utils/ActionsProviders';
import moment from 'moment';
import { compareDates, compareDatesInRange, SearchDay } from '../../Utils/Calwulator';
import { getByPagCitas } from '../../Utils/FetchingInfo';
import { Estados } from '../../Models/Models';
import ToolBar from '../../Components/ToolBar';

export default function Citas(props){
    let Navigate = useNavigate();/*Go back */
    
    //=========================================================
    // Represents all Citas in a Month
    const [Citas, setCitas] = useState([]);
    var indexCitasByDay = 0; /* Used for mapping the Citas Month Array (like var "i" in for)*/

    const DayToday = new Date();//Actual day
    const [ActualYear,setAcYear] = useState(DayToday.getFullYear());//Actual year
    const [ActualMonth,setAcMon] = useState(DayToday.getMonth());//Actual month
    
    const [selectedDate, setSelectedDate] = useState(moment(DayToday));//Selected Date in the calendar

    const BadgesStatus = ["Todos","warning","error","success","processing","default"];//Status of citas
    /*
    success: cita pendiente (green)
    error: cita cancelada (red)
    warning: cita en espera de facturar (yellow)
    processing: cita en proceso (blue)
    default: cita finalizada (gray)
     */
    const [BadgeOptions,setBadgeOptions] = useState(0);//BadgeOptions for the status of citas displayed in the calendar

    const [LoadingList,setLoadingList] = useState(true);//is fetching data from the server calendar

    useEffect(() => {
        getCitas();
      }, [ActualMonth,ActualYear]);

    const getCitas=()=>{
        setLoadingList(true);

        const items = `
        idCita
        fechaHora
        idEstado
        idHabitacionNavigation {
          nombreHabitacion
          idSucursalNavigation{
            nombreSucursal
        }`;

        getByPagCitas(items,ActualMonth+1,ActualYear,null).then((res)=>{
            if (res == "errors") return;

            setCitas(res);
            setLoadingList(false);
        })
    }

    const onNavigate = (date,mode) => {
        if (mode != "month") return;

        let Month = Number(moment(date).format("MM")) - 1;
        if (ActualMonth != Month) {
            setAcMon(Month);
        }
        let Year = moment(date).format("YYYY");
        if(ActualYear != Year){
            setAcYear(Year);
        }
    }

    const getEvents =(date)=> {
        //If the month is not the same, then the events are not loaded
        if (ActualMonth != Number(moment(date).format("MM")) - 1) return;
        if (Citas[`${ date.date() }`])
            return <Badge status={Estados[`${Citas[`${ date.date() }`][0].idEstado}`].badge} />;
    }

    const onclickCita=(id)=>{
        Navigate("/Personal/Cita/"+FormActions.Update+"/"+id);
    }

    const tools = [
        {icon:<PlusOutlined/>,onClick:()=>{Navigate("/Personal/Cita/"+FormActions.Add);}}
    ]
    
    return(<div>
        <div 
        className="BackMenu"/>

        <Typography.Title 
        level={2} 
        style={{marginTop:"20px",marginLeft:"20px",color:"white"}}>
            Citas
        </Typography.Title>

        <ToolBar tools={tools}/>

        {LoadingList ? 
            <Skeleton.Button 
            active={true} 
            size='large' 
            shape="square" 
            block 
            style={{width:"100%",height:"400px"}}/>
        :
            <Layout 
            style={{borderTopLeftRadius:"50px",borderTopRightRadius:"50px",
            paddingTop:"20px",paddingRight:"20px",paddingLeft:"20px"}}>

                {/* <Select 
                bordered={false} 
                value={BadgeOptions} 
                onChange={(v)=>{setBadgeOptions(v)}}>

                    <Option key={0} value={0}> Todas las citas</Option>

                </Select> */}

                <Calendar 
                onPanelChange={onNavigate}
                dateCellRender={getEvents}
                value={selectedDate} 
                onChange={(value)=>{ 
                    setSelectedDate(value);
                }}
                fullscreen={false}/>

            </Layout>
        }

        <Layout 
        className="ContentLayout">

            <Typography.Title 
            level={4} 
            style={{marginLeft:"20px"}}>
                Citas del {selectedDate.date()} de {selectedDate.format("MMMM")} de {selectedDate.year()}
            </Typography.Title>

            <List
            style={{marginTop:"20px",width:"100%"}} 
            loading={LoadingList} 
            grid={{ gutter: 16, xs: 1, sm: 1, md: 2,lg: 2,xl: 2,xxl: 3 }}
            dataSource={Citas[`${ selectedDate._d.getDate() }`] ? Citas[`${ selectedDate._d.getDate() }`] : []}
            renderItem={(cita,index) => (

                    <ItemViewCita
                    key={index}
                    id={cita.idCita}
                    idStatus={cita.idEstado}
                    hora={cita.fechaHora}
                    hab={cita.idHabitacionNavigation ? cita.idHabitacionNavigation : null}
                    onClick={(id)=>{onclickCita(id)}}/>
                )}/>
        </Layout>
    </div>)
}