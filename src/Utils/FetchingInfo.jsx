import { getDateToday } from "./Calwulator";
const url = "http://172.23.173.158:5037/api/"

/*LOGIN*/
export async function loginUser(credentials) {
  const res = await fetch(url+"token", {
    method:"POST",
    headers:{
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  })
  const result = await res.json();
  return result;
};

/*Reportes*/
export async function getReportSucursales(date,type){
  const res = await fetch(url+"Informe?date="+date+"&type="+type);
  const result = await res.json();
  return result;
}

/*Pagination All Methods */
export async function GetByPagTeraTa(Page,perPage,search){
  let urlCompleta = url+"Masajista/?Page="+Page+"&PerPage="+perPage;
  if (search != undefined && search != ""){
    urlCompleta += "&nombreMasajista="+search;
  }
  const res = await fetch(urlCompleta);
  const result = await res.json();
  return result;
}

export async function GetByPagSucur(Page,perPage,search){
  let urlCompleta = url+"Sucursal/?Page="+Page+"&PerPage="+perPage;
  if (search != undefined && search != ""){
    urlCompleta += "&nombreSucursal="+search;
  }
  const res = await fetch(urlCompleta);
  const result = await res.json();
  return result;
}

export async function GetByPagPacS(Page,perPage,search){
  let urlCompleta = url+"Paciente/?Page="+Page+"&PerPage="+perPage;
  if (search != undefined && search != ""){
    urlCompleta += "&nombrePaciente="+search;
  }
  const res = await fetch(urlCompleta);
  const result = await res.json();
  return result;
}

export async function GetByPagTera(Page,perPage,search){
  let urlCompleta = url+"Terapia/?Page="+Page+"&PerPage="+perPage;
  if (search != undefined && search != ""){
    urlCompleta += "&nombreTerapia="+search;
  }
  const res = await fetch(urlCompleta);
  const result = await res.json();
  return result;
}

export async function GetByPagCitas(Age){
  const res = await fetch(url+"Cita?year="+Age);
  const result = await res.json();
  return result;
}

export async function GetByPagCubic(idSucursal,Page,perPage){
  const res = await fetch(url+"Habitacion?idSucursal="+idSucursal+"&Page="+Page+"&PerPage="+perPage);
  const result = await res.json();
  return result;
}

export async function GetbyPagPromos(Page,perPage,search){
  let urlCompleta = url+"Promocion/?Page="+Page+"&PerPage="+perPage;
  if (search != undefined && search != ""){
    urlCompleta += "&nombrePromocion="+search;
  }
  const res = await fetch(urlCompleta);
  const result = await res.json();
  return result;
}

/*Get all information from specific id */
export async function GetByIdTeraTa(id){
    //const res = await fetch("https://www.mecallapi.com/api/users/"+id);
    const res = await fetch(url+"Masajista/"+id);
    const result = await res.json();
    return result;
}

export async function GetByIdPac(id){
  const res = await fetch(url+"Paciente/"+id);
  const result = await res.json();
  return result;
}

export async function GetByIdSucur(id){
  const res = await fetch(url+"Sucursal/"+id);
  const result = await res.json();
  return result;
}

export async function GetByIdTera(id){
  const res = await fetch(url+"Terapia/"+id);
  const result = await res.json();
  return result;
}

export async function GetByIdCita(id){
  const res = await fetch(url+"Cita/"+id);
  const result = await res.json();
  return result;
}

export async function GetByIdPromo(id){
  const res = await fetch(url+"Promocion/"+id);
  const result = await res.json();
  return result;
}

/*Searching All Methods */
export async function SearchTeraTa(search){
    const res = await fetch("https://www.mecallapi.com/api/users?search="+search);
    const result = await res.json();
    return result;
}

export async function SearchSucur(search){
    const res = await fetch(" https://www.mecallapi.com/api/attractions?search="+search);
    const result = await res.json();
    return result;
}

export async function SearchPacS(search){
  const res = await fetch("https://www.mecallapi.com/api/users?search="+search);
  const result = await res.json();
  return result;
}

export async function SearchTera(search){
  const res = await fetch(" https://www.mecallapi.com/api/attractions?search="+search);
  const result = await res.json();
  return result;
}

export async function SearchCita(search){
  /*const res = await fetch(" https://www.mecallapi.com/api/attractions?search="+search);
  const result = await res.json();
  return result;*/
  return [];
}

export async function SearchPromos(search){
  /*const res = await fetch(" https://www.mecallapi.com/api/attractions?search="+search);
  const result = await res.json();
  return result;*/
  return [];
}

/*Creating */
export async function CreateTeraTa(data){
    const res = await fetch(url+'Masajista', {
       method: 'POST',
       headers: {
         Accept: 'application/form-data',
         'Content-Type': 'application/json',
       },body: JSON.stringify(data),
     })
     const result = await res.json();
     return result;
}

export async function CreateSucur(data){
  const res = await fetch(url+"Sucursal", {
     method: 'POST',
     headers: {
       Accept: 'application/form-data',
       'Content-Type': 'application/json',
     },body: JSON.stringify(data),
   })
   const result = await res.json();
   return result;
}

export async function CreatePromo(data){
  const res = await fetch(url+"Promocion", {
     method: 'POST',
     headers: {
       Accept: 'application/form-data',
       'Content-Type': 'application/json',
     },body: JSON.stringify(data),
   })
   const result = await res.json();
   return result;
}

export async function CreateHab(data){
  const res = await fetch(url+"Habitacion", {
     method: 'POST',
     headers: {
       Accept: 'application/form-data',
       'Content-Type': 'application/json',
     },body: JSON.stringify(data),
   })
   const result = await res.json();
   return result;
}

export async function CreatePac(data){
  const res = await fetch('https://www.mecallapi.com/api/users/create', {
     method: 'POST',
     headers: {
       Accept: 'application/form-data',
       'Content-Type': 'application/json',
     },body: JSON.stringify(data),
   })
   const result = await res.json();
   return result;
}

export async function CreateTera(data){
  const res = await fetch(url+"Terapia", {
     method: 'POST',
     headers: {
       Accept: 'application/form-data',
       'Content-Type': 'application/json',
     },body: JSON.stringify(data),
   })
   const result = await res.json();
   return result;
}

export async function CreateFact(data){
  const res = await fetch(url+"Factura", {
     method: 'POST',
     headers: {
       Accept: 'application/form-data',
       'Content-Type': 'application/json',
     },body: JSON.stringify(data),
   })
   const result = await res.json();
   return result;
}

export async function CreateCita(data){
  const res = await fetch(url+"Cita", {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },body: JSON.stringify(data),
    })
    const result = await res.json();
    return result;
}

export async function AddPacsCita(data){
  const res = await fetch(url+"PacienteCita", {
     method: 'POST',
     headers: {
       Accept: 'application/form-data',
       'Content-Type': 'application/json',
     },body: JSON.stringify(data),
   })
   const result = await res.json();
   return result;
}

/*Updating */
export async function UpdateTeraTa(id,data){
  //const res = await fetch("https://www.mecallapi.com/api/users/update",{
    const res = await fetch(url+"Masajista/"+id,{
    method:"PUT",
    headers: {
      Accept: '*/*',
      'Content-Type': 'application/json-patch+json',
    },body: JSON.stringify(data)
  });
  return res;
}

export async function UpdateSucursal(data){
  const res = await fetch("https://www.mecallapi.com/api/auth/attractions/update",{
    method:"PUT",
    headers: {
      Accept: 'application/form-data',
      'Content-Type': 'application/json',
      Authorization: "Bearer "+localStorage.getItem('accessToken')
    },body: JSON.stringify(data),
  })
  const result = await res.json();
     return result;
}

export async function UpdatePac(data){
  const res = await fetch("https://www.mecallapi.com/api/users/update",{
    method:"PUT",
    headers: {
      Accept: 'application/form-data',
      'Content-Type': 'application/json',
    },body: JSON.stringify(data)
  })
  const result = await res.json();
     return result;
}

export async function UpdateHab(id,data){
  const res = await fetch(url+"Habitacion/"+id,{
    method:"PUT",
    headers: {
      Accept: 'application/form-data',
      'Content-Type': 'application/json',
    },body: JSON.stringify(data)
  })
  const result = await res.json();
     return result;
}

export async function UpdatePromo(id,data){
  const res = await fetch(url+"Promocion/"+id,{
    method:"PUT",
    headers: {
      Accept: 'application/form-data',
      'Content-Type': 'application/json',
    },body: JSON.stringify(data)
  })
  return res;
}

export async function UpdateTera(data,id){
  const res = await fetch(url+"Terapia/"+id,{
    method:"PUT",
    headers: {
      Accept: 'application/form-data',
      'Content-Type': 'application/json',
    },body: JSON.stringify(data),
  })
  return res;
}//Authorization: "Bearer "+localStorage.getItem('accessToken')

/*Deleting */
export async function DeleteLogicTeraTa(id){
    //const res = await fetch('https://www.mecallapi.com/api/users/delete', {
    const res = await fetch("http://172.23.203.147:5037/api/Masajista/"+id,{
       method: 'DELETE',
       headers: {
         Accept: 'application/form-data',
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(data),
     })
     return res;
}

export async function DeleteSucur(data){
  const res = await fetch('https://www.mecallapi.com/api/auth/attractions/delete', {
     method: 'DELETE',
     headers: {
       Accept: 'application/form-data',
       'Content-Type': 'application/json',
       Authorization: "Bearer "+localStorage.getItem('accessToken')
     },
     body: JSON.stringify(data),
   })
   const result = await res.json();
   return result;
}

export async function DeletePac(data){
  const res = await fetch('https://www.mecallapi.com/api/users/delete', {
     method: 'DELETE',
     headers: {
       Accept: 'application/form-data',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(data),
   })
   const result = await res.json();
   return result;
}

export async function DeleteTera(id){
  const res = await fetch(url+"Terapia/"+id, {
     method: 'DELETE',
     headers: {
       Accept: 'application/form-data',
       'Content-Type': 'application/json',
     }
   })
   return res;
}

export async function FecthUSDNIORate(){
  const res = await fetch("https://v6.exchangerate-api.com/v6/2b03c3bbce449407cb6d52c1/pair/USD/NIO");
  const result = await res.json();
  localStorage.setItem('convertRate', result.conversion_rate);
  localStorage.setItem('latestRateUpdated', getDateToday());
  return result.conversion_rate;
}