import React from "react"
import LogRocket from "logrocket"
import BookCallButton from "./bookCallButton"
import CyberContainer from "./cyberContainer"

const trackSocial = platform => () =>
  LogRocket.track("Social Link Clicked", { platform })

const Footer = () => (
  <div className="cyber-footer">
    <CyberContainer className="mt-0">
      <div className="text-center">
        <h2 className="text-white text-[2.5rem] mb-4">Let's connect().</h2>
        <p className="text-mid-grey text-md mb-6">
          Book a free call to see how I can help you.
        </p>
        <div className="btn-container justify-center">
          <BookCallButton />
        </div>
        <p className="mono text-mid-grey text-[0.9rem] mt-3">
          Free 30-minute chat. No commitment.
        </p>
      </div>

      <div className="subfooter mono">
        <div className="text-mid-grey">&copy; HIDDENTAO_LABS</div>
        <div className="flex flex-wrap gap-6">
          <a
            href="https://linkedin.com/in/hiddentao"
            target="_blank"
            rel="noopener noreferrer"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="Connect on LinkedIn"
            onClick={trackSocial("linkedin")}
          >
            LINKEDIN
          </a>
          <a
            href="https://github.com/hiddentao"
            target="_blank"
            rel="noopener noreferrer"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="View GitHub profile"
            onClick={trackSocial("github")}
          >
            GITHUB
          </a>
          <a
            href="https://x.com/TaoOfDev"
            target="_blank"
            rel="noopener noreferrer"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="Follow on X (Twitter)"
            onClick={trackSocial("x")}
          >
            X_TWITTER
          </a>
          <a
            href="mailto:ram@hiddentao.com"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="Send an email"
            onClick={trackSocial("email")}
          >
            EMAIL
          </a>
        </div>
      </div>
    </CyberContainer>
  </div>
)

export default Footer
