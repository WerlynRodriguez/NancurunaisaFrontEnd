import "./Banner.css";

export default function Banner(){
    return(
        <div className='Banner' style={{backgroundImage:"url(/src/resources/sunrise.jpg)"}}>
            <div className='Circle'/>
            <div className='Tittle'>Nancurunaisa</div>
            <p className='SubTittle'>Clinica de Medicina Oriental</p>
        </div>
    )
}