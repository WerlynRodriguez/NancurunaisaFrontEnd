import { LoadingOutlined } from '@ant-design/icons';

export default function LoadPage(){
    return(<>
        <div
        style={{fontSize:"50px",textAlign:"center",marginTop:"20%"}}>
            Nancurunaisa
        </div>
        <div style={{width:"100%",height:"300px",display:"flex",
        flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <LoadingOutlined
            style={{fontSize:"100px"}} 
            spin/>
            <p>Cargando...</p>
        </div>
    </>)
}