"use client";
import { PopupContext } from "@/context/PopupContext";
import { useProfile } from "@/context/ProfileContext";
import { ChangeVisbiltiy } from "@/services/ProfileServices";
import { Debounce } from "@/utils/Debounce";
import React, { useCallback, useContext } from "react";

const Visibility = () => {
  const { dataProfile, setDataProfile } = useProfile();
const popup = useContext(PopupContext)
  const change = useCallback(
    Debounce(async () => {
      const newVisibility = dataProfile?.is_private === 1 ? 0 : 1;
      await ChangeVisbiltiy(newVisibility, setDataProfile,popup)

    }, 500),
    [dataProfile, setDataProfile]
  );

  return (
    <>
      {dataProfile?.myAccount && (
        <div className="switch-visibility">
          <label className="switch">
            <input
              type="checkbox"
              checked={dataProfile?.is_private === 1}
              onChange={change}
            />
            <span className="slider"></span>
          </label>
          {dataProfile?.is_private === 0 ? (
            <p style={{ color: "#5fdd54" }}>PUBLIC</p>
          ) : (
            <p style={{ color: "#f87171" }}>PRIVATE</p>
          )}
        </div>
      )}
    </>
  );
};

export default Visibility;
