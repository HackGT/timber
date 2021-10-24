import React from "react";
import { Typography } from "antd";
import useAxios from "axios-hooks";

import ProjectTableContainer from "./ProjectTableContainer";

const { Title } = Typography;

const Dashboard = () => {
  const [{ data: projects, loading: projectLoading, error: projectError }, refetch] =
    useAxios("/projects");

  return (
    <div>
      <ProjectTableContainer projects={projects} isSponsor={false} refetch={refetch} />
    </div>
  );
};

export default Dashboard;
