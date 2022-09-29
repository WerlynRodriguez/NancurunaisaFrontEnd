import { ContainerOutlined } from "@ant-design/icons";
import { Col, Layout, Row, Typography } from "antd";
import { Link } from "react-router-dom";
const { Title } = Typography;

function ButtonLink(props){
    return(<Link to={props.to}>
        <Row className='Cardview'>
            <Col className='ColCardTitle' span={18}>
                <Title level={3}>{props.title}</Title>
            </Col>
            <Col className='ColCardIcon' span={4}>
                {props.icon}
            </Col> 
        </Row>
    </Link>)
}

export default function SucRep(){
    return(<div>
        <Title level={2} style={{marginTop:"20px",marginLeft:"20px",color:"white"}}>Reportes</Title>

        <Layout className='ContentLayout' style={{borderTopLeftRadius:"50px",borderTopRightRadius:"50px",backgroundColor:"white"}}>
            <div style={{padding:"20px"}}>
            </div>

        </Layout>
    </div>)
}