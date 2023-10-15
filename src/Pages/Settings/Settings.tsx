import React from 'react'
import './Settings.css'
import { useState } from 'react';

function Settings() {

    document.title = 'Just Works | Settings';

    const [contractors, setContractors] = useState([])
    const [areas, setAreas] = useState([])
    const [equipment, setEquipment] = useState([])


    return (
        <div>
            <h1>Settings</h1>
            

        </div>
    )
}

export default Settings