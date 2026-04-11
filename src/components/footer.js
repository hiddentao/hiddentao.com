import React from "react"

const Footer = () => (
  <div className="cyber-footer" id="book">
    <div className="cyber-container">
      <div style={{textAlign: "center"}}>
        <h2 style={{color: "#fff", fontSize: "2.5rem", marginBottom: "0.5rem"}}>Let's initialize.</h2>
        <p style={{color: "#888", fontSize: "1.2rem", marginBottom: "3rem"}}>Based in Singapore and London. Available for new engagements.</p>
        <div className="btn-container" style={{justifyContent: "center"}}>
          <a href="mailto:ram@hiddentao.com" className="cyber-btn btn-primary">BOOK_CALL()</a>
        </div>
      </div>
      
      <div className="subfooter mono">
        <div style={{color:"#888"}}>&copy; RAM_NAIR</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <a href="https://linkedin.com/in/hiddentao" target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a href="https://github.com/hiddentao" target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a href="https://x.com/TaoOfDev" target="_blank" rel="noopener noreferrer">X_TWITTER</a>
          <a href="mailto:ram@hiddentao.com">EMAIL</a>
        </div>
      </div>
    </div>
  </div>
)

export default Footer
