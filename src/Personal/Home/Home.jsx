import BottomBar from "./BottomBar"
import { Divider, Layout, Skeleton, Space, Typography } from 'antd';
import React, {useState,useEffect} from 'react';
import TitleNum from "../../Components/Reports/TitleNum";

function WelcomeMessage(){
    const Time = new Date().getHours();
    let Message = "";
    if (Time>=6 && Time<12) {
        Message = "Buenos días";
    } else if (Time>=12 && Time<18) {
        Message = "Buenas tardes";
    } else if (Time>=18 && Time<24) {
        Message = "Buenas noches";
    } else {
        Message = "Descansandochi";
    }
    return (Message);
}

function Home (){
    const message = WelcomeMessage();
    const [phrase,setPhrase] = useState("");
    const [LoadingList,setLoadingList] = useState(true);
    const [HCPA,setHCPA] = useState(0);//Hoy citas por atender
    const [HCA,setHCA] = useState(0);//Hoy citas atendidas
    const [PCPA,setPCPA] = useState(0);//Personal citas por atender
    const [PCAD,setPPAD] = useState(0);//Personal a domicilio

    useEffect(() => {
        getThingsHome();
      }, [])

    const getThingsHome =()=>{
        setLoadingList(true);

        setTimeout(()=>{
            setLoadingList(false);
        },3000);
    }

    return (<div>
        <div className="BackMenu"/>
        <Typography.Title level={2} style={{marginTop:"20px",marginLeft:"20px",color:"white"}}>{message}</Typography.Title>
        <Skeleton loading={true} style={{display:LoadingList?"":"none"}} active paragraph={{ rows: 4 }}/>
        <Layout className='ContentLayout' style={{display:LoadingList?"none":"",borderTopLeftRadius:"50px",borderTopRightRadius:"50px",backgroundColor:"white"}}>

            <Divider orientation="left">Hoy</Divider>
            <Space size={[8,16]} wrap>
                <TitleNum title="Citas por Atender" num="10"/>
                <TitleNum title="Citas Atendidas" num="20"/>
            </Space>
            <Divider orientation="left">Personal</Divider>
            <Space size={[8,16]} wrap>
                <TitleNum title="Citas por Atender" num="5"/>
                <TitleNum title="Citas a Domicilio" num="5"/>
            </Space>
        </Layout>

    </div>)
  }
  
  export default Home