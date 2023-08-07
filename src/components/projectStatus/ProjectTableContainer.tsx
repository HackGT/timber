import React, { useState } from "react";
import { Typography, Button, Modal, message } from "antd";
import useAxios from "axios-hooks";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { apiUrl, Service } from "@hex-labs/core";

import ProjectTable from "./ProjectTable";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";
import { ModalState } from "../../util/FormModalProps";
import BallotEditFormModal from "./BallotEditFormModal";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { TableGroup } from "../../types/TableGroup";

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

  const [{ data: criteriaData, loading, error }, refetch] = useAxios(
    apiUrl(Service.EXPO, "/criterias")
  );

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const deleteScores = async (values: any) => {
    const ballotIds = values.scores.map((ballot: any) => ballot.id);
    const ids = {
      ids: ballotIds,
    };
    try {
      axios
        .delete(apiUrl(Service.EXPO, `/ballots/batch/delete`), { data: ids })
        .then(res => {
          if (res.data.error) {
            message.error(res.data.message, 2);
          } else {
            message.success("Success!", 2);
            props.refetch();
          }
        })
        .catch(err => {
          message.error("Error: Please ask for help", 2);
          console.log(err);
        });
    } catch (info) {
      console.log("Validate Failed:", info);
    }
  };

  const openModal = (values: any) => {
    setModalState({
      visible: true,
      initialValues: { ...values },
    });
  };
  const { confirm } = Modal;
  const BallotModal = BallotEditFormModal;

  function showConfirm(values: any) {
    const ballotIds = values.scores.map((ballot: any) => ballot.id);
    confirm({
      title: "Do you want to delete these scores?",
      icon: <ExclamationCircleOutlined />,
      content: "This cannot be undone",
      onOk() {
        deleteScores(values);
      },
    });
  }

  return (
    <div>
      {props.projects?.map((project: any) => {
        const generateData = (categoryId: number) => {
          const data: any = [];
          const judgeBallots: any = [];
          let total = 0;
          const ballotScores: any = [];

          project.ballots.forEach((ballot: Ballot) => {
            if (ballot.criteria.categoryId === categoryId) {
              data[ballot.user.name] = (data[ballot.user.name] || 0) + ballot.score;
              if (judgeBallots[ballot.user.name]) {
                judgeBallots[ballot.user.name].push(ballot);
              } else {
                judgeBallots[ballot.user.name] = [];
                judgeBallots[ballot.user.name].push(ballot);
              }
              total += ballot.score;
              ballotScores.push(ballot);
            }
          });

          const newData = Object.entries(data).map((e: any) => {
            const editButton = (
              <Button
                type="primary"
                onClick={() => {
                  openModal({ scores: judgeBallots[e[0]] });
                }}
              >
                Edit
              </Button>
            );

            const deleteButton = (
              <Button
                type="primary"
                onClick={() => {
                  showConfirm({ scores: judgeBallots[e[0]] });
                }}
              >
                Delete
              </Button>
            );

            return {
              judge: e[0],
              total: e[1],
              editScore: editButton,
              deleteScore: deleteButton,
            };
          });

          newData.push({
            judge: "Average",
            total: Math.round((total / newData.length) * 10) / 10,
            editScore: <></>,
            deleteScore: <></>,
          });
          return newData;
        };

        return (
          <div key={project.id}>
            <Title key={project.id} level={4}>
              <a href={project.devpostUrl} target="_blank">
                {props.isSponsor
                  ? `Project Name: ${project.name}`
                  : `${project.id} - ${project.name}`}
              </a>
            </Title>
            <p>
              {project.tableGroup !== undefined ? project.tableGroup.name : "N/A"}, Table #
              {project.table}, Expo #{project.expo}
            </p>
            {project.categories.map((category: any) => (
              <>
                <Title level={5} key={category.id}>
                  {category.name}
                </Title>
                <ProjectTable data={generateData(category.id)} />
              </>
            ))}
            <br />
          </div>
        );
      })}
      <BallotModal modalState={modalState} setModalState={setModalState} refetch={props.refetch} />
    </div>
  );
};

export default ProjectTableContainer;
