import React from "react";
import { List, Card, Tabs, Typography } from "antd";
import useAxios from "axios-hooks";

import ProjectTableContainer from "../projectStatus/ProjectTableContainer";
import RankingTable from "../projectStatus/RankingTable";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import WinnerCard from "./WinnerCard";

const { Title } = Typography;
const { TabPane } = Tabs;

const Winners: React.FC = () => {
  const [{ loading: winnersLoading, data: winnersData, error: winnersError }, refetchWinners] =
    useAxios("/winner");
    

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
      <div>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
        loading={winnersLoading}
        dataSource={winnersData}
        renderItem={(winner: any) => (
          <List.Item>
            <WinnerCard
              project={winner.project}
              category={winner.category}
              members={winner.members}
              hackathon={winner.hackathon}
            />
          </List.Item>
        )}
      />
      </div>
    </>
  );
};

export default Winners;
