import { Typography, Table } from "antd/lib";
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

const { Title } = Typography;

const columns = [
  {
    title: "Project Name",
    render: (row: any) => `${row.id} - ${row.name}`,
    key: "name",
    defaultSortOrder: "ascend" as SortOrder,
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
    sorter: (a: any, b: any) => a.average - b.average,
  },
  {
    title: "Number of Times Judged",
    dataIndex: "numJudged",
    key: "numJudged",
    sorter: (a: any, b: any) => a.numJudged - b.numJudged,
  },
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
              });

              data.push({
                id: project.id,
                name: project.name,
                devpostURL: <a href={project.devpostUrl}>{project.name}</a>,
                average: numJudged > 0 ? score / numJudged : 0,
                numJudged,
                editScore: editButton,
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
