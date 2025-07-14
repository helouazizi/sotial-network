'use client'

import { MdGroups, MdVerifiedUser } from "react-icons/md";
import { GetGroup } from "@/services/groupServices";
import { useEffect, useState } from "react";
import { GroupInfo, GroupMembers } from "@/types/events";
import FormatDate from "@/utils/date";
import { GetGroupMembers } from "@/services/eventsServices";
import PostHeader from "../post/postHeader";

function GroupHeader({ id }: { id: string }) {
    const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [groupMembers, setGroupMembers] = useState<GroupMembers | null>(null);
    const [showMembers, setShowMembers] = useState(false);

    const displayMembers = () => {
            return (
                <div className="share-with-users">
                    {groupMembers && groupMembers.members.map(( member,indx) => (
                        <div key={indx}>
                        <PostHeader author={member.nickname} avatarUrl={member.avatar} firstname={member.firstname} lastname={member.lastname} createdAt="" />

                        </div>
                    ))
                    }
                </div>

            )
  
    }
    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const data = await GetGroup(id);
                setGroupInfo(data);
            } catch (err) {
                console.error("Failed to fetch group info", err);
                setError("Failed to load group info");
            } finally {
                setLoading(false);
            }
        };

        fetchGroup();
    }, [id]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const data = await GetGroupMembers(id);
                setGroupMembers(data);

            } catch (err) {
                console.error("Failed to fetch group info", err);
                setError("Failed to load group info");
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, [id]);

    if (loading) return <p className="group-loading">Loading group...</p>;
    if (error) return <p className="group-error">{error}</p>;
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
                        onClick={() => setShowMembers((prev) => !prev)}
                    >
                        {showMembers ? "Hide Members" : "See Members"}
                    </button>
                    <button className="group-btn invite-users">Invite Users</button>
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

            </div>
        </div>
    );
}

export default GroupHeader;
