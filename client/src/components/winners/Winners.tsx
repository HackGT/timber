import React from "react";
import { List, Typography } from "antd";
import useAxios from "axios-hooks";

import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import WinnerCard from "./WinnerCard";

const { Title } = Typography;

const Winners: React.FC = () => {
  const [{ loading: winnersLoading, data: winnersData, error: winnersError }, refetchWinners] =
    useAxios("/winner");

  if (winnersLoading) {
    return <LoadingDisplay />;
  }
  if (winnersError) {
    return <ErrorDisplay error={winnersError} />;
  }

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
