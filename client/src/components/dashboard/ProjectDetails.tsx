import React from "react";
import { Descriptions, Typography, Alert } from "antd";
import { useParams } from "react-router-dom";
import useAxios from "axios-hooks";

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

  const [{ data, loading, error }] = useAxios(`/projects/${projectId}`);

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  // const createMessage = () => {
  //   switch (data.submission.round) {
  //     case "FLAGGED":
  //     case "SUBMITTED":
  //       return (
  //         <Alert
  //           message="Thank you for your submission to HackGT 7! Please check back later to see your submission status."
  //           type="info"
  //           showIcon
  //         />
  //       );
  //     case "ACCEPTED":
  //       return (
  //         <Alert
  //           message={
  //             <Text>
  //               Congrats on moving to the next round! If the conference below isn&apos;t working,
  //               the link to join the judging call can be found{" "}
  //               <a href={data.submission.meetingUrl} target="_blank" rel="noopener noreferrer">
  //                 <b>here</b>
  //               </a>
  //               . You are in expo number {data.submission.expo || 1}.
  //             </Text>
  //           }
  //           type="success"
  //           showIcon
  //         />
  //       );
  //     case "REJECTED":
  //       return (
  //         <Alert
  //           message="Thank you for your submission to HackGT 7! After reviewing your submission, we will not be moving it forward to round two of judging as it does not meet our live judging criteria. We hope you enjoyed the event and join us for future HackGT events! We invite you to stay for live judging and closing ceremonies."
  //           type="info"
  //           showIcon
  //         />
  //       );
  //     default:
  //       return null;
  //   }
  // };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {/* {createMessage()} */}
      {/* <DailyWindow videoUrl={data.roomUrl} /> */}
      <Title level={2} style={{ margin: "30px 0" }}>
        {data.hackathon.name} Submission Details
      </Title>
      <Descriptions layout="vertical">
        <Descriptions.Item label={<Label name="Name" />}>{data.name}</Descriptions.Item>
        <Descriptions.Item label={<Label name="Emails" />}>
          {data.members.map((user: any) => user.email).join(", ")}
        </Descriptions.Item>
        <Descriptions.Item label={<Label name="Devpost" />}>
          <a href={data.devpostUrl}>{data.devpostUrl}</a>
        </Descriptions.Item>
        <Descriptions.Item label={<Label name="Selected Prizes" />}>
          {data.categories.map((category: any) => category.name).join(", ")}
        </Descriptions.Item>
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
