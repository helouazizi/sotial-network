'use client'

import { MdGroups, MdVerifiedUser } from "react-icons/md";
import { GetGroup } from "@/services/groupServices";
import { useEffect, useState } from "react";
import { GroupInfo } from "@/types/events";
import FormatDate from "@/utils/date";

function GroupHeader({ id }: { id: string }) {
    const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    <p><span className="event-label">Group Name:</span> {groupInfo.group.title}</p>
                    <div className="event-group-description">{groupInfo.group.description}</div>
                </div>

                <div className="group-action-buttons">
                    <button className="group-btn btn-see-members">See All Members</button>
                    <button className="group-btn btn-invite-users">Invite Users</button>
                </div>
            </div>
        </div>
    );
}

export default GroupHeader;
