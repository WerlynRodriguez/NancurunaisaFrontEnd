import { Carousel, Divider, Layout, Skeleton, Space, Typography } from 'antd';
import React, {useState,useEffect} from 'react';
import TitleNum from "../../Components/Reports/TitleNum";
import "../../Utils/TextUtils.css";
import "../../Landing/Banner.css";
import { User } from '../../Models/Models';
import { getById } from '../../Utils/FetchingInfo';

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

function ImageCorusel(props){
    const {imageUrl, title} = props;
    return(<div>
        <div className='Banner'
        style={{
            backgroundImage:"linear-gradient(rgba(0,0,0,0.0) 50%,rgba(255,255,255,1) 98%),url("+imageUrl+")",
            justifyContent:"end"
        }}>
            <Typography.Text italic style={{margin:"40px",maxWidth:"600px",font:"bold 14px Arial"}}>
                "{title}"
            </Typography.Text> 
        </div>
    </div>)

}

export default function Home (){
    const message = WelcomeMessage();
    const [Loading,setLoading] = useState(true);
    const [Users,setUsers] = useState(new User(null));

    const listImages = [
        {imageUrl:"/src/resources/Home/Aceite1.jpg",title:"Haz de ti una prioridad, no un opcion..."},
        {imageUrl:"/src/resources/Home/Aceite2.jpg",title:"Busca paz para tu mente, y obtendras salud para tu cuerpo..."},
        {imageUrl:"/src/resources/Home/Cabeza1.jpg",title:"Si no sabes por donde empezar, empieza por sonreir..."},
        {imageUrl:"/src/resources/Home/Flor1.jpg",title:"Deja que la mente se calme y el corazon se abra, entonces todo fluira..."},
        {imageUrl:"/src/resources/Home/Masaje1.jpg",title:"Estar contento significa que te das cuenta de que contienes lo que estas buscando..."},
        {imageUrl:"/src/resources/Home/Piedra1.jpg",title:"Tomarse un tiempo para uno mismo es una inversión en la salud..."},
    ]

    useEffect(() => {
        getThingsHome();
      }, [])

    const getThingsHome =()=>{
        setLoading(true);

        const item = `nombres`;
        const id = JSON.parse(localStorage.getItem('user')).UserId;

        getById("usuarios","idUsuario",id,item).then((response) => {
            if (response == "errors") return;
            
            setUsers(response.data.usuarios.items[0]);
            setLoading(false);
        })
    }

    return (<>
        <Carousel
        autoplay
        autoplaySpeed={3500}
        effect='fade'>
            {listImages.map((item,index) => (
                <ImageCorusel
                key={index}
                imageUrl={item.imageUrl}
                title={item.title}/>
            )
            )}
        </Carousel>

        {Loading ? 
            <Skeleton.Button
            active
            shape="square"
            style={{position:"fixed",top:0,left:0,margin:"20px",width:"90%",
            minHeight: "120px",boxSizing:"content-box"}}/>
        :
            <Typography.Title 
            level={2}
            style={{position:"fixed",top:0,left:0,margin:"20px",color:"white",textShadow:"0px 0px 10px black"}}>
                {message} <br/> {Users.nombres}
            </Typography.Title>
        }

        <Layout 
        className='ContentLayout'
        style={{backgroundColor:"white"}}>
            
        </Layout>

    </>)
}