import React from "react";
import { Typography } from "antd";
import useAxios from "axios-hooks";

import ProjectTable from "./ProjectTable";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";
import ProjectTableContainer from "./ProjectTableContainer";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

const { Title } = Typography;

const Dashboard = () => {
  const [{ data: projects, loading: projectLoading, error: projectError }] = useAxios("/projects");

  if (projectLoading) {
    return <LoadingDisplay />;
  }

  if (projectError) {
    return <ErrorDisplay error={projectError} />;
  }

  return (
    <div>
      <ProjectTableContainer projects={projects} isSponsor={false} />
    </div>
  );
};

export default Dashboard;
