'use client'

import { MdGroups, MdVerifiedUser } from "react-icons/md";
import { GetGroup } from "@/services/groupServices";
import { useContext, useEffect, useState } from "react";
import { GroupInfo, GroupMembers } from "@/types/events";
import FormatDate from "@/utils/date";
import { GetGroupMembers } from "@/services/eventsServices";
import PostHeader from "../post/postHeader";
import { Follower } from "@/types/post";
import { GetFolowers } from "@/services/postsServices";
import { PopupContext } from "@/context/PopupContext";

function GroupHeader({ id }: { id: string }) {
    const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
    const poopUp = useContext(PopupContext)
    const [groupMembers, setGroupMembers] = useState<GroupMembers | null>(null);
    const [showMembers, setShowMembers] = useState(false);
    const [showFolowers, setShowFolowers] = useState(false);
    const [followers, setFollowers] = useState<Follower[]>([]);
    const [invited, setInvited] = useState<number[]>([]);

    const handleToggleFollower = (id: number, checked: boolean) => {
        setInvited((prev) =>
            checked ? [...prev, id] : prev.filter((uid) => uid !== id)
        );
    };

    const displayMembers = () => {
        return (
            <div className="share-with-users">
                <label className="share-with-label">
                    Gorup members
                </label>
                <ul className="user-checkbox-list">
                    {groupMembers && groupMembers.members.map((member, indx) => (
                        <li key={indx} className="event-member-item">
                            <PostHeader author={member.nickname} avatarUrl={member.avatar} firstname={member.firstname} lastname={member.lastname} createdAt="" />

                        </li>
                    ))
                    }
                </ul>

            </div>
        )
    }

    const displayFolowers = () => {
        return (
            <div className="share-with-users">
                <label className="share-with-label">
                    Invite specific followers
                </label>
                <ul className="user-checkbox-list">
                    {followers && followers.length > 0 && followers.map((f, index) => (
                        <li key={index} className="user-checkbox-item">
                            <label id="follower-checkbox-label">
                                <PostHeader
                                    author={`${f.User?.firstname} ${f.User?.lastname}`}
                                    firstname={f.User?.firstname} lastname={f.User?.lastname}
                                    createdAt="" avatarUrl={f.User?.avatar}
                                />
                                <input
                                    type="checkbox"
                                    checked={invited.includes(f.User?.id)}
                                    onChange={(e) =>
                                        handleToggleFollower(f.User?.id, e.target.checked)
                                    }
                                    title={`Invite ${f.User?.firstname} ${f.User?.lastname}`}
                                    placeholder={`Select follower ${f.User?.firstname} ${f.User?.lastname}`}
                                    aria-label={`Invite ${f.User?.firstname} ${f.User?.lastname}`}
                                />
                            </label>
                        </li>

                    ))}
                </ul>
            </div>
        )
    }

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const data = await GetGroup(id);
                setGroupInfo(data);
            } catch (err) {
                poopUp?.showPopup("faild", "something went wrong, please try again")
            }
        };

        fetchGroup();
    }, [id]);


    const fetchMembers = async () => {
        try {
            const data = await GetGroupMembers(id);
            setGroupMembers(data);
        } catch (err) {
            poopUp?.showPopup("faild", "something went wrong, please try again")
        }
    };


    const fetchFolowers = async () => {
        try {
            const data = await GetFolowers();
            setFollowers(data)

        } catch (err) {
            poopUp?.showPopup("faild", "something went wrong, please try again")
        }
    };

    if (!groupInfo) return null;
    return (
        <div className="event-group-header">
            <div className="group-info-card">
                <div className="group-card-header">
                    <div className="group-header-title">
                        <MdGroups className="group-icon" />
                        <span className="group-creation-date">{FormatDate(groupInfo.group.created_at)}</span>
                        <div className="total-members">Members: {groupInfo.total_members}</div>
                    </div>

                    <div className="group-admin-card">
                        <p className="admin-name">{groupInfo.author.firstname} {groupInfo.author.lastname}</p>
                        {groupInfo.author.nickname && (
                            <p className="admin-nickname">
                                <MdVerifiedUser className="group-admin-icon" title="Group Admin" />
                                @{groupInfo.author.nickname}
                            </p>
                        )}
                    </div>
                </div>

                <div className="group-details">
                    <p> {groupInfo.group.title}</p>
                    <div className="event-group-description">{groupInfo.group.description}</div>
                </div>

                <div className="group-action-buttons">
                    <button
                        className="group-btn see-members"
                        onClick={async () => {
                            if (!showMembers) {
                                await fetchMembers();
                                setShowFolowers(false);
                                setInvited((prev) => [])
                            }
                            setShowMembers((prev) => !prev);
                        }}

                    >
                        {showMembers ? "Hide Members" : "See Members"}
                    </button>

                    <button
                        className="group-btn invite-users"
                        onClick={async () => {
                            if (!showFolowers) {
                                setInvited((prev) => prev = [])
                                await fetchFolowers(); // fetch only when opening
                                setShowMembers(false); // close members if opening followers
                            }
                            setShowFolowers((prev) => !prev); // toggle state
                        }}

                    >
                        {showFolowers ? "Back" : "Invite Users"}
                    </button>
                </div>
                {showMembers && groupMembers && (
                    <div className="group-members-list">
                        {groupMembers.members.length === 0 ? (
                            <p>No members in this group.</p>
                        ) : (
                            displayMembers()
                        )}
                    </div>
                )}
                {showFolowers && followers && (
                    <div className="group-members-list">
                        {followers.length === 0 ? (
                            <p>No Users To Invite.</p>
                        ) : (
                            displayFolowers()
                        )}
                    </div>
                )}
                {showFolowers && invited && invited.length > 0 && (
                    <button
                        className="group-btn send-invetation"
                    >
                        Send
                    </button>
                )}
            </div>
        </div>
    );
}

export default GroupHeader;
