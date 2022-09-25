import React, {useState, useEffect} from "react";
import {ClickAwayListener} from "@mui/base";
import axios from "axios"

export default function Dropdown({setCity}){

    const[isLoading, setLoading] = useState(true)

    const[searchQuery, setSearchQuery] = useState("")

    const[isActive, setActive] = useState(false)

    const[data, setData] = useState([])

    function handleChange(event){
        setSearchQuery(event.target.value)
    }

    function handleClickAway(){
        setActive(false)
    }

    function titleCase(str) {
        return str.toLocaleLowerCase().replace(
            /(^|Ü|ü|Ş|ş|Ç|ç|İ|ı|Ö|ö|\w)\S*/g,
            (txt) => txt.charAt(0).toLocaleUpperCase() + txt.substring(1),
        )
    }

    useEffect(()=>{
        axios.get(`https://countriesnow.space/api/v0.1/countries/population/cities/`)
            .then(res=>{
                setData(res.data.data)
                }
            )
            .then(()=>setLoading(false))
            .catch(err=>
                console.log(err)
            )
    },[])

    return(
        <div style={{position: "relative"}}>
            <input onClick={()=>setActive(true)} onChange={(e)=>handleChange(e)} placeholder="Find cities." />
            {isActive &&
                <ClickAwayListener onClickAway={handleClickAway}>
                    <div className="dropdown">
                        {!isLoading && data.filter(item=>(!isNaN(+item.populationCounts[0].value))).sort((a,b)=>(b.populationCounts[0].value-a.populationCounts[0].value)).filter(item=>(item.city.toLowerCase().includes(searchQuery.toLowerCase()))).map((item, index)=>(
                            <div key={index} className="element" onClick={()=>setCity(item.city.toUpperCase().split("(")[0])}>{titleCase(item.city)}, {titleCase(item.country)}</div>
                        ))}
                    </div>
                </ClickAwayListener>
            }

        </div>

    )
}