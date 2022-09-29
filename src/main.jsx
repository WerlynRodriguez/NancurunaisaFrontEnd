import ReactDOM from 'react-dom';
import React from 'react';
import Landing from "./Landing/Landing";
import SignIn from './SignIn/SignIn';
import Home from "./Personal/Home/Home";

import Ajustes from "./Personal/Perfil/Ajustes";

import Clinica from "./Personal/Clinica/Clinica";
import Pacientes from "./Personal/Clinica/Pacientes/Pacientes";
import PacSDetail from './Personal/Clinica/Pacientes/PacienteDetail';

import Sucursales from "./Personal/Clinica/Sucursal/Sucursales";
import SucurDetail from './Personal/Clinica/Sucursal/SucurDetail';

import Terapeutas from "./Personal/Clinica/TeraTa/Terapeutas";
import TeraTaDetail from "./Personal/Clinica/TeraTa/TerataDetail";

import Terapias from './Personal/Clinica/Terapia/Terapias';
import TeraDetail from './Personal/Clinica/Terapia/TeraDetail';

import { FormActions } from './Utils/ActionsProviders';
import { Allow, Deny, Ranges } from './Utils/RangeProviders';

import Citas from "./Personal/Citas/Citas";
import CitaDetail from './Personal/Citas/CitaDetail';
import ReportsMenu from './Personal/Reports/Reports';

import BottomBar from "./Personal/Home/BottomBar";

import RequireAuth from "./Utils/RequireAuth";

import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes
} from "react-router-dom";
import Promos from './Personal/Clinica/Promociones/Promos';
import Promo from './Personal/Clinica/Promociones/Promo';
import SucRep from './Personal/Reports/SucSRep';



function Nancurunaisa(){
  return(
    <Router>
      <Routes>
        <Route index element={<Landing/>}/>
        <Route path='Landing' element={<Landing/>}/>
        <Route path='SignIn' element={<SignIn/>}/>

        <Route path='Personal' element={[<RequireAuth key={0}/>,<BottomBar key={1}/>]}>
          <Route path='Home' element={<Home key="Home"/>}/>

          <Route path='Citas' element={<Citas key="Citas"/>}/>
          <Route path='Cita' element={<Outlet key="OutCita"/>}>
            <Route element={<Deny Exclude={[Ranges.Employ]}/>}>
              <Route path={FormActions.Update+"/:idCita"} element={<CitaDetail key="CitaUpdt"/>}/>
            </Route>
            <Route path={FormActions.Add} element={<CitaDetail key="CitaAdd"/>}/>
            <Route path={FormActions.Read+"/:idCita"} element={<CitaDetail key="CitaRead"/>}/>
          </Route>

          <Route path='Clinica' element={<Outlet key="OutClin"/>}>
            <Route index element={<Clinica key="Clinic"/>}/>

            <Route path='Pacientes' element={<Pacientes key="PacS"/>}/>
            <Route path='Paciente' element={<Outlet key="OutTPacS"/>}>
            <Route element={<Deny Exclude={[Ranges.Manager]}/>}>
              <Route path={FormActions.Update+'/:idPA'} element={<PacSDetail key="PacSUpdt"/>}/>
              <Route path={FormActions.Add} element={<PacSDetail key="PacSAdd"/>}/>
              <Route path={FormActions.Read+'/:idPA'} element={<PacSDetail key="PacSRead"/>}/>
            </Route>
            </Route>

            <Route path="Terapeutas" element={<Terapeutas key="TeraTas"/>}/>
            <Route path='Terapeuta' element={<Outlet key="OutTTas"/>}>
              <Route element={<Allow Permited={[Ranges.Owner,Ranges.Manager]}/>}>
                <Route path={FormActions.Update+'/:idTA'} element={<TeraTaDetail key="TTasUpdt"/>}/>
                <Route path={FormActions.Add} element={<TeraTaDetail key="TTasAdd"/>}/>
              </Route>
              <Route path={FormActions.Read+'/:idTA'} element={<TeraTaDetail key="TTasRead"/>}/>
            </Route>

            <Route path="Sucursales" element={<Sucursales key="Sucurs"/>}/>
            <Route path='Sucursal' element={<Outlet key="OutSU"/>}>
              <Route element={<Allow Permited={[Ranges.Owner,Ranges.Manager]}/>}>
                <Route path={FormActions.Update+'/:idSU'} element={<SucurDetail key="SUUpdt"/>}/>
                <Route path={FormActions.Add} element={<SucurDetail key="SUAdd"/>}/>
              </Route>
              <Route path={FormActions.Read+'/:idSU'} element={<SucurDetail key="SURead"/>}/>
            </Route>

            <Route path="Terapias" element={<Terapias key="Teras"/>}/>
            <Route path='Terapia' element={<Outlet key="OutTE"/>}>
              <Route element={<Allow Permited={[Ranges.Owner,Ranges.Manager]}/>}>
                <Route path={FormActions.Update+'/:idTE'} element={<TeraDetail key="TEUpdt"/>}/>
                <Route path={FormActions.Add} element={<TeraDetail key="TEAdd"/>}/>
              </Route>
              <Route path={FormActions.Read+'/:idTE'} element={<TeraDetail key="TERead"/>}/>
            </Route>

            <Route path="Promos" element={<Promos key="Promos"/>}/>
            <Route path='Promo' element={<Outlet key="OutP"/>}>
              <Route path={FormActions.Update+"/:idP"} element={<Promo key="PromoUpdt"/>}/>
              <Route path={FormActions.Add} element={<Promo key="PromoAdd"/>}/>
              <Route path={FormActions.Read+"/:idP"} element={<Promo key="PromoRead"/>}/>
            </Route>

            <Route path='*' element={<Clinica key="ClinicD"/>}/>
          </Route>

          <Route path="Reportes" element={<ReportsMenu key="Reportes"/>}/>
          <Route path='Reporte' element={<Outlet key="OutR"/>}>
            <Route path={"Sucursales/:idFec"} element={<SucRep key="RpSuc"/>}/>
          </Route>

          <Route path='Ajustes' element={<Ajustes key="Settings"/>}/>
          <Route path='*' element={<Home key="HomeD"/>}/>
        </Route>

        <Route path='*' element={<Landing/>}/>
      </Routes>
    </Router>
  )
}

ReactDOM.render(
  <Nancurunaisa/>,
  document.getElementById('root')
);
