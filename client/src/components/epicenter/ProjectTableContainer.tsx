import React, { useState } from "react";
import { Space, Typography, Button } from "antd";
import useAxios from "axios-hooks";

import ProjectTable from "./ProjectTable";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";
import { ModalState } from "../../util/FormModalProps";
import BallotEditFormModal from "./BallotEditFormModal";
import { Criteria } from "../../types/Criteria";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

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

  const [{ data: criteriaData, loading, error }] = useAxios("/criteria");

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const openModal = (values: any) => {
    // const newBallot = values.ballot.map((ballot: any) => ballot.name);
    console.log(values);

    setModalState({
      visible: true,
      initialValues: { ...values },
    });
  };
  const Modal = BallotEditFormModal;

  return (
    <div>
      {props.projects.map((project: Project) => {
        console.log(project);
        const generateData = (categoryId: number) => {
          const data: any = [];
          let total = 0;
          project.ballots.forEach((ballot: Ballot) => {
            if (ballot.criteria.categoryId === categoryId) {
              console.log(ballot);
              const row: any = {};
              row.name = ballot.user.name;
              row.score = (parseInt(row.name) || 0) + ballot.score;
              total += ballot.score;

              row.editButton = (
                <Button
                  type="primary"
                  onClick={() => {
                    openModal(ballot);
                  }}
                >
                  Edit
                </Button>
              );
              console.log(ballot);
              criteriaData.forEach((c: Criteria) => {
                if (c.id == ballot.criteria.categoryId) {
                  row.modal = (
                    <Modal
                      modalState={modalState}
                      setModalState={setModalState}
                      refetch={props.refetch}
                      criteria={c}
                    />
                  );
                }
              });

              data.push(row);
            }
          });

          const newData = data.map((row: any) => ({
            judge: row.name,
            total: row.score,
            editScore: row.editButton,
            modal: row.modal,
          }));

          newData.push({
            judge: "Average",
            total: Math.round((total / newData.length) * 10) / 10,
          });
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
    </div>
  );
};

export default ProjectTableContainer;
