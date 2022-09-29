import {LoadingOutlined, SearchOutlined} from "@ant-design/icons"

export default function Searchbar(props){
    let {search} = props;

    const onSearch=(e)=>{
        if (typeof props.onSearch === "function"){
            props.onSearch(search);
        }
        //e.preventDefault();
    }

    return (
        <div className="ComunSearch">
            <input type="search" placeholder="Buscar" onKeyUp={(e)=>{e.key === "Enter"? onSearch(e):""}} onChange={(e)=>{search = e.target.value}}/>
            <button onClick={()=>{onSearch()}}>{props.loading == true? <LoadingOutlined/>:<SearchOutlined/>}</button>
        </div>
    )
}