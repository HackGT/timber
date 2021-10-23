import { Typography, Table } from "antd/lib";
import useAxios from "axios-hooks";
import React, { useEffect } from "react";

import LoadingDisplay from "../../displays/LoadingDisplay";
import { Category } from "../../types/Category";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";
import { Criteria } from "../../types/Criteria";

const { Title } = Typography;

const columns = [
  {
    title: "Project",
    dataIndex: "project",
    key: "project",
  },
  {
    title: "Average Score",
    dataIndex: "average",
    key: "average",
  },
  {
    title: "Number of Times Judged",
    dataIndex: "numJudged",
    key: "numJudged",
  },
];

const Ranking = () => {
  const [{ data: categoryData, loading: categoryLoading, error: categoryError }] =
    useAxios("/categories");
  const [{ data: ballotData, loading: ballotLoading, error: ballotError }] = useAxios("/ballots");

  return (
    <div>
      {categoryLoading || ballotLoading ? (
        <LoadingDisplay />
      ) : (
        <>
          {categoryData.map((category: Category) => {
            const categoryId = category.id;
            const data: any = [];
            return (
              <>
                <Title level={4}>{category.name}</Title>
                {category.projects.map((project: Project) => {
                  let score = 0;
                  let number = 0;
                  let ballotsNumber = 0;
                  const judges = new Set();
                  category.criterias.forEach((criteria: Criteria) => {
                    criteria.ballots.forEach((ballot: Ballot) => {
                      if (ballot.projectId === project.id) {
                        score += ballot.score;
                        ballotsNumber++;
                        if (!judges.has(ballot.userId)) {
                          number++;
                          judges.add(ballot.userId);
                        }
                      }
                    });
                  });
                  data.push({
                    project: project.name,
                    average: score / ballotsNumber,
                    numJudged: number,
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
      )}
    </div>
  );
};

export default Ranking;