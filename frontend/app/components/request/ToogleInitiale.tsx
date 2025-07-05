import React from 'react'

const ToogleInitiale = (props: { showToggle: boolean, setShowToggle: Function }) => {


    return (
        <div className={`ToogleInitiale ${props.showToggle ? "show" : "hide"}`} >ToogleInitiale</div>
    )
}

export default ToogleInitiale