import React, { useState } from "react";
import { Typography, Button, Modal } from "antd";
import useAxios from "axios-hooks";

import ProjectTable from "./ProjectTable";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";
import { ModalState } from "../../util/FormModalProps";
import BallotEditFormModal from "./BallotEditFormModal";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

interface Props {
  projects: Project[];
  isSponsor: boolean;
  refetch?: any;
}

const ProjectTableContainer: React.FC<Props> = props => {
  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null,
  } as ModalState);

  const [{ data: criteriaData, loading, error }, refetch] = useAxios("/criteria");

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  /*
  const deleteScores = async () => {
    try {
      axios
        .patch(`/project/batch/update`, { ...values })
        .then(res => {
          hide();

          if (res.data.error) {
            message.error(res.data.message, 2);
          } else {
            message.success("Success!", 2);
            props.setModalState({ visible: false, initialValues: null });
            props.refetch();
          }
        })
        .catch(err => {
          hide();
          message.error("Error: Please ask for help", 2);
          console.log(err);
        });
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };
  */

  const openModal = (values: any) => {
    // const newBallot = values.ballot.map((ballot: any) => ballot.name);
    console.log(values);

    setModalState({
      visible: true,
      initialValues: { ...values },
    });
  };
  const { confirm } = Modal;
  const BallotModal = BallotEditFormModal;

  function showConfirm() {
    confirm({
      title: "Do you want to delete these scores?",
      icon: <ExclamationCircleOutlined />,
      content: "This cannot be undone",
      onOk() {
        // deleteScores();
        console.log("delete");
      },
    });
  }

  return (
    <div>
      {props.projects.map((project: Project) => {
        console.log(project);
        const generateData = (categoryId: number) => {
          const data: any = [];
          let total = 0;
          const ballotScores: any = [];

          project.ballots.forEach((ballot: Ballot) => {
            // console.log(ballot);
            if (ballot.criteria.categoryId === categoryId) {
              data[ballot.user.name] = (data[ballot.user.name] || 0) + ballot.score;
              total += ballot.score;
              ballotScores.push(ballot);
              console.log(ballot);
            }
          });

          const editButton = (
            <Button
              type="primary"
              onClick={() => {
                openModal({ scores: ballotScores });
              }}
            >
              Edit
            </Button>
          );
          const deleteButton = (
            <Button
              type="primary"
              onClick={() => {
                showConfirm();
              }}
            >
              Delete
            </Button>
          );

          const newData = Object.entries(data).map(e => ({
            judge: e[0],
            total: e[1],
            editScore: editButton,
            deleteScore: deleteButton,
          }));
          newData.push({
            judge: "Average",
            total: Math.round((total / newData.length) * 10) / 10,
            editScore: <></>,
            deleteScore: <></>,
          });
          console.log(newData);
          return newData;
        };

        return (
          <div key={project.id}>
            <Title key={project.id} level={4}>
              {props.isSponsor
                ? `Project Name: ${project.name}`
                : `${project.id} - ${project.name}`}
            </Title>
            <>
              {project.categories.map((category: any) => (
                <>
                  <Title level={5} key={category.id}>
                    {category.name}
                  </Title>
                  <ProjectTable data={generateData(category.id)} />
                </>
              ))}
            </>
            <br />
          </div>
        );
      })}
      <BallotModal modalState={modalState} setModalState={setModalState} refetch={refetch} />
    </div>
  );
};

export default ProjectTableContainer;
