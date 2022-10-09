import React from "react";
import { Button, Card, Tabs, Typography } from "antd";
import useAxios from "axios-hooks";

import ProjectTableContainer from "../projectStatus/ProjectTableContainer";
import RankingTable from "../projectStatus/RankingTable";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import axios from "axios";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";

const { Title } = Typography;
const { TabPane } = Tabs;

const handleDownload = async () => {
  const url = `${window.location.origin}/winner/export`
  await axios.get("/winner/export", { responseType: 'blob' }).then(response => {
    const href = URL.createObjectURL(response.data);

    // create "a" HTLM element with href to file & click
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', 'winnersData.csv'); // or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
    })
  }
const Winners: React.FC = () => {
  const [{ loading: projectsLoading, data: projectsData, error: projectsError }, refetchProjects] =
    useAxios("/projects");

  if (projectsLoading) {
    return <LoadingDisplay />;
  }

  if (projectsError) {
    return <ErrorDisplay error={projectsError} />;
  }
  

  return (
    <>
      <Title level={2}>Winners</Title>
      <Card
      title="hi"
    >
      <p> content </p>
    </Card>
    <Button type="primary" icon={<DownloadOutlined/>} onClick={handleDownload}>
        Download
      </Button>
      
    </>
  );
};

export default Winners;


