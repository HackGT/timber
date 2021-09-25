import React from "react";
import { io } from "socket.io-client";
import { ConfigProvider, List, Empty, Card, Typography } from "antd";
import useAxios from "axios-hooks";
import { Link } from "react-router-dom";

import LoadingDisplay from "../../displays/LoadingDisplay";
import ErrorDisplay from "../../displays/ErrorDisplay";

const { Meta } = Card;
const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [{ data, loading, error }] = useAxios("/projects/dashboard", { useCache: false });

  const socket = io(`http://localhost:3000/`);
  socket.connect();

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Title level={2}>Your Submissions</Title>
      <ConfigProvider renderEmpty={() => <Empty description="You have no past Submissions" />}>
        <List
          grid={{ gutter: 32, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
          dataSource={data}
          renderItem={(submission: any) => (
            <List.Item>
              <Link to={`/submission/${submission.id}`}>
                <Card
                  title={submission.hackathon}
                  cover={<img alt="" src="/public/hackgt7.jpg" />}
                  hoverable
                >
                  <Meta
                    title={submission.name}
                    description={submission.members.map((item: any) => item.name).join(", ")}
                  />
                </Card>
              </Link>
            </List.Item>
          )}
        />
      </ConfigProvider>
    </div>
  );
};

export default Dashboard;
