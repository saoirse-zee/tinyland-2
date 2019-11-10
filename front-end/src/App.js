import React, { useState, useEffect } from 'react';
import { HotKeys } from "react-hotkeys";
import './App.css';
import Container from './Container'
import Blob from './Blob'
import calibrationImage from './rectglr_calibration.png'

const WebSocket = require('isomorphic-ws')

const WS_PORT = 1234

const ws = new WebSocket(`ws://127.0.0.1:${WS_PORT}`) 

function App() {
    const [isCalibrating, setIsCalibrating] = useState(false)
    const [message, setMessage] = useState('hi')
    const [things, setThings] = useState({})

    useEffect(() => {
        ws.onmessage = (msg) => {
            const data = JSON.parse(msg.data)
            if (data.type === 'string') {
                setMessage(data.payload)
            }
            if (data.type === 'shape') {
                const {payload} = data
                setThings((prevThings) => {
                    const newThing = {}
                    newThing[`noob-${payload.id}`] = {
                        x: payload.x,
                        y: payload.y,
                    }
                    return {...prevThings, ...newThing}
                })
            }
        }
        ws.onopen = () => {
            console.log('Connection is open')
        }
    })
    const handleToggleCalibration = () => setIsCalibrating(v => !v)
    return (
        <HotKeys
            keyMap={{ TOGGLE_CALIBRATION: "c" }}
            handlers={{ TOGGLE_CALIBRATION: handleToggleCalibration }}>
            {
                isCalibrating ? (
                    <div class="calibration">
                        {/* eslint-disable-next-line jsx-a11y/alt-text */}
                        <img src={calibrationImage} width="100%" height="685"/> 
                    </div>
                ) : (
                    <div className="App">
                        <Container width={500} height={200}>
                            <text x="10" y="10" fill="white">{Object.keys(things).length} things</text>
                            {
                                Object.keys(things).map(id => {
                                    const thing = things[id]
                                    return (
                                        <Blob key={id} x={thing.x * 500} y={thing.y * 200} />
                                    )
                                })
                            }
                        </Container>
                        {message}
                    </div>
                )
            }
        </HotKeys>
    ) 
}

export default App;
