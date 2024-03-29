import React from "react";
import { ConfigProvider, List, Empty, Card, Typography } from "antd";
import useAxios from "axios-hooks";
import { Link } from "react-router-dom";
import { apiUrl, Service } from "@hex-labs/core";

import LoadingDisplay from "../../displays/LoadingDisplay";
import ErrorDisplay from "../../displays/ErrorDisplay";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";

const { Meta } = Card;
const { Title, Text } = Typography;

interface Props {
  user: any;
}

const Dashboard: React.FC<Props> = props => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;

  const [{ data, loading, error }] = useAxios(
    {
      method: "GET",
      url: apiUrl(Service.EXPO, "/projects/special/dashboard"),
    },
    {
      useCache: false,
    }
  );

  const [{ data: configData, loading: configLoading, error: configError }] = useAxios(
    apiUrl(Service.EXPO, "/config")
  );

  if (loading || configLoading) {
    return <LoadingDisplay />;
  }

  if (error || configError) {
    return <ErrorDisplay error={error} />;
  }

  const getInfoText = (user: any) => {
    const adminBlurb = (
      <Text>
        Hello {props.user.name}! Thank you for using Expo! As an admin, you have full control over
        every aspect of the judging and expo process. You will be able to assign tables, judges, and
        how projects are scored. This also means you have the potential to cause issues if you are
        not careful. Please make sure you have read through all the user guides before messing with
        the available tools.
      </Text>
    );
    const projectsBlurb = (
      <Text> To view all the projects at this hackathon, go to the projects page.</Text>
    );
    const judgingBlurb = (
      <Text>
        {" "}
        If you go to the judging tab, you will be able to judge projects as they are assigned to
        you. Projects will automatically be assigned to you, so all you have to do is wait for the
        next project to pop in. You will also be presented with the judging criteria and rubric
        while you're scoring.{" "}
      </Text>
    );
    const sponsorsBlurb = (
      <Text>
        {" "}
        If you go to the sponsor page tab, you will be able to see the judging data for your
        company.
      </Text>
    );

    const adminBody = <div>{adminBlurb}</div>;

    const participantBody = <div>{projectsBlurb}</div>;

    const generalJudgeBody = (
      <div>
        {judgingBlurb}
        {projectsBlurb}
      </div>
    );

    const sponsorJudgeBody = (
      <div>
        {sponsorsBlurb}
        {judgingBlurb}
        {projectsBlurb}
      </div>
    );

    const sponsorBody = (
      <div>
        {sponsorsBlurb}
        {projectsBlurb}
      </div>
    );

    let dashboardBody;

    if (user.roles.admin) {
      dashboardBody = adminBody;
    } else if (user.isSponsor && user.isJudging) {
      dashboardBody = sponsorJudgeBody;
    } else if (user.isSponsor && !user.isJudging) {
      dashboardBody = sponsorBody;
    } else if (user.isJudging) {
      dashboardBody = generalJudgeBody;
    } else {
      dashboardBody = participantBody;
    }

    return (
      <div>
        <Title>Welcome To Expo!</Title>
        {dashboardBody}
        <br />
      </div>
    );
  };

  return (
    <div>
      {getInfoText(props.user)}
      {(!props.user.isJudging || props.user.roles.admin) && (
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <Title level={2}>Current Submission</Title>
          <ConfigProvider
            renderEmpty={() => <Empty description="You have no current submission" />}
          >
            <List
              grid={{ gutter: 32, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
              dataSource={data.filter((project: any) => project.hexathon.id === currentHexathon?.id)}
              renderItem={(project: any) => (
                <List.Item>
                  <Link to={`/projects/${project.id}`}>
                    <Card title={project.hexathon.name} hoverable>
                      <Meta
                        title={project.name}
                        description={project.members.map((item: any) => item.name).join(", ")}
                      />
                      <br />
                      {project.hexathon.id === currentHexathon?.id && configData.revealTableGroups && (
                        <>
                          <p>
                            <b>Table Group: </b>
                            {project.tableGroup.name}
                          </p>
                          <p>
                            <b>Table Number:</b> {project.table}
                          </p>
                        </>
                      )}
                    </Card>
                  </Link>
                </List.Item>
              )}
            />
          </ConfigProvider>
          <Title level={2}>Past Submissions</Title>
          <ConfigProvider renderEmpty={() => <Empty description="You have no past submissions" />}>
            <List
              grid={{ gutter: 32, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
              dataSource={data.filter((project: any) => project.hexathon.id !== currentHexathon?.id)}
              renderItem={(project: any) => (
                <List.Item>
                  <Link to={`/projects/${project.id}`}>
                    <Card title={project.hexathon.name} hoverable>
                      <Meta
                        title={project.name}
                        description={project.members.map((item: any) => item.name).join(", ")}
                      />
                      <br />
                    </Card>
                  </Link>
                </List.Item>
              )}
            />
          </ConfigProvider>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
