import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {VictoryChart, VictoryAxis, VictoryLine, VictoryArea, VictoryVoronoiContainer} from "victory";
import Loading from "./loading";

export default function Graph({data}){

    const [isLoading, setLoading] = useState(true)

    useEffect(()=>{
        if(data!==null)
            setLoading(false)
    },[data])


    return(
        isLoading ? <Loading/> :  <div>
            <svg style={{ height: 0 }}>
                <defs>
                    <linearGradient id="myGradient">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/>
                        <stop offset="100%" stopColor="rgba(255,255,255,0.5)"/>
                    </linearGradient>
                </defs>
            </svg>
            <VictoryChart height={250}
                          domain={{y: [Math.min(...data.map(item=>(item.y)))-3, Math.max(...data.map(item=>(item.y)))+3]}}>
                <VictoryAxis tickFormat={(t) => `${t}:00`} style={{
                    axis: {stroke: "transparent"},
                    tickLabels: {fill: "white"}
                }}/>
                <VictoryAxis tickFormat={(t) => `${t}°`} dependentAxis style={{
                    axis: {stroke: "transparent"},
                    tickLabels: {fill: "white"}
                }}/>
                <VictoryLine
                    containerComponent={<VictoryVoronoiContainer
                        viewBox="0, 0, width, height" width="100%" height="50%"/>}
                    animate={{
                        duration: 1000,
                        onLoad: { duration: 1000 }
                    }}
                    style={{
                        data: { stroke: "#ffffff", strokeWidth: 4, strokeLinecap: "round" },
                        parent: { border: "1px solid #ccc"},
                    }}
                    data={data}
                />
                <VictoryArea
                    style={{
                        data: {fill: "url(#myGradient)"},
                        stroke: "rgba(0,0,0,0)"
                    }}
                    data={data}
                />
            </VictoryChart>
        </div>

    )
}