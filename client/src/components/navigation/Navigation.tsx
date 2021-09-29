import React from "react";

import { User } from "../../types/User";
import { UserRole } from "../../types/UserRole";
import Header from "./Header";

export class Page {
  name: string;
  link: string;
  isAllowed: (user: User) => boolean;

  constructor(name: string, link: string, isAllowed: (user: User) => boolean) {
    this.name = name;
    this.link = link;
    this.isAllowed = isAllowed;
  }
}

export const routes = [
  new Page("Home", "/", user => [UserRole.GENERAL, UserRole.ADMIN].includes(user.role)),
  new Page("Create Submission", "/create", user =>
    [UserRole.GENERAL, UserRole.ADMIN].includes(user.role)
  ),
  new Page("Projects", "/projects", user =>
    [UserRole.GENERAL, UserRole.SPONSOR, UserRole.ADMIN].includes(user.role)
  ),
  new Page("Judging", "/judging", user => user.isJudging),
  new Page("Admin", "/admin", user => [UserRole.ADMIN].includes(user.role)),
  new Page("Epicenter", "/epicenter", user => [UserRole.ADMIN].includes(user.role)),
];

interface Props {
  user: User;
}

const Navigation: React.FC<Props> = props => {
  // const [sidebarVisible, setSidebarVisible] = useState(false);
  // const [width, setWidth] = useState(window.innerWidth);

  // useEffect(() => {
  //   const handleResize = () => setWidth(window.innerWidth);
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // });

  const filteredRoutes = routes.filter((page: Page) => page.isAllowed(props.user));

  return <Header routes={filteredRoutes} />;
};

export default Navigation;
