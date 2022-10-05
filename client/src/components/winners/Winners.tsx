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

  const winnerCards = winnersData.map((item: any) => (
      <List.Item>
        <WinnerCard
            project={item.project}
            category={item.category}
            members={item.members}
            hackathon={item.hackathon}
          />
        </List.Item>
      ));


  return (
    <>
      <Title level={2}>Winners</Title>
      <div>
        {winnerCards}
      </div>
    </>
  );
};

export default Winners;
