import React, { useState } from 'react';
import { Button, Divider, Input, Layout, List, message, Row, Select, Space, Statistic, Table, Typography } from 'antd';
import moment from 'moment';
import { Cell, Pie, PieChart } from 'recharts';
import { getReportSucursales } from '../../Utils/FetchingInfo';
const { Title } = Typography;
const { Option } = Select;

class citass{
    constructor(idCita,pendiente,fechaHora,pacientes,factura){
        this.key = idCita;
        this.pendiente = pendiente;
        this.fechaHora = fechaHora;
        this.pacientes = pacientes;
        this.idFactura = pendiente? "NA":factura.idFactura;
        this.subTotal = pendiente? "Pendiente":factura.subTotal;
        this.descuento = pendiente? "NA":factura.descuento;
        this.total = pendiente? "Pendiente":factura.total;
    }
}

class SucurAndCitas{
    constructor(id,nombre,citas){
        this.id = id;
        this.nombre = nombre;
        this.citas = citas;
    }
}

export default function ReportsMenu(){
    const [isloading, setIsloading] = useState(false);
    const [sem, setSem] = useState(0); //0 for semanal, 1 for monthly
    const [date, setDate] = useState('');

    const [Data, setData] = useState([]);
    const [ChartMoney, setChartMoney] = useState([]);
    const [ChartCitas, setChartCitas] = useState([]);
    const COLORS = ["rgb(64,60,60)","rgb(89,32,133)"];
    const pieMoneyLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        return ("$"+ChartMoney[index].value)
        //return (percent * 100).toFixed(0)+"%";
    }
    const pieCitasLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        return ChartCitas[index].value;
    }

    const [TotalGana, setTotalGana] = useState(0);
    const [TotalCitas, setTotalCitas] = useState(0);

    
    const columns = [
    {
        title: 'ID Cita',
        dataIndex: 'key',
        key: 'idCita',
    },
    {
        title: 'ID Factura',
        dataIndex: 'idFactura',
        key: 'idFactura',
    },
    {
        title: 'Fecha',
        dataIndex: 'fechaHora',
        key: 'date',
    },
    {
        title: 'SubTotal',
        dataIndex: 'subTotal',
        key: 'subtotal',
    },
    {
        title: 'Descuento',
        dataIndex: 'descuento',
        key: 'descuento',
    },
    {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
    },
    ]

    const onFinish =()=>{
        if (date == '' || date == undefined){
            message.error('Selecciona una fecha');
            return;
        }
        setIsloading(true);
        getReportSucursales(moment(date).format('YYYY-MM-DD'),sem).then((res)=>{
            const datal = [];
            const moneyChart =[];
            const citasChart =[];
            let totalGanancias = 0;
            let totalCitas = 0;
            res.map((item,index)=>{
                const citas = [];
                item.citas.map((item2,index2)=>{
                    citas.push(new citass(item2.idCita,item2.factura.length!=0?false:true,moment(item2.fechaHora).format("DD-MMMM HH:mm"),
                    item2.pacienteCita.length,item2.factura[0]));
                });
                totalGanancias += Number(item.totalGanancias);
                totalCitas += Number(item.totalCitas);
                moneyChart.push({name:item.nombreSucursal,value:item.totalGanancias})
                citasChart.push({name:item.nombreSucursal,value:item.totalCitas})
                datal.push(new SucurAndCitas(item.idSucursal,item.nombreSucursal,citas));
            });
            setTotalCitas(totalCitas);
            setTotalGana(totalGanancias);
            setChartCitas(citasChart);
            setChartMoney(moneyChart);
            setData(datal);
            setIsloading(false);
        }).catch((err)=>{
            console.log(err);
            message.error('Error al obtener los datos');
            setIsloading(false);
        });
    }

    return(<div>
        <div className="BackMenu"/>
        <Title level={2} style={{marginTop:"20px",marginLeft:"20px",color:"white"}}>Reportes</Title>

        <Layout className='ContentLayout' style={{borderTopLeftRadius:"50px",borderTopRightRadius:"50px",backgroundColor:"white"}}>
            <Space wrap>
               Reporte de Sucursales y citas por fecha <Input type="date" onChange={(e)=>{setDate(e.target.value)}} style={{width:"200px"}}/>
                de {sem==0?"esa":"ese"} <Select defaultValue={sem} style={{width:"200px"}} onChange={(e)=>setSem(e)}>
                    <Option value={0}>Semana</Option>
                    <Option value={1}>Mes</Option>
                </Select> 
            </Space>
            
            <Button type="primary" shape='round' loading={isloading} onClick={()=>{onFinish()}} 
            style={{marginTop:"20px",width:"100%",maxWidth:"600px"}}>Generar</Button>
        </Layout>
        <div style={{backgroundColor:"white",padding:"20px"}}>
            <Divider style={{marginTop:"20px",marginBottom:"20px"}}>Resumen Básico</Divider>
            <Space>
                <Statistic title="Total Efectivo" prefix="$" value={TotalGana} precision={2}/>
                <PieChart width={400} height={400}>
                    <Pie cx={200} cy={200} labelLine={true} label={pieMoneyLabel}
                        data={ChartMoney} innerRadius={60} outerRadius={80}
                        fill="#8884d8" paddingAngle={5} dataKey="value">
                        {ChartMoney.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </Space>
            <Space>
                <Statistic title="Total Citas" value={TotalCitas} precision={2}/>
                <PieChart width={400} height={400}>
                    <Pie cx={200} cy={200} labelLine={true} label={pieCitasLabel}
                        data={ChartCitas} innerRadius={60} outerRadius={80}
                        fill="#8884d8" paddingAngle={5} dataKey="value">
                        {ChartCitas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </Space>
            
            <Divider style={{marginTop:"20px",marginBottom:"20px"}}>Resumen Detallado</Divider>
            <List dataSource={Data} renderItem={(item,index)=>(<>
            <Title level={3} style={{marginTop:"20px",marginLeft:"20px",color:"black"}}>Sucursal {Data[index].nombre}</Title>
                <Table columns={columns} dataSource={Data[index].citas} pagination={{pageSize:10}} style={{marginTop:"20px"}}/>
            </>)}/>
            
        </div>
        
    </div>)
}