import React from "react";

import { User } from "../../types/User";
import { UserRole } from "../../types/UserRole";
import Header from "./Header";

export class Page {
  name: string;
  link: string;
  allowedRoles: UserRole[];

  constructor(name: string, link: string, allowedRoles: UserRole[]) {
    this.name = name;
    this.link = link;
    this.allowedRoles = allowedRoles;
  }
}

export const routes = [
  new Page("Home", "/", [UserRole.PARTICIPANT]),
  new Page("Create Submission", "/create", [UserRole.PARTICIPANT, UserRole.ADMIN]),
  new Page("Projects", "/projects", [
    UserRole.ADMIN,
    UserRole.JUDGE,
    UserRole.JUDGE_AND_SPONSOR,
    UserRole.PARTICIPANT,
    UserRole.SPONSOR,
  ]),
  new Page("Juding", "/judging", [UserRole.JUDGE, UserRole.JUDGE_AND_SPONSOR]),
  new Page("Admin", "/admin", [UserRole.ADMIN]),
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

  const filteredRoutes = routes.filter((page: Page) => page.allowedRoles.includes(props.user.role));

  return <Header routes={filteredRoutes} />;
};

export default Navigation;
