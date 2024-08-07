import { MenuOutlined } from "@ant-design/icons";
import { Button, Drawer, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { User } from "../../types/User";
import Logo from "./Logo";

export class Page {
  name: string;
  link: string;
  isAllowed: (user: User) => boolean;

  constructor(name: string, link: string, isAllowed: (user: User) => boolean) {
    this.name = name;
    this.link = link;
    this.isAllowed = isAllowed;
  }

  setLink(link: string) {
    this.link = link;
  }
}

export const routes = [
  new Page("Home", "/", user => true),
  new Page("Create Submission", "/create", user => true),
  new Page("Project Gallery", "/projectgallery", user => true),
  new Page("Sponsor Page", `/category-group`, user => user.isSponsor),
  new Page("Judging", "/judging", user => user.isJudging),
  new Page("Admin", "/admin", user => user.roles.admin),
  new Page("Epicenter", "/epicenter", user => user.roles.admin),
  new Page("Project Status", "/project-status", user => user.roles.admin),
  new Page("Winners", "/winners", user => user.roles.member),
];

interface Props {
  user: User;
}

const Navigation: React.FC<Props> = props => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  // const [visible, setVisible] = useState(false);
  // const showDrawer = () => {
  //   setVisible(true);
  // };
  // const onClose = () => {
  //   setVisible(false);
  // };

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  // Find the id of the category group that is for sponsors and use it to route to sponsor page
  const findSponsorCategoryGroupId = () => {
    let sponsorCategoryId = null;
    props.user.categoryGroups.forEach((item: any) => {
      if (item.isSponsor) {
        sponsorCategoryId = item.id;
      }
    });
    return sponsorCategoryId;
  };
  const sponsorCategoryGroupId = findSponsorCategoryGroupId();
  routes[3].setLink(`/category-group/${sponsorCategoryGroupId}`)

  const filteredRoutes = routes.filter((page: Page) => page.isAllowed(props.user));

  // return <Header routes={filteredRoutes} />;
  return (
    <div style={{ direction: "rtl", backgroundColor: "white", height: 50 }}>
      <Drawer
        title="Menu"
        placement="right"
        closable
        onClose={() => setSidebarVisible(false)}
        visible={sidebarVisible}
      >
        <Menu mode="vertical" style={{ borderRight: "none", height: 50 }} selectable={false}>
          {filteredRoutes.map((route: Page) => (
            <Menu.Item key={route.name}>
              <Link onClick={() => setSidebarVisible(false)} to={route.link}>
                {route.name}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Drawer>

      <div id="logo" style={{ float: "left", backgroundColor: "white" }}>
        <Logo />
      </div>

      {width < 768 ? (
        <Button
          style={{ textAlign: "right" }}
          icon={<MenuOutlined />}
          type="link"
          onClick={() => setSidebarVisible(true)}
        />
      ) : (
        <Menu theme="light" mode="horizontal" selectable={false}>
          {filteredRoutes
            .slice()
            .reverse()
            .map((route: Page) => (
              <Menu.Item key={route.name}>
                <Link to={route.link}>{route.name}</Link>
              </Menu.Item>
            ))}
        </Menu>
      )}
    </div>
  );
};
export default Navigation;
