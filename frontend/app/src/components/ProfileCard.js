import React from "react";
import { useRouter } from "next/router";
import "./ProfileCard.css";

export default function ProfileCard() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/profile"); // Redirect to profile page
  };

  return (
    <div className="profile-card" onClick={handleClick}>
      <div className="profile-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A4 4 0 017 17h10a4 4 0 011.879.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <h3 className="profile-title">Profile</h3>
      <p className="profile-desc">Update your personal information</p>
    </div>
  );
}
