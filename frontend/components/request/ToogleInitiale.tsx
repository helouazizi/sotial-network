import React, { useState } from 'react'
import { MdOutlineArrowRight } from 'react-icons/md'
import FollowRequest from './FollowRequest'
import GroupeRequest from './GroupeRequest'

const ToogleInitiale = (props: { showToggle: boolean, setShowToggle: Function }) => {
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
                <button className={`${activePage == "follow" ? 'active-request' : ""}`} onClick={() => ChangePage("follow")}>FOLLOWERS (0)</button>
                <button className={`${activePage == "groupe" ? 'active-request' : ""}`} onClick={() => ChangePage("groupe")}>GROUPE (0)</button>
            </div>

            {activePage == 'follow' ? <FollowRequest /> : <GroupeRequest />}
        </div>
    )
}

export default ToogleInitiale