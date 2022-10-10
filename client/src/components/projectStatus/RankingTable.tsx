import { Typography, Table, Button, message, Modal } from "antd/lib";
import useAxios from "axios-hooks";
import React, { Props, useState } from "react";
import { SortOrder } from "antd/lib/table/interface";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { Category } from "../../types/Category";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";
import { Criteria } from "../../types/Criteria";
import ErrorDisplay from "../../displays/ErrorDisplay";
import { AnyRecord } from "dns";
import { Link } from "react-router-dom";
import axios from "axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ModalState } from "../../util/FormModalProps";
import ProjectCard from "../projectGallery/ProjectCard";

const { Title } = Typography;

const columns = [
  {
    title: "Project Name",
    render: (row: any) => `${row.id} - ${row.name}`,
    key: "name",
    sorter: (a: any, b: any) => a.name.localeCompare(b.name),
  },
  {
    title: "DevPost URL",
    dataIndex: "devpostURL",
    key: "devpostURL",
    sorter: (a: any, b: any) => a.devpostURL.localeCompare(b.devpostURL),
  },
  {
    title: "Average Score",
    dataIndex: "average",
    key: "average",
    defaultSortOrder: "descend" as SortOrder,
    sorter: (a: any, b: any) => a.average - b.average,
  },
  {
    title: "Number of Times Judged",
    dataIndex: "numJudged",
    key: "numJudged",
    sorter: (a: any, b: any) => a.numJudged - b.numJudged,
  },
  {
    title: "Winner",
    dataIndex: "winner",
    key: "winner",
    sorter: (a: any, b: any) => a.winner.localeCompare(b.winner),
  }
];

const RankingTable = () => {
  const [{ data: categoryData, loading: categoryLoading, error: categoryError }] =
    useAxios("/categories");

  if (categoryLoading) {
    return <LoadingDisplay />;
  }

  if (categoryError) {
    return <ErrorDisplay error={categoryError} />;
  }

  const winner = async (project: { id: any; }, category: { id: any; hackathonId: any; }) => {

    const winnerData =  {
      id: project.id,
      categoryId: category.id,
      projectId: project.id,
      rank: "FIRST",
      hackathonId: category.hackathonId
    }
    console.log(winnerData);

    try {
      axios
        .post("/winner", { data: winnerData })
        .then(res => {
          if (res.data.error) {
            message.error(res.data.message, 2);
          } else {
            message.success("Success!", 2);
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
  const { confirm } = Modal;
  function showConfirm(project: any, category: any) {

    confirm({
      title: "Do you want to make this project the winner?",
      icon: <ExclamationCircleOutlined />,
      content: "This cannot be undone",
      onOk() {
        winner(project, category);
      },
    });
  }

  return (
    <>
      {categoryData?.map((category: Category) => {
        const data: any = [];
        return (
          <>
            <Title level={4}>{category.name}</Title>
            {category.projects.forEach((project: Project) => {
              let score = 0;
              let numJudged = 0;
              const judges = new Set();
              let editButton;
              category.criterias.forEach((criteria: Criteria) => {
                criteria.ballots.forEach((ballot: Ballot) => {
                  if (ballot.projectId === project.id) {
                    score += ballot.score;

                    if (!judges.has(ballot.userId)) {
                      numJudged += 1;
                      judges.add(ballot.userId);
                    }
                  }
                });
              })
                const winnerButton = (
                  <Button
                    type="primary"
                    onClick={() => {
                      showConfirm(project, category)
                    }}
                  >
                    Winner
                  </Button>
                );
              data.push({
                id: project.id,
                name: project.name,
                devpostURL: <a href={project.devpostUrl}>{project.name}</a>,
                average: numJudged > 0 ? score / numJudged : 0,
                numJudged,
                editScore: editButton,
                winner: winnerButton,

              });
              
            })}
            <Table
              key={category.id}
              columns={columns}
              dataSource={data}
              pagination={false}
              style={{ marginBottom: "20px" }}
              size="small"
            />
          </>
        );
      })}
    </>
  );
};

export default RankingTable;
function setModalState(arg0: { visible: boolean; initialValues: any; }) {
  throw new Error("Function not implemented.");
}

  function openModal(arg0: { scores: any; }) {
    throw new Error("Function not implemented.");
  }

