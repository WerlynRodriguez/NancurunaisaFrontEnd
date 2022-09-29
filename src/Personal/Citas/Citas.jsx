import {Typography, Layout,List, Badge, Skeleton, Calendar, Select} from 'antd';
const { Option } = Select;
import { useNavigate} from "react-router-dom";
import React, {useState,useEffect} from 'react';
import ItemViewCita from '../../Components/Items/ItemViewCita';
import "../../Utils/TextUtils.css";
import { PlusOutlined } from '@ant-design/icons';
import { FormActions } from '../../Utils/ActionsProviders';
import { GetByPagCitas} from '../../Utils/FetchingInfo';
import moment from 'moment';
import { compareDates, compareDatesInRange, SearchDay } from '../../Utils/Calwulator';
import { DenyFunction, getMyRange, Ranges } from '../../Utils/RangeProviders';

export default function Citas(props){
    let Navigate = useNavigate();/*Go back */
    let myRange = getMyRange();
    
    /*---------------------------------*/
    /*All about Citas in the calendar */
    const [Citas, setCitas] = useState([[],[],[],[],[],[],[],[],[],[],[],[]]);//Citas by Age
    var indexCitas = 0; /* Used for mapping the Citas Month Array (like var "i" in for)*/

    var EndStart = [[],[],[],[],[],[],[],[],[],[],[],[]]; /* for every month i save wich days have a cita. This is useful by dont research Citas */
    var indexEndStart = 0; /* Used for mapping the End Start array (like var "i" in for)*/

    const [ListCitas,setListCitas] = useState([]);/*All Citas about the day selected*/

    const DayToday = new Date();//Actual day
    const [ActualYear,setAcYear] = useState(DayToday.getFullYear());//Actual year
    const [ActualMonth,setAcMon] = useState(DayToday.getMonth());//Actual month
    var indexMonth = DayToday.getMonth();//month of the calendar()
    
    const [selectedDate, setSelectedDate] = useState(moment(DayToday));//Selected Date in the calendar

    const BadgesStatus = ["Todos","warning","error","success","processing"];//Status of citas
    const [BadgeOptions,setBadgeOptions] = useState(0);//BadgeOptions for the status of citas displayed in the calendar

    const [LoadingList,setLoadingList] = useState(true);//is fetching data from the server calendar
    /*---------------------------------*/

    const grid = { gutter: 16, xs: 1, sm: 1, md: 1,lg: 1,xl: 2,xxl: 2 };


    /*---------------------------------*/
    /*All about Calendar functions */
    useEffect(() => {
        getCitas(DayToday.getFullYear());
      }, [])

    const setList = (result) =>{
        setCitas(result);
        setLoadingList(false);
    }

    const getCitas=(Age)=>{
        setLoadingList(true);
        GetByPagCitas(Age)
        .then((result)=>{
            setList(result);
        })
    }

    const onNavigate = (date,mode) => {
        if (mode == "month") {
            let Month = Number(moment(date).format("MM")) - 1;
            if (ActualMonth != Month) {
                setAcMon(Month);
            }
            let Year = moment(date).format("YYYY");
            if(ActualYear != Year){
                setAcYear(Year);
                getCitas(Year);
            }
        }
    }

    const getSatusCita = (pending,cita) => {
        if (pending) {
            if (compareDates(DayToday,cita,"DD HH:mm") == -1) {
                return BadgesStatus[3];
            } else if (compareDatesInRange(cita,DayToday,1,0) == 0) {
                return BadgesStatus[4];
            }else{
                return BadgesStatus[2];
            }
        }else{
            return BadgesStatus[1];
        }
    }

    const getBadgeDay = (month,indexCita)=>{
        return getSatusCita(Citas[month][indexCita].pendiente,Citas[month][indexCita].fechaHora);
    }

    const getEvents =(value)=> {
        let dateMonth = Number(moment(value._d).format("MM")) - 1;

        if (dateMonth != indexMonth) { 
            indexCitas = 0;
            indexMonth = dateMonth;
            indexEndStart = 0;
            indexMonth = dateMonth;
        }

        if (Citas[dateMonth] == null) { return null;}
        if (Citas[dateMonth][indexCitas] == null) { return null;}

        let dayCita = Number(moment(Citas[dateMonth][indexCitas].fechaHora).format("DD"));
        let dayCalend = Number(value.date());

        if (dayCalend == dayCita) {
            let stat = "success";
            let content = EndStart[dateMonth][indexEndStart];
            let Actual = dateMonth == ActualMonth;
            
            if (!content && Actual) {
                EndStart[dateMonth][indexEndStart] = {day:Number(dayCalend),start:indexCitas,end:indexCitas};
                indexEndStart++;
            }

            do {//While the date is the same, plus indexCitas
                indexCitas++;
                if (indexCitas == Citas[dateMonth].length) {break}
            } while (dayCalend == Number(moment(Citas[dateMonth][indexCitas].fechaHora).format("DD")));

            if(!content && Actual){
                EndStart[dateMonth][indexEndStart-1].end = indexCitas-1;
            }

            stat = getBadgeDay(dateMonth,indexCitas-1);

            if (BadgeOptions != 0){
                if (BadgesStatus[BadgeOptions] != stat){
                    return null;
                }
            }

            return (<Badge status={stat} offset={[5, 0]}/>)
        }

        return null;
    }

    const getEventsbyDay =(SelectedDate)=>{
        if (EndStart[indexMonth] == null) { return [];}
        let Month = Number(moment(SelectedDate).format("MM")) - 1;
        let indexDay = Number(moment(SelectedDate).format("DD"));

        let index = SearchDay(EndStart,Month,indexDay);

        if (index != -1) {
            let start = EndStart[Month][index].start;
            let end = EndStart[Month][index].end;
            let citas = [];
            for (let i = start; i <= end; i++) {
                citas.push(Citas[Month][i]);
            }
            return citas;
        }
        return [];
    }

    const onChangeSelectedDate = (date) => {
        setListCitas(getEventsbyDay(date));
        setSelectedDate(date);
    }
    /*---------------------------------*/

    const onclickCita=(id)=>{
        if(DenyFunction([Ranges.Employ])){
            Navigate("/Personal/Cita/"+FormActions.Update+"/"+id);
        }else{
            Navigate("/Personal/Cita/"+FormActions.Read+"/"+id);
        }
    }

    const onclickAddCita=()=>{
        Navigate("/Personal/Cita/"+FormActions.Add);
    }
    
    return(<div>
        <div className="BackMenu"/>
        <Typography.Title level={2} style={{marginTop:"20px",marginLeft:"20px",color:"white"}}>Citas</Typography.Title>
        <button className='BottomRoundButton' onClick={()=>{onclickAddCita()}}><PlusOutlined/></button>

        <Skeleton.Button active={true} size='large' shape="square" block style={{display:LoadingList?"":"none",width:"100%",height:"400px"}}/>

        <Layout style={{borderTopLeftRadius:"50px",borderTopRightRadius:"50px",paddingTop:"20px",paddingRight:"20px",paddingLeft:"20px",display:LoadingList?"none":""}}>
            <Select bordered={false} value={BadgeOptions} onChange={(v)=>{setBadgeOptions(v)}}>
                <Option key={0} value={0}>{BadgesStatus[0]}</Option>
                <Option key={1} value={1}><Badge status={BadgesStatus[1]}/>Terminados</Option>
                <Option key={2} value={2}><Badge status={BadgesStatus[2]}/>Sin Facturar</Option>
                <Option key={3} value={3}><Badge status={BadgesStatus[3]}/>Pendientes</Option>
                <Option key={4} value={4}><Badge status={BadgesStatus[4]}/>Activos</Option>
            </Select>
            <Calendar onPanelChange={onNavigate}
            dateCellRender={(value)=> getEvents(value)} value={selectedDate} 
            onChange={(value)=>{onChangeSelectedDate(value)}} fullscreen={false}/>
        </Layout>
        <Layout className="ContentLayout" >
            <List style={{marginTop:"40px"}} loading={LoadingList} grid={grid}
                dataSource={ListCitas} renderItem={(cita,index) => (
                    <ItemViewCita id={cita.idCita} status={getSatusCita(cita.pendiente,cita.fechaHora)} 
                    hora={cita.fechaHora} hab={cita.habitacion} dir={cita.direccion} onClick={(id)=>{onclickCita(id)}}/>
                )}/>
        </Layout>
    </div>)
}