import React from "react";

import styles from "./footer.module.css";
import Instagram from "../../assets/social/insta.svg";
import Facebook from "../../assets/social/facebook.svg";
import Twitter from "../../assets/social/twitter.svg";
import GitHub from "../../assets/social/github.svg";
import Web from "../../assets/social/web.svg";

const Footer: React.FC = () => (
  <footer>
    <div className={styles.socials}>
      <a
        href="https://www.instagram.com/thehexlabs/"
        target="_blank"
        rel="noreferrer"
        className={styles.logo}
      >
        <img src={Instagram} alt="Instagram logo" />
      </a>
      <a
        href="https://www.facebook.com/TheHexLabs"
        target="_blank"
        rel="noreferrer"
        className={styles.logo}
      >
        <img src={Facebook} alt="Facebook logo" />
      </a>
      <a
        href="https://www.twitter.com/TheHexLabs"
        target="_blank"
        rel="noreferrer"
        className={styles.logo}
      >
        <img src={Twitter} alt="Twitter logo" />
      </a>
      <a
        href="https://www.github.com/HackGT"
        target="_blank"
        rel="noreferrer"
        className={styles.logo}
      >
        <img src={GitHub} alt="GitHub logo" />
      </a>
      <a href="https://www.hexlabs.org" target="_blank" rel="noreferrer" className={styles.logo}>
        <img src={Web} alt="Web logo" />
      </a>
    </div>
    <div className={styles.text_hex}>Made with ♡ by HexLabs</div>
    <div>
      <a href="http://mlh.io/code-of-conduct" className={styles.text_mlh}>
        MLH Code of Conduct
      </a>
    </div>
  </footer>
);

export default Footer;
