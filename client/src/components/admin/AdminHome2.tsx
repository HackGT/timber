import React, { useState } from "react";
import { Card, ConfigProvider, Empty, List, Typography, Tag, Button, Switch, message } from "antd";
import useAxios from "axios-hooks";
import axios from "axios";

import LoadingDisplay from "../../displays/LoadingDisplay";
import ErrorDisplay from "../../displays/ErrorDisplay";
import SubmissionEditModal from "./SubmissionEditModal";

const { Title, Text } = Typography;

const AdminHome2: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInitialValues, setModalInitialValues] = useState<any>(null);
  const [{ data, loading, error }, refetch] = useAxios("/projects", { useCache: false });

  const [submissionsOpen, setSubmissionsOpen] = useState<any>(false);
  axios.get("/config/submissionStatus").then(result => {
    if (result.data.submissionsOpen === true) {
      setSubmissionsOpen(true);
    }
  });

  const [videosActive, setVideosActive] = useState<any>(false);
  axios.get("/video/videoStatus").then(result => {
    if (result.data.isActive === true) {
      setVideosActive(true);
    }
  });

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const createStatus = (round: string) => {
    switch (round) {
      case "FLAGGED":
        return <Tag color="red">Flagged</Tag>;
      case "SUBMITTED":
        return <Tag>Submitted</Tag>;
      case "ACCEPTED":
        return <Tag color="green">Accepted</Tag>;
      case "REJECTED":
        return <Tag color="orange">Rejected</Tag>;
      default:
        return null;
    }
  };

  const openModal = (submissionData: any) => {
    setModalVisible(true);
    setModalInitialValues(submissionData);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalInitialValues(null);
    refetch();
  };

  const closeSubmissions = () => {
    axios
      .post("/config/closeSubmissions")
      .then(res => {
        if (res.data.error) {
          message.error(res.data.message, 2);
        } else {
          setSubmissionsOpen(res.data.submissionsOpen);
        }
      })
      .catch(err => {
        message.error("Error: Please ask for help", 2);
        console.log(err);
      });
  };

  const openSubmissions = () => {
    axios
      .post("/config/openSubmissions")
      .then(res => {
        if (res.data.error) {
          message.error(res.data.message, 2);
        } else {
          setSubmissionsOpen(res.data.submissionsOpen);
        }
      })
      .catch(err => {
        message.error("Error: Please ask for help", 2);
        console.log(err);
      });
  };

  const handleSubmissionsOpenChange = (submissionsOpen2: boolean) => {
    submissionsOpen2 ? openSubmissions() : closeSubmissions();
  };

  const closeVideos = () => {
    axios
      .post("/video/closeVideos")
      .then(res => {
        if (res.data.error) {
          message.error(res.data.message, 2);
        } else {
          setVideosActive(res.data.isActive);
        }
      })
      .catch(err => {
        message.error("Error: Please ask for help", 2);
        console.log(err);
      });
  };

  const activateVideos = () => {
    axios
      .post("/video/activateVideos")
      .then(res => {
        if (res.data.error) {
          message.error(res.data.message, 2);
        } else {
          setVideosActive(res.data.isActive);
        }
      })
      .catch(err => {
        message.error("Error: Please ask for help", 2);
        console.log(err);
      });
  };

  const handleVideosActiveChange = (videosActive2: boolean) => {
    videosActive2 ? activateVideos() : closeVideos();
  };

  const endCalls = () => {
    axios
      .post("/video/endCalls")
      .then(res => {
        if (res.data.error) {
          message.error("Error ending calls", 2);
        } else {
          message.warn("Calls ended", 2);
        }
      })
      .catch(err => {
        message.error("Error: Please ask for help", 2);
        console.log(err);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Title level={2}>All Submissions</Title>
      <Title level={4} style={{ marginTop: 0 }}>
        Submissions Open
      </Title>
      <div style={{ display: "flex", flexDirection: "column", width: "5%", marginBottom: "30px" }}>
        <Switch size="small" checked={submissionsOpen} onChange={handleSubmissionsOpenChange} />
      </div>

      <Title level={4} style={{ marginTop: 0 }}>
        Videos Active
      </Title>
      <div style={{ display: "flex", flexDirection: "column", width: "5%", marginBottom: "30px" }}>
        <Switch size="small" checked={videosActive} onChange={handleVideosActiveChange} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", width: "15%", marginBottom: "30px" }}>
        <Button onClick={endCalls}>End Judging Calls</Button>
      </div>

      <ConfigProvider renderEmpty={() => <Empty description="No Submissions" />}>
        <List
          grid={{ gutter: 32, xs: 1, sm: 2, md: 2, lg: 3, xl: 4, xxl: 5 }}
          dataSource={data}
          renderItem={(submission: any) => (
            <List.Item>
              <Card
                title={submission.name}
                extra={<Button onClick={() => openModal(submission)}>Edit</Button>}
              >
                <div style={{ marginBottom: "10px" }}>{createStatus(submission.round)}</div>
                <Text style={{ display: "block" }}>
                  Members: {submission.members.map((item: any) => item.name).join(", ")}
                </Text>
                <Text style={{ display: "block" }}>
                  Devpost:{" "}
                  <a href={submission.devpost} target="_blank" rel="noopener noreferrer">
                    Here
                  </a>
                </Text>
                <Text style={{ display: "block" }}>Prizes: {submission.prizes.join(", ")}</Text>
              </Card>
            </List.Item>
          )}
        />
      </ConfigProvider>
      <SubmissionEditModal
        visible={modalVisible}
        initialValues={modalInitialValues}
        closeModal={closeModal}
      />
    </div>
  );
};

export default AdminHome2;
