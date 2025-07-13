import React from 'react'

import { FaPeopleRoof } from "react-icons/fa6";

function ExploreGroups({text}: {text: string}) {
    return (
        <div className="exploreGroups">
            <FaPeopleRoof />
            <p>{text}</p>
        </div>
    )
}

export default ExploreGroups