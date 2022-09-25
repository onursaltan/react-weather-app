import React, {useEffect, useState} from "react";
import axios from "axios"
import Dropdown from "./city-select-dropdown";
import Loading from "./loading";
import Graph from "./graph";
import DayVert from "./day-vert";

export default function Weather(){

    const key="KEY"

    const [city, setCity] = useState("LONDON")

    const [isLoading, setLoading] = useState(true)

    const [activeDay, setActiveDay] = useState(0);

    const [days,setDays] = useState([])

    const [todaysData,setTodaysData] = useState(null)
    const [forecastData,setForecastData] = useState(null)

    const [graphData, setGraphData] = useState(null)

    const [todayBG, setTodayBG] = useState(null)

    useEffect(()=>{
        if(todaysData!==null && forecastData!==null && graphData!==null){
            setBG()
            setLoading(false)
        }
    },[todaysData,forecastData, graphData])

    useEffect(()=>{
        setTodaysData(null)
        setForecastData(null)
        setGraphData(null)
        setLoading(true)
        getData()
    },[city])

    function getData(){
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
            .then(res=>{
                return (res.data.coord)
                }
            )
            .then(async res=>{
                const todayData = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${res.lat}&lon=${res.lon}&appid=${key}&units=metric`)
                const forecast = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${res.lat}&lon=${res.lon}&appid=${key}&units=metric`)
                setDays([...new Set(forecast.data.list.map(item=>(getDay(item.dt_txt))))].slice(0,5))
                return ({todayData, forecast})
            })
            .then(res=>{
                setTodaysData(res.todayData.data)
                setForecastData(res.forecast.data)
                setGraphData(res.forecast.data.list.slice(0,4).map((item)=>({
                    x: new Date((item.dt*1000+res.forecast.data.city.timezone*1000)).toUTCString().slice(17,19),
                    y: Math.round(item.main.temp)
                })))})
            .catch(err=>{
                let prevCity = city;
                alert(prevCity+" could not be found.")
                window.location.reload()
                }
            )
    }

    function titleCase(str) {
        return str.toLocaleLowerCase().replace(
            /(^|Ü|ü|Ş|ş|Ç|ç|İ|ı|Ö|ö|\w)\S*/g,
            (txt) => txt.charAt(0).toLocaleUpperCase() + txt.substring(1),
        )
    }

    function getDay(date){
        const birthday = new Date(date);
        const day = birthday.getDay();

        if (day === 0) {
            return "Sunday";
        } else if (day === 1) {
            return "Monday";
        } else if (day === 2) {
            return "Tuesday";
        } else if (day === 3) {
            return "Wednesday";
        } else if (day === 4) {
            return "Thursday";
        } else if (day === 5) {
            return "Friday";
        } else if (day === 6) {
            return "Saturday";
        }
    }

    function setBG(){
        const todaysDesc = (forecastData.list[0].dt_txt.slice(11,13) > 15) ? titleCase(todaysData.weather[0].main.toLocaleUpperCase()) : titleCase(forecastData.list.filter(item=>item.dt_txt.slice(11,13) == 15)[0].weather[0].main.toLocaleUpperCase())
        if(todaysDesc==="Clouds")
            setTodayBG("ffc543-ff8c00")
        else if(todaysDesc==="Clear")
            setTodayBG("00d5ff-00a7c9")
        else if(todaysDesc==="Rain")
            setTodayBG("005496-003359")
        else if(todaysDesc==="Thunderstorm")
            setTodayBG("8d82b6-605880")
        else if(todaysDesc==="Snow")
            setTodayBG("9ddef2-4d9ecc")
        else
            setTodayBG("33c986-605880")
    }

    return(
        !isLoading ? <div className="weather">
            <div className="days">
                {days.map((item,index)=>{
                    return(
                        <DayVert key={index} index={index} days={days} forecastData={forecastData} todaysData={todaysData} setActiveDay={setActiveDay} activeDay={activeDay} titleCase={titleCase} />
                    )
                })}
            </div>

            <div style={todayBG && {backgroundImage:`linear-gradient(135deg, #${todayBG.split("-")[0]}, #${todayBG.split("-")[1]})`}} className="today">
                <div className="left">
                    <div className="three-info">
                        <div className="info">
                            <p>HUMIDITY</p>
                            <span>{!isLoading && todaysData.main.humidity}%</span>
                        </div>
                        <div className="vert-line"></div>
                        <div className="info">
                            <p>WIND</p>
                            <span>{!isLoading && todaysData.wind.speed}km/h</span>
                        </div>
                        <div className="vert-line"></div>
                        <div className="info">
                            <p>VISIBILITY</p>
                            <span>{!isLoading && todaysData.visibility/1000}km</span>
                        </div>
                    </div>
                    <div className="place">
                        <span className="city">{city}</span>
                        <span className="date">{!isLoading && "Local time:" + (new Date((todaysData.dt*1000+todaysData.timezone*1000)).toUTCString().slice(4,22))}</span>
                    </div>
                    <Dropdown setCity={setCity}/>
                </div>
                <div className="right">
                    <Graph data={graphData}/>
                </div>
            </div>
        </div> : <Loading/>
    )
}