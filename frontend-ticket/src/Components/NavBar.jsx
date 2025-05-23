import React from "react";
import { FaSearch, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const styles = {
  navContainer: {
    width: "100%",
    background: "linear-gradient(90deg,rgb(9, 109, 248) 0%,rgb(153, 0, 255) 100%)",
    padding: "1.2rem 0",
    display: "flex",
    justifyContent: "center",
  },
  navBar: {
    width: "97%",
    maxWidth: "1700px",
    background: "#fff",
    borderRadius: "2.5rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 2.5rem",
    gap: "2rem",
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: "bold",
    fontSize: "2rem",
    marginRight: "2.5rem",
    letterSpacing: "0.5px",
    color: "#222",
    textDecoration: "none", // Removed underline
  },
  searchContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "#f5f5f5",
    borderRadius: "2rem",
    padding: "0.5rem 1.5rem",
    maxWidth: "420px",
    margin: "0 auto",
  },
  searchIcon: {
    fontSize: "1.2rem",
    color: "#222",
    marginRight: "0.75rem",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "1rem",
    width: "100%",
    color: "#444",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
    marginLeft: "2rem",
  },
  link: {
    fontSize: "1.1rem",
    color: "#222",
    textDecoration: "none",
    fontWeight: 500,
    transition: "color 0.2s",
    cursor: "pointer",
  },
  icon: {
    fontSize: "1.6rem",
    color: "#222",
    marginLeft: "1.5rem",
    cursor: "pointer",
  },
};

const NavBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Check for user data in localStorage
  const user = localStorage.getItem('user');
  const isAuthenticated = user !== null;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      e.preventDefault(); // Prevent default form submission or other key actions
      console.log('Navigating to events with search query:', searchQuery);
      // Navigate to the events page with the search query as a URL parameter
      navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery(''); // Clear the search input after searching
    }
  };

  return (
    <div style={styles.navContainer}>
      <nav style={styles.navBar}>
        <Link to="/" style={styles.logo}>A7gzly</Link>
        <div style={styles.searchContainer}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for events..."
            style={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
        <div style={styles.navLinks}>
          <Link to="/events" style={styles.link}>Events</Link>
          {/* Show My Bookings link for all users */}
          <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
          {/* Conditionally render Login/Profile */}
          {isAuthenticated ? (
             <FaUser
              style={styles.icon}
              title="Profile"
              onClick={() => navigate("/profile")}
              tabIndex={0}
              role="button"
              aria-label="Go to profile"
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate("/profile"); }}
            />
          ) : (
            <Link to="/login" style={styles.link}>Login</Link>
          )}
           {/* Register button always visible */}
           {!isAuthenticated && (
            <Link to="/register" style={styles.link}>Register</Link>
           )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
