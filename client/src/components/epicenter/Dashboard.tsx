import React from "react";
import { Typography } from "antd";
import useAxios from "axios-hooks";

import ProjectTable from "./ProjectTable";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";
import ProjectTableContainer from "./ProjectTableContainer";

const { Title } = Typography;

const Dashboard = () => {
  const [{ data: projects, loading: projectLoading, error: projectError }] = useAxios("/projects");

  return (
    <div>
      <ProjectTableContainer projects={projects} isSponsor={false}/>
    </div>
  );
};

export default Dashboard;
