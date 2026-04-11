import React from "react"
import BookCallButton from "./bookCallButton"

const Footer = () => (
  <div className="cyber-footer">
    <div className="cyber-container">
      <div style={{textAlign: "center"}}>
        <h2 style={{color: "#fff", fontSize: "2.5rem", marginBottom: "0.5rem"}}>Let's connect().</h2>
        <p style={{color: "#888", fontSize: "1.2rem", marginBottom: "3rem"}}>Book a free call to see how I can help you.</p>
        <div className="btn-container" style={{justifyContent: "center"}}>
          <BookCallButton label="BOOK_CALL()" />
        </div>
      </div>

      <div className="subfooter mono">
        <div style={{color:"#888"}}>&copy; RAM_NAIR</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <a
            href="https://linkedin.com/in/hiddentao"
            target="_blank"
            rel="noopener noreferrer"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="Connect on LinkedIn"
          >LINKEDIN</a>
          <a
            href="https://github.com/hiddentao"
            target="_blank"
            rel="noopener noreferrer"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="View GitHub profile"
          >GITHUB</a>
          <a
            href="https://x.com/TaoOfDev"
            target="_blank"
            rel="noopener noreferrer"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="Follow on X (Twitter)"
          >X_TWITTER</a>
          <a
            href="mailto:ram@hiddentao.com"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="Send an email"
          >EMAIL</a>
        </div>
      </div>
    </div>
  </div>
)

export default Footer
