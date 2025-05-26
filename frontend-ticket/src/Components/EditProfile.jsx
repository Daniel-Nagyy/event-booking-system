import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "../services/api";

function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profilePicture: null,
    preview: null,
  });

  const styles = {
    container: {
      minHeight: "100vh",
      backgroundColor: "var(--primary-dark)",
      padding: "2rem 0",
    },
    wrapper: {
      maxWidth: "48rem",
      margin: "0 auto",
      padding: "0 1rem",
    },
    profileCard: {
      backgroundColor: "var(--primary-light)",
      borderRadius: "var(--card-border-radius)",
      boxShadow: "var(--box-shadow)",
      overflow: "hidden",
    },
    header: {
      background: "var(--secondary-dark)",
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
      cursor: "pointer",
    },
    profileImage: {
      width: "8rem",
      height: "8rem",
      borderRadius: "50%",
      border: "4px solid var(--primary-light)",
      boxShadow: "var(--box-shadow)",
      objectFit: "cover",
      transition: "opacity var(--transition-speed)",
    },
    changeText: {
      position: "absolute",
      bottom: "0.25rem",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "var(--secondary-dark)",
      color: "var(--text-primary)",
      padding: "0.25rem 0.5rem",
      borderRadius: "4px",
      fontSize: "0.75rem",
    },
    userInfo: {
      paddingTop: "5rem",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      fontWeight: "500",
      color: "var(--text-secondary)",
      marginBottom: "0.5rem",
    },
    input: {
      width: "100%",
      padding: "0.75rem 1rem",
      borderRadius: "var(--input-border-radius)",
      border: "1px solid var(--border-color)",
      fontSize: "1rem",
      backgroundColor: "var(--primary-dark)",
      color: "var(--text-primary)",
      transition: "all var(--transition-speed)",
    },
    buttonContainer: {
      display: "flex",
      gap: "1rem",
      justifyContent: "center",
      marginTop: "2rem",
    },
    primaryButton: {
      padding: "0.75rem 1.5rem",
      backgroundColor: "var(--accent-color)",
      color: "var(--text-primary)",
      borderRadius: "var(--button-border-radius)",
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all var(--transition-speed)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    secondaryButton: {
      padding: "0.75rem 1.5rem",
      border: "1px solid var(--border-color)",
      color: "var(--text-primary)",
      borderRadius: "var(--button-border-radius)",
      backgroundColor: "var(--primary-light)",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all var(--transition-speed)",
    },
    errorMessage: {
      backgroundColor: "var(--error-color)",
      color: "var(--text-primary)",
      padding: "1rem",
      borderRadius: "var(--card-border-radius)",
      marginBottom: "1rem",
    },
    successMessage: {
      backgroundColor: "var(--success-color)",
      color: "var(--text-primary)",
      padding: "1rem",
      borderRadius: "var(--card-border-radius)",
      marginBottom: "1rem",
    },
    loadingSpinner: {
      width: "1.5rem",
      height: "1.5rem",
      border: "2px solid var(--text-primary)",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    changeProfileLink: {
      color: "var(--accent-color)",
      textDecoration: "none",
      fontSize: "0.875rem",
      fontWeight: "500",
      marginTop: "0.5rem",
      display: "inline-block",
      transition: "color var(--transition-speed)",
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await profileService.viewprofile();
      const userData = response.data.user;
      setFormData((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
        preview: userData.profilePicture || null,
      }));
    } catch (err) {
      setError("Failed to load profile. Please try again.");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            profilePicture: file,
            preview: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const dataToSend = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.profilePicture) {
        const reader = new FileReader();
        reader.readAsDataURL(formData.profilePicture);
        reader.onloadend = async () => {
          dataToSend.profilePicture = reader.result;

          try {
            const response = await profileService.editProfile(dataToSend);

            if (response.data.user) {
              setSuccess(true);
              setTimeout(() => {
                navigate("/profile");
              }, 1500);
            } else {
              throw new Error(
                response.data.message || "Failed to update profile"
              );
            }
          } catch (err) {
            const errorMessage =
              err.response?.data?.message ||
              err.message ||
              "Failed to update profile. Please try again.";
            setError(errorMessage);
            console.error("Error updating profile:", err);
          } finally {
            setLoading(false);
          }
        };
      } else {
        const response = await profileService.editProfile(dataToSend);

        if (response.data.user) {
          setSuccess(true);
          setTimeout(() => {
            navigate("/profile");
          }, 1500);
        } else {
          throw new Error(response.data.message || "Failed to update profile");
        }
        setLoading(false);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile. Please try again.";
      setError(errorMessage);
      console.error("Error updating profile:", err);
      setLoading(false);
    }
  };

  if (loading && !formData.name) {
    return (
      <div
        style={{
          ...styles.container,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={styles.loadingSpinner}></div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.profileCard}>
          <div style={styles.header}></div>

          <div style={styles.profileContent}>
            <label style={styles.profileImageContainer}>
              <img
                src={
                  formData.preview ||
                  "https://ui-avatars.com/api/?name=K+R&background=0D8ABC&color=fff"
                }
                alt="Profile"
                style={styles.profileImage}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                name="profilePicture"
                style={{ display: "none" }}
                disabled={loading}
              />
              <span style={styles.changeText}>Change</span>
            </label>

            <div style={styles.userInfo}>
              {error && <div style={styles.errorMessage}>{error}</div>}
              {success && (
                <div style={styles.successMessage}>
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    style={styles.input}
                    required
                    disabled={loading}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    style={styles.input}
                    required
                    disabled={loading}
                  />
                </div>

                <div style={styles.buttonContainer}>
                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    style={styles.secondaryButton}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={styles.primaryButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div style={styles.loadingSpinner}></div>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>

              <a
                href="/change-profile"
                style={styles.changeProfileLink}
                onMouseEnter={(e) => (e.target.style.color = "#2563eb")}
                onMouseLeave={(e) => (e.target.style.color = "#3b82f6")}
              >
                Change Profile Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
