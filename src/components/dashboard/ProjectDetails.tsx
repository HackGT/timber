import React from "react";
import { Descriptions, Typography, Alert } from "antd";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";
import { config } from "process";
import { apiUrl, Service } from "@hex-labs/core";

import LoadingDisplay from "../../displays/LoadingDisplay";
import ErrorDisplay from "../../displays/ErrorDisplay";
import DailyWindow from "../video/DailyWindow";

const { Title, Text } = Typography;

const Label: React.FC<{ name: string }> = ({ name }) => (
  <Text underline>
    <strong>{name}</strong>
  </Text>
);

const ProjectDetails: React.FC = props => {
  const { projectId } = useParams<any>();

  const [{ data: projectData, loading: projectLoading, error: projectError }] = useAxios(
    apiUrl(Service.EXPO, `/projects/${projectId}`)
  );
  const [{ data: configData, loading: configLoading, error: configError }] = useAxios(
    apiUrl(Service.EXPO, "/config")
  );
  const [{ data: tablegroupData, loading: tablegroupLoading, error: tablegroupError }] = useAxios(
    apiUrl(Service.EXPO, `/tablegroups/project/${projectId}`)
  );

  if (projectLoading || tablegroupLoading || configLoading) {
    return <LoadingDisplay />;
  }

  if (projectError || tablegroupError || configError) {
    return <ErrorDisplay error={projectError} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* {createMessage()} */}
      {/* <DailyWindow videoUrl={data.roomUrl} /> */}
      <Title level={2} style={{ margin: "30px 0" }}>
        {projectData.hexathon.name} Submission Details
      </Title>
      <Descriptions layout="vertical">
        <Descriptions.Item label={<Label name="Name" />}>{projectData.name}</Descriptions.Item>
        <Descriptions.Item label={<Label name="Emails" />}>
          {projectData.members.map((user: any) => user.email).join(", ")}
        </Descriptions.Item>
        <Descriptions.Item label={<Label name="Devpost" />}>
          <a href={projectData.devpostUrl}>{projectData.devpostUrl}</a>
        </Descriptions.Item>
        <Descriptions.Item label={<Label name="Selected Prizes" />}>
          {projectData.categories.map((category: any) => category.name).join(", ")}
        </Descriptions.Item>
        {configData.revealTableGroups && (
          <>
            <Descriptions.Item label={<Label name="Expo" />}>{projectData?.expo}</Descriptions.Item>
            <Descriptions.Item label={<Label name="Table Group" />}>
              {tablegroupData.name}
            </Descriptions.Item>
            <Descriptions.Item label={<Label name="Table Number" />}>
              {projectData.table}
            </Descriptions.Item>
          </>
        )}
      </Descriptions>

      {/* <Title level={2} style={{ textAlign: "center", marginTop: "25px" }}>
        Judging Call
      </Title>
      <iframe
        title="Meeting embedded"
        src={data.submission.meetingUrl}
        allow="camera; microphone; fullscreen; speaker"
        width="90%"
        style={{ height: "75vh", margin: "15px auto" }}
      /> */}
    </div>
  );
};

export default ProjectDetails;
