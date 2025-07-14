

import { MdGroups } from "react-icons/md";



function GroupHeader({id}: {id: string}) {
    return (
        <div>
            <MdGroups />
            <p>Group Number : {id}</p>
        </div>
    )
}

export default GroupHeader