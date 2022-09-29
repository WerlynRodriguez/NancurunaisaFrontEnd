/*Calculator named by me: W E R L Y N */
import moment from 'moment';

import { FecthUSDNIORate } from "./FetchingInfo";

export function decodeJWT(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}

export function toAmPm(date){
    return moment(date).format('h:mm a');
}

export function getDateToday(){//returns a string
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

export function compareDates(date1, date2) {
    let  date1Aux = moment(date1);
    let  date2Aux = moment(date2);

    if (date1Aux.isBefore(date2Aux)) {//date1 is less than date2
        return -1;
    }
    if (date1Aux.isAfter(date2Aux)) {//date1 is greater than date2
        return 1;
    }
    return 0;//date1 is equal to date2
}

export function compareDatesInRange(minDate,date,hour,minutes){
    let minDateAux = moment(minDate);
    let dateAux = moment(date);
    let maxDateAux = moment(minDateAux).add(hour, 'h').add(minutes, 'm');

    if(dateAux.isSameOrBefore(minDateAux)){//date is less than minDate
        return 1;
    } if (dateAux.isSameOrAfter(maxDateAux)){//date is greater than maxDate
        return -1;
    }else{//date is between minDate and maxDate
        return 0;
    }
}
  
function isTheSameDay(date1, date2){
    if(date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate()){
        return true;
    }else{
        return false;
    }
}
  
  /*Currency */
function getRateUSDNIO(){
    var CR = localStorage.getItem('convertRate');
    const latestUpdated = localStorage.getItem('latestRateUpdated');
    const today = getDateToday();

    if(CR!=null || latestUpdated!=null){
        if (isTheSameDay(new Date(latestUpdated), new Date(today))) {
        return CR;
        }
    }
    FecthUSDNIORate().then((result)=>{
        CR = result;
    })
    return CR;
}

export const RateUSDNIO = getRateUSDNIO();

/*Cordoba to USD */
export function NIOConvUSD(NIO){
    return parseFloat(Number(NIO/RateUSDNIO).toFixed(2))
}

/*USD to Cordoba */
export function USDConvNIO(USD){
    return parseFloat(Number(USD*RateUSDNIO).toFixed(2))
}

export function SearchDay(DiasStartEnd,Month,key){
    if (!DiasStartEnd[Month]){ return -1; }
    let start = 0;
    let end = DiasStartEnd[Month].length - 1;

    while (start <= end) {
        let middle = Math.floor((start + end) / 2);

        if (DiasStartEnd[Month][middle].day === key) {
            // found the key
            return middle;
        } else if (DiasStartEnd[Month][middle].day < key) {
            // continue searching to the right
            start = middle + 1;
        } else {
            // search searching to the left
            end = middle - 1;
        }
    }
	// key wasn't found
    return -1;
}