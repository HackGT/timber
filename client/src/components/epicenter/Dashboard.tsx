import React from "react";
import { Typography } from "antd";
import useAxios from "axios-hooks";

import ProjectTable from "./ProjectTable";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";
import ProjectTableContainer from "./ProjectTableContainer";

const { Title } = Typography;

const Dashboard = () => {
  const [{ data: projects, loading: projectLoading, error: projectError }, refetch] =
    useAxios("/projects");

  console.log(projects);

  return (
    <div>
      <ProjectTableContainer projects={projects} isSponsor={false} refetch={refetch} />
    </div>
  );
};

export default Dashboard;
