/* eslint-disable react/jsx-no-useless-fragment */
import { Typography, Table, Button, Modal, message } from "antd/lib";
import useAxios from "axios-hooks";
import React from "react";
import { SortOrder } from "antd/lib/table/interface";
import { AnyRecord } from "dns";
import { Link } from "react-router-dom";
import { apiUrl, ErrorScreen, Service } from "@hex-labs/core";
import axios from "axios";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import LoadingDisplay from "../../displays/LoadingDisplay";
import { Category } from "../../types/Category";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";
import { Criteria } from "../../types/Criteria";
import ErrorDisplay from "../../displays/ErrorDisplay";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";

const { Title } = Typography;

const columns = [
  {
    title: "Project Name",
    render: (row: any) => (
      <>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {row.id} - {row.name}
          {row.devpostURL}
        </div>
      </>
    ),
    key: "name",
    sorter: {
      compare: (a: any, b: any) => a.name.localeCompare(b.name),
      multiple: 1,
    }
  },
  // {
  //   title: "DevPost URL",
  //   dataIndex: "devpostURL",
  //   key: "devpostURL",
  //   sorter: (a: any, b: any) => a.devpostURL.localeCompare(b.devpostURL),
  // },
  {
    title: "Average Score",
    dataIndex: "average",
    key: "average",
    defaultSortOrder: "descend" as SortOrder,
    sorter: {
      compare: (a: any, b: any) => a.average - b.average,
      multiple: 4,
    }
  },
  {
    title: "Median Score",
    dataIndex: "median",
    key: "median",
    defaultSortOrder: "descend" as SortOrder,
    sorter: {
      compare: (a: any, b: any) => a.median - b.median,
      multiple: 3,
    },
  },
  {
    title: "Normalized Score",
    dataIndex: "normalized",
    key: "normalized",
    defaultSortOrder: "descend" as SortOrder,
    sorter: {
      compare: (a: any, b: any) => a.normalized - b.normalized,
      multiple: 5,
    }
  },
  {
    title: "Number of Times Judged",
    dataIndex: "numJudged",
    key: "numJudged",
    sorter: {
      compare: (a: any, b: any) => a.numJudged - b.numJudged,
      multiple: 2,
    }
  },
  {
    title: "Make Winner",
    dataIndex: "makeWinner",
    key: "makeWinner",
  },
];

const RankingTable = () => {
  const CurrentHexathonContext = useCurrentHexathon();
  const { currentHexathon } = CurrentHexathonContext;

  const [{ data: projectScores, loading: projectScoresLoading, error: projectScoresError }] =
    useAxios({
      method: "GET",
      url: apiUrl(Service.EXPO, "/projects/special/calculate-normalized-scores"),
    });

  const [{ data: categoryData, loading: categoryLoading, error: categoryError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/categories"),
    params: {
      hexathon: currentHexathon?.id,
    },
  });

  const [{ loading: projectsLoading, data: projects, error: projectsError }] = useAxios({
    method: "GET",
    url: apiUrl(Service.EXPO, "/projects"),
    params: {
      hexathon: currentHexathon?.id,
    },
  });

  if (categoryLoading || projectsLoading || projectScoresLoading) {
    return <LoadingDisplay />;
  }

  if (categoryError || projectsError || projectScoresError) {
    return <ErrorDisplay error={categoryError || projectsError || projectScoresError} />;
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
        .post(apiUrl(Service.EXPO, `/winners`), { data: newWinner })
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
              let projectScore = 0;
              const allScores: number[] = [];
              let numJudged = 0;
              let editButton;
              const judgesSet = new Set<number>();
              category.criterias.forEach((criteria: Criteria) => {
                criteria.ballots.forEach((ballot: Ballot) => {
                  if (ballot.projectId === project.id) {
                    projectScore += ballot.score;
                    allScores.push(ballot.score);

                    if (!judgesSet.has(ballot.userId)) {
                      judgesSet.add(ballot.userId);
                      numJudged += 1;
                    }
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

              function calculateMedian(allScores: number[]): number {
                const sortedList = [...allScores].sort((a, b) => a - b);
                let median = 0;
                const mid = Math.floor(sortedList.length / 2);
                if (sortedList.length % 2 === 0) {
                  median = (sortedList[mid - 1] + sortedList[mid]) / 2;
                } else {
                  median = sortedList[mid];
                }
                return median;
              }

              data.push({
                id: project.id,
                name: project.name,
                devpostURL: (
                  <a href={project.devpostUrl} style={{ paddingRight: "10px" }}>
                    View Devpost
                  </a>
                ),
                average:
                  numJudged > 0 ? parseFloat((projectScore / allScores.length).toFixed(1)) : 0,
                median: numJudged > 0 ? calculateMedian(allScores) : 0,
                normalized:
                  numJudged > 0 && project.id in projectScores ? projectScores[project.id] : 0,
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
