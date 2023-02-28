import React from "react";

import styles from "./logo.module.css";

const Logo: React.FC = () => (
  <div className={styles.container}>
    <svg width="39" height="32" viewBox="0 0 39 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.7433 18.2222H7.74285L3.4951 10.6667L7.74285 3.11111H16.234L20.4775 10.6667L14.4865 21.3333L20.4775 32H32.4681L38.459 21.3333L32.4681 10.6667H27.4677L25.7374 13.7778H30.7119L34.9596 21.3333L30.7119 28.8889H22.225L17.9816 21.3333L23.9769 10.6667L17.9816 0H5.9953L0 10.6667L5.9953 21.3333H10.9957L12.7433 18.2222Z"
        fill="url(#paint0_linear)"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="-4.85614e-07"
          y1="16.0724"
          x2="38.459"
          y2="16.0724"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#33C2FF" />
          <stop offset="1" stopColor="#7B69EC" />
        </linearGradient>
      </defs>
    </svg>
    <p className={styles.text}>expo</p>
  </div>
);

export default Logo;
