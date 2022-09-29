import "./Vision.css";
import { Comment, Avatar } from 'antd';

import logo from "../dibujo.svg"

function Vision(){
    return(
        <div className='contentVision'>
            <div className="Vision">
                Nuestra Visión
            </div>
            <Comment
            className="Comentario"
                author={<a>Eveling Díaz</a>}
                avatar={<Avatar src={logo} alt="Eveling Diaz"/>}
                content="Los masajes no son un lujo. Los masajes son terapias que son importantes para nuestra salud."
                datetime="04/2022"
            />
        </div>
    )
}

export default Vision;