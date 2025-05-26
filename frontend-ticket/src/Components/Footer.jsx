import React from "react";

const styles = {
  footer: {
    width: "100%",
    background: "var(--primary-light)",
    padding: "2rem 0 1rem 0",
    marginTop: "auto",
    borderTopLeftRadius: "var(--card-border-radius)",
    borderTopRightRadius: "var(--card-border-radius)",
    boxShadow: "var(--box-shadow)",
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
    color: "var(--text-primary)",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "1.1rem",
    transition: "color var(--transition-speed)",
    margin: "0 0.5rem",
    "&:hover": {
      color: "var(--accent-color)",
    }
  },
  copyright: {
    color: "var(--text-muted)",
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
    color: "var(--text-primary)",
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
