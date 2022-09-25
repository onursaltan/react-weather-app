import React from "react";

export default function DayVert(props){

    const description = (props.forecastData.list[0].dt_txt.slice(11,13) > 15 && props.index===0) ? props.titleCase(props.todaysData.weather[0].main.toLocaleUpperCase()) : props.titleCase(props.forecastData.list.filter(item=>item.dt_txt.slice(11,13) == 15)[props.index].weather[0].main.toLocaleUpperCase())
    let backgroundImage = null

    if(description==="Clouds")
        backgroundImage = "images/clouds.png"
    else if(description==="Clear")
        backgroundImage = "images/clear.png"
    else if(description==="Rain")
        backgroundImage = "images/rain.png"
    else if(description==="Thunderstorm")
        backgroundImage = "images/thunderstorm.png"
    else if(description==="Snow")
        backgroundImage = "images/snow.png"
    else
        backgroundImage = "images/other.png"

    
    return(
        <div style={{backgroundImage:`url(${backgroundImage})`}} className={(props.index===0 ? " day today-vert " : " day ") + (props.index===props.activeDay &&  " active-day ")
        } onMouseEnter={()=>props.setActiveDay(props.index)} onMouseLeave={()=>props.setActiveDay(0)}>
            <p className="day-name">
                {props.days[props.index]}
            </p>
            <div className="day-info">
                <h1>{(props.forecastData.list[0].dt_txt.slice(11,13) > 15 && props.index===0) ? Math.round(props.todaysData.main.temp) : Math.round(props.forecastData.list.filter(item=>item.dt_txt.slice(11,13) === "15")[props.index].main.temp)}°</h1>
                <p>{description}</p>
            </div>
        </div>
    )
}