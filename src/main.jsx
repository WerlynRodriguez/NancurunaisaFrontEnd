import ReactDOM from 'react-dom/client';
import React, { lazy, Suspense, useEffect, useState } from 'react';

import {
  BrowserRouter as Router,
  Outlet,
  Route,
  Routes
} from "react-router-dom";

import { FormActions, UserActions } from './Utils/ActionsProviders';
import {OnlyAdmin, RangeProvider} from './Utils/RangeProviders';
import RequireAuth from "./Utils/RequireAuth";

const Landing = lazy(() => import("./Landing/Landing"));
const SignIn = lazy(() => import("./SignIn/SignIn")); 
const Home = lazy(() => import("./Personal/Home/Home"));

const Ajustes = lazy(() => import("./Personal/Perfil/Ajustes"));

const Clinica = lazy(() => import("./Personal/Clinica/Clinica"));

const Citas = lazy(() => import("./Personal/Citas/Citas"));
const CitaDetail = lazy(() => import("./Personal/Citas/CitaDetail"));

const ReportsMenu = lazy(() => import("./Personal/Reports/Reports"));

const BottomBar = lazy(() => import("./Personal/Home/BottomBar"));

import SucRep from './Personal/Reports/SucSRep';
import LoadPage from './Personal/Perfil/LoadPage';

const AdUsers = lazy(() => import("./Personal/Perfil/Admin/AdUsers"));
const AdRols = lazy(() => import("./Personal/Perfil/Admin/AdRols"));

const UserDetail = lazy(() => import("./Personal/Perfil/Admin/UserDetail"));
const RolDetail = lazy(() => import("./Personal/Perfil/Admin/RolDetail"));


//================================================
// Todas las rutas de la seccion clinica
//================================================
const AllNavigations = [
  {key:"paci", path:"Paciente", vari:"PA", module:"Pacientes",
  list:"Pacientes/Pacientes",
  detail:"Pacientes/PacienteDetail"},

  {key:"terata", path:"Terapeuta", vari:"TA", module:"Terapeutas",
  list:"TeraTa/Terapeutas", 
  detail:"TeraTa/TerataDetail"},

  {key:"sucu", path:"Sucursal", vari:"SU", module:"Sucursales",
  list:"Sucursal/Sucursales",
  detail:"Sucursal/SucurDetail"},

  {key:"tera", path:"Terapia", vari:"TE", module:"Terapias",
  list:"Terapia/Terapias",
  detail:"Terapia/TeraDetail"},

  {key:"promo", path:"Promo", vari:"PR", module:"Promociones",
  list:"Promociones/Promos",
  detail:"Promociones/Promo"},
]

const getRoute = (props) => {
  const {key, path, elemento, action, module} = props;
  const Element = lazy(() => import(`./Personal/Clinica/${elemento}`));

  const getElement = () => {
    return <Element key={key}/>
  }

  return (
    <Route path={path} key={key} element={getElement()}/>
  )
}

function Nancurunaisa(){

  return(
    <Router>
      <Suspense 
      fallback={<LoadPage/>}
      >

        <Routes>
          <Route index element={<Landing/>}/>
          <Route path='Landing' element={<Landing/>}/>
          <Route path='SignIn' element={<SignIn/>}/>

          <Route path='Personal' element={[<RequireAuth key={0}/>,<BottomBar key={1}/>]}>
            <Route path='Home' element={<Home key="Home"/>}/>

            <Route path='Citas' element={<Citas key="Citas"/>}/>
            <Route path='Cita' element={<Outlet key="OutCita"/>}>

              <Route path={FormActions.Update+"/:idCita"} element={<CitaDetail key="CitaUpdt"/>}/>
              <Route path={FormActions.Add} element={<CitaDetail key="CitaAdd"/>}/>
              <Route path={FormActions.Read+"/:idCita"} element={<CitaDetail key="CitaRead"/>}/>
            </Route>

            <Route path='Clinica' element={<Outlet key="OutClin"/>}>
              <Route index element={<Clinica key="Clinic"/>}/>

              {AllNavigations.map((nav) => (<>
                
                {getRoute({key:nav.key.concat('List'), action:UserActions.Listar,
                path:nav.path.concat('s'), elemento:nav.list})}

                <Route 
                path={nav.path} 
                element={<Outlet key={nav.key.concat('Out')}/>}>

                  {getRoute({key:nav.key.concat('Updt'), action:UserActions.Editar,
                  path:FormActions.Update+'/:id'+nav.vari, elemento:nav.detail})}

                  {getRoute({key:nav.key.concat('Add'), action:UserActions.Añadir,
                  path:FormActions.Add, elemento:nav.detail})}

                  {getRoute({key:nav.key.concat('Read'), action:UserActions.Ver,
                  path:FormActions.Read+'/:id'+nav.vari, elemento:nav.detail})}

                </Route>
              </>))}

              <Route path='*' element={<Clinica key="ClinicD"/>}/>
            </Route>
{/* 
            <Route path="Reportes" element={<ReportsMenu key="Reportes"/>}/>
            <Route path='Reporte' element={<Outlet key="OutR"/>}>
              <Route path={"Sucursales/:idFec"} element={<SucRep key="RpSuc"/>}/>
            </Route> */}

            <Route path='Ajustes' element={<Outlet key="OutAju"/>}>
              <Route index element={<Ajustes key="Settings"/>}/>
              
              <Route path="Admin" element={<OnlyAdmin key="Admin"/>}>
                <Route path="Usuarios" element={<AdUsers/>}/>
                <Route path="Usuario" element={<Outlet key="OutUser"/>}>

                  <Route path={FormActions.Add} element={<UserDetail key="UserAdd"/>}/>
                  <Route path={FormActions.Read+"/:idUS"} element={<UserDetail key="UserRead"/>}/>
                  <Route path={FormActions.Update+"/:idUS"} element={<UserDetail key="UserUpdt"/>}/>
                </Route>

                <Route path="Roles" element={<AdRols/>}/>
                <Route path="Rol" element={<Outlet key="OutRol"/>}>

                  <Route path={FormActions.Add} element={<RolDetail key="RolAdd"/>}/>
                  <Route path={FormActions.Read+"/:idRol"} element={<RolDetail key="RolRead"/>}/>
                  <Route path={FormActions.Update+"/:idRol"} element={<RolDetail key="RolUpdt"/>}/>
                </Route>
              </Route>
            </Route>
            <Route path='*' element={<Home key="HomeD"/>}/>
          </Route>

          <Route path='*' element={<Landing/>}/>
        </Routes>
      </Suspense>
    </Router>
  )
}

const root = ReactDOM.createRoot( document.getElementById('root') );
const app = <Nancurunaisa/>

root.render(app);
