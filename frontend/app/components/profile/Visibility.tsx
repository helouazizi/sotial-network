"use client";
import { useProfile } from "@/app/context/ProfileContext";
import { Debounce } from "@/app/utils/Debounce";
import React, { useCallback } from "react";

const Visibility = () => {
  const { dataProfile, setDataProfile } = useProfile();

  const change = useCallback(
    Debounce(async () => {
      const newVisibility = dataProfile?.is_private === 1 ? 0 : 1;

      const req = await fetch(
        "http://localhost:8080/api/v1/ChangeVisibilityProfile",
        {
          method: "PUT",
          credentials: "include",
          body: JSON.stringify({
            to: newVisibility,
          }),
        }
      );

      if (req.ok) {
        setDataProfile((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            is_private: newVisibility,
          };
        });
      }
    }, 300),
    [dataProfile, setDataProfile]
  );

  return (
    <>
      {dataProfile?.myAccount && (
        <div className="switch-visibility">
          <label className="switch">
            <input
              type="checkbox"
              checked={dataProfile?.is_private === 0}
              onChange={change}
            />
            <span className="slider"></span>
          </label>
          To:
          {dataProfile?.is_private === 0 ? (
            <p style={{ color: "red" }}>PRIVATE</p>
          ) : (
            <p style={{ color: "#5fdd54" }}>PUBLIC</p>
          )}
        </div>
      )}
    </>
  );
};

export default Visibility;
