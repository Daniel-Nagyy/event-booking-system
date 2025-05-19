import React, { useEffect, useState } from "react";
import axios from "axios";

function ProfilePage() {
  const [user, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/users/profile")
      .then((response) => {
        setProfile(response.data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch profile:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      padding: "2rem 0",
    },
    wrapper: {
      maxWidth: "48rem",
      margin: "0 auto",
      padding: "0 1rem",
    },
    profileCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    header: {
      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      height: "8rem",
    },
    profileContent: {
      position: "relative",
      padding: "0 1.5rem 1.5rem",
    },
    profileImageContainer: {
      position: "absolute",
      top: "-4rem",
      left: "50%",
      transform: "translateX(-50%)",
    },
    profileImage: {
      width: "8rem",
      height: "8rem",
      borderRadius: "50%",
      border: "4px solid white",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      objectFit: "cover",
    },
    userInfo: {
      paddingTop: "5rem",
      textAlign: "center",
    },
    userName: {
      fontSize: "1.875rem",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "0.5rem",
    },
    userRole: {
      fontSize: "1.125rem",
      color: "#3b82f6",
      fontWeight: "500",
      marginBottom: "1rem",
    },
    emailContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6b7280",
      marginBottom: "1.5rem",
    },
    emailIcon: {
      width: "1.25rem",
      height: "1.25rem",
      marginRight: "0.5rem",
    },
    buttonContainer: {
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
    },
    primaryButton: {
      padding: "0.5rem 1.5rem",
      backgroundColor: "#3b82f6",
      color: "white",
      borderRadius: "8px",
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    secondaryButton: {
      padding: "0.5rem 1.5rem",
      border: "1px solid #d1d5db",
      color: "#374151",
      borderRadius: "8px",
      backgroundColor: "white",
      fontWeight: "500",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    infoSection: {
      marginTop: "1.5rem",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      padding: "1.5rem",
    },
    sectionTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "1rem",
    },
    infoItem: {
      borderBottom: "1px solid #e5e7eb",
      paddingBottom: "1rem",
      marginBottom: "1rem",
    },
    infoLabel: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "#374151",
      marginBottom: "0.25rem",
    },
    infoValue: {
      color: "#111827",
    },
    statusContainer: {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      fontWeight: "500",
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    statusDot: {
      width: "0.5rem",
      height: "0.5rem",
      backgroundColor: "#16a34a",
      borderRadius: "50%",
      marginRight: "0.5rem",
    },
  };
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Profile Card */}
        <div style={styles.profileCard}>
          {/* Header Section */}
          <div style={styles.header}></div>

          {/* Profile Content */}
          <div style={styles.profileContent}>
            {/* Profile Picture */}
            <div style={styles.profileImageContainer}>
              <img
                src={user.profilePicture}
                alt={`${user.name}'s profile`}
                style={styles.profileImage}
              />
            </div>

            {/* User Information */}
            <div style={styles.userInfo}>
              <h1 style={styles.userName}>{user.name}</h1>

              <p style={styles.userRole}>{user.role}</p>

              <div style={styles.emailContainer}>
                <svg
                  style={styles.emailIcon}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {user.email}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.buttonContainer}>
              <button
                style={styles.primaryButton}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#2563eb")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#3b82f6")
                }
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div style={styles.infoSection}>
          <h2 style={styles.sectionTitle}>Profile Information</h2>

          <div>
            <div style={styles.infoItem}>
              <label style={styles.infoLabel}>Full Name</label>
              <p style={styles.infoValue}>{user.name}</p>
            </div>

            <div style={styles.infoItem}>
              <label style={styles.infoLabel}>Email Address</label>
              <p style={styles.infoValue}>{user.email}</p>
            </div>

            <div style={styles.infoItem}>
              <label style={styles.infoLabel}>Role</label>
              <p style={styles.infoValue}>{user.role}</p>
            </div>

            <div>
              <label style={styles.infoLabel}>Status</label>
              <span style={styles.statusContainer}>
                <span style={styles.statusDot}></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
