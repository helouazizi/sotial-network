import React, { useState } from 'react'
import { MdOutlineArrowRight } from 'react-icons/md'
import FollowRequest from './FollowRequest'
import GroupeRequest from './GroupeRequest'
import { useRequest } from '@/context/RequestContext'

const ToogleInitiale = (props: { showToggle: boolean, setShowToggle: Function }) => {
    const { dataReqs } = useRequest()
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
            <div className="navigationToogle">
                <button className={`${activePage == "follow" ? 'active-request' : ""}`} onClick={() => ChangePage("follow")}>FOLLOWERS ({Number(dataReqs?.followersCount)})</button>
                <button className={`${activePage == "groupe" ? 'active-request' : ""}`} onClick={() => ChangePage("groupe")}>GROUPE ({Number(dataReqs?.groupeReqCount)})</button>
            </div>

            {activePage == 'follow' ? <FollowRequest /> : <GroupeRequest />}
        </div>
    )
}

export default ToogleInitiale