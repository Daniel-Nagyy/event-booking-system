import React from "react";

const styles = {
  footer: {
    width: "100%",
    background:
      "linear-gradient(90deg,rgb(255, 255, 255) 0%,rgb(255, 255, 255) 100%)",
    padding: "2rem 0 1rem 0",
    marginTop: "auto",
    borderTopLeftRadius: "2rem",
    borderTopRightRadius: "2rem",
    boxShadow: "0 -2px 16px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "inherit",
  },
  row: {
    display: "flex",
    gap: "2.5rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  link: {
    color: "#222",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1.1rem",
    transition: "color 0.2s",
    margin: "0 0.5rem",
  },
  copyright: {
    color: "#888",
    fontSize: "1rem",
    marginTop: "0.5rem",
    textAlign: "center",
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: "bold",
    fontSize: "1.5rem",
    marginBottom: "0.5rem",
    letterSpacing: "0.5px",
    color: "#222",
  },
};

const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.logo}>A7gzly</div>
    <div style={styles.row}>
      <a href="/support" style={styles.link}>
        Contact & Support
      </a>
      <a href="/about" style={styles.link}>
        About Us
      </a>
      <a href="/privacy" style={styles.link}>
        Privacy Policy
      </a>
    </div>
    <div style={styles.copyright}>
      &copy; {new Date().getFullYear()} A7gzly. All rights reserved.
    </div>
  </footer>
);

export default Footer;
