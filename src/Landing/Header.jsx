import { Row, Col, Button, message } from 'antd';
import "./Header.css";
import IconMenu from "../dibujo.svg";
import {Link } from "react-router-dom";

/*MessageTest */
//<Link to="https://ant.design/components/form/?theme=compact#components-form-demo-normal-login"/>
const loged = () => {
    message.success("Inicio de sesion exitoso",2);
}
const error = () => {
    message.error("Inicio de sesion fallido",2);
}

/*Top Header*/
function Header(){
    return(
        /*Table 2 Columns */
        <Row className='header'>
            <Col span={6} className='Logo'>
                <Link to="/">
                <img className='LogoOnly' src={IconMenu} alt="SVG as an image"/>
                </Link>
            </Col>
            <Col span={18} className='ButtonsCol'>
                <Link to="/SignIn">
                <Button className='Button'>Iniciar Sesion</Button>
                </Link>
                <Link to="/Personal/Home">
                    <Button type='primary' className='Button'>Inicio</Button>
                </Link>
            </Col>
        </Row>
    )
}

export default Header;