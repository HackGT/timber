/* eslint-disable react/jsx-no-useless-fragment */
import { Typography, Table, Button, Modal, message } from "antd/lib";
import useAxios from "axios-hooks";
import React from "react";
import { SortOrder } from "antd/lib/table/interface";

import LoadingDisplay from "../../displays/LoadingDisplay";
import { Category } from "../../types/Category";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";
import { Criteria } from "../../types/Criteria";
import ErrorDisplay from "../../displays/ErrorDisplay";
import { AnyRecord } from "dns";
import { Link } from "react-router-dom";
import { apiUrl, Service } from "@hex-labs/core";
import axios from "axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";

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
    title: "Make Winner",
    dataIndex: "makeWinner",
    key: "makeWinner",
  },
];

const RankingTable = () => {
  const [{ data: categoryData, loading: categoryLoading, error: categoryError }] = useAxios(
    apiUrl(Service.EXPO, "/categories")
  );
  const [{ data: projects, loading: projectsLoading, error: projectsError }] = useAxios(
    apiUrl(Service.EXPO, "/projects")
  );

  if (categoryLoading || projectsLoading) {
    return <LoadingDisplay />;
  }

  if (categoryError) {
    return <ErrorDisplay error={categoryError} />;
  }

  if (projectsError) {
    return <ErrorDisplay error={projectsError} />;
  }

  const createWinner = async (
    project: { id: number },
    category: { id: number; hexathon: string }
  ) => {
    const newWinner = {
      id: project.id,
      categoryId: category.id,
      projectId: project.id,
      rank: "FIRST",
      hexathon: category.hexathon,
    };

    try {
      axios
        .post(apiUrl(Service.EXPO, `/winner`), { data: newWinner })
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

  function showConfirm(project: Project, category: Category) {
    confirm({
      title: "Do you want to make this project a winner?",
      icon: <ExclamationCircleOutlined />,
      content: "Edit the rank in the Winners tab",
      onOk() {
        createWinner(project, category);
      },
    });
  }

  return (
    <>
      {categoryData?.map((category: Category) => {
        const data: any = [];
        const categoryProjects = category.isDefault ? projects : category.projects;
        return (
          <>
            <Title level={4}>{category.name}</Title>
            {categoryProjects.forEach((project: Project) => {
              let score = 0;
              let numJudged = 0;
              const judges = new Set();
              let editButton;
              category.criterias.forEach((criteria: Criteria) => {
                criteria.ballots.forEach((ballot: Ballot) => {
                  if (ballot.projectId === project.id) {
                    score += ballot.score;

                    // TODO: temporary fix for hackgt 9 for duplicate userId, need to revert back
                    numJudged += 1;
                  }
                });
              });

              const winnerButton = (
                <Button
                  type="primary"
                  onClick={() => {
                    showConfirm(project, category);
                  }}
                >
                  Make Winner
                </Button>
              );

              data.push({
                id: project.id,
                name: project.name,
                devpostURL: <a href={project.devpostUrl}>{project.name}</a>,
                average: numJudged > 0 ? score / numJudged : 0,
                numJudged,
                editScore: editButton,
                makeWinner: winnerButton,
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
