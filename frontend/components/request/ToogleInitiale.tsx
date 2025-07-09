import React, { useContext, useState } from 'react'
import { MdOutlineArrowRight } from 'react-icons/md'
import FollowRequest from './FollowRequest'
import GroupeRequest from './GroupeRequest'
import { SocketContext, SocketContextType } from '@/context/socketContext'

const ToogleInitiale = (props: { showToggle: boolean, setShowToggle: Function }) => {
    const { numsNotif } = useContext(SocketContext) as SocketContextType
    const [activePage, SetActivePage] = useState('follow')
    const CloseToogle = () => {
        props.setShowToggle(false)
    }
    const ChangePage = (page: string) => {
        SetActivePage(page)
    }
    return (
        <div className={`ToogleInitiale ${props.showToggle ? "show" : "hide"}`} >
            <div className="close-toogle">
                <MdOutlineArrowRight onClick={CloseToogle} />
            </div>

            <h3>Notifications</h3>
            <div className="navigationToogle">
                <button className={`${activePage == "follow" ? 'active-request' : ""}`} onClick={() => ChangePage("follow")}>FOLLOWERS ({numsNotif ? Number(numsNotif?.followersCount) : 0})</button>
                <button className={`${activePage == "groupe" ? 'active-request' : ""}`} onClick={() => ChangePage("groupe")}>GROUPE ({numsNotif ? Number(numsNotif?.groupeReqCount) : 0})</button>
            </div>

            {activePage == 'follow' ? <FollowRequest /> : <GroupeRequest />}
        </div>
    )
}

export default ToogleInitiale