import React from "react";

import styles from "./footer.module.css";

const Footer: React.FC = () => (
  <footer>
    <div className={styles.text_hex}>Made with ♡ by HexLabs</div>
    <div>
      <a href="http://mlh.io/code-of-conduct" className={styles.text_mlh}>
        MLH Code of Conduct
      </a>
    </div>
  </footer>
);

export default Footer;
