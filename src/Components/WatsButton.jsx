import "./WatsButton.css";

export default function WatsButton(props){
    const gochat = "https://wa.me/"+props.number;
    return(
        <button onClick={()=>{setTimeout(() => {  window.location=gochat; }, 300)}} className="WatsButton">
            WhatsApp
            <div className="iconWats"/>
        </button>
    )
}