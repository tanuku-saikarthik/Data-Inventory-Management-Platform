import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Sidebar.module.css"; // Use appropriate styles

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.logo}>Dashboard v0.1</h1>
      <ul className={styles.navList}>
        <li>
          <Link to="/dashboard" className={styles.link}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/merge" className={styles.link}>
            Match and Merge
          </Link>
        </li>
        <li>
          <Link to="/datainventory" className={styles.link}>
            Inventory
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
