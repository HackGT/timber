import React from "react";
import { List, Button, Typography, Divider } from "antd";
import useAxios from "axios-hooks";
import axios from "axios";
import DownloadOutlined from "@ant-design/icons/lib/icons/DownloadOutlined";

import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import WinnerCard from "./WinnerCard";

const { Title } = Typography;

const handleDownload = async () => {
  await axios.get("/winner/export", { responseType: "blob" }).then(response => {
    const href = URL.createObjectURL(response.data);

    // create "a" HTML element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", "Winners.csv");
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  });
};

const Winners: React.FC = () => {
  const [{ loading: winnersLoading, data: winnersData, error: winnersError }] = useAxios("/winner");

  if (winnersLoading) {
    return <LoadingDisplay />;
  }
  if (winnersError) {
    return <ErrorDisplay error={winnersError} />;
  }

  console.log(winnersData);

  return (
    <>
      <Title level={2}>Winners</Title>
      <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
        Download
      </Button>
      <Divider />

      <div>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
          loading={winnersLoading}
          dataSource={winnersData}
          renderItem={(winner: any) => (
            <List.Item>
              <WinnerCard
                id={winner.id}
                project={winner.project}
                category={winner.category}
                members={winner.project.members}
                hackathon={winner.hackathon}
                rank={winner.rank}
              />
            </List.Item>
          )}
        />
      </div>
    </>
  );
};

export default Winners;
