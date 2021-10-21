import { Typography, Table, Button } from "antd/lib";
import useAxios from "axios-hooks";
import React, { useEffect, useState } from "react";

import LoadingDisplay from "../../displays/LoadingDisplay";
import { Category } from "../../types/Category";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";
import { Criteria } from "../../types/Criteria";
import RankingEditFormModal from "./RankingEditFormModal";
import { ModalState } from "../../util/FormModalProps";

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
  {
    title: "Edit Score",
    dataIndex: "editScore",
    key: "editScore",
  },
];

const Ranking = () => {
  const [{ data: categoryData, loading: categoryLoading, error: categoryError }] =
    useAxios("/categories");
  const [{ data: ballotData, loading: ballotLoading, error: ballotError }] = useAxios("/ballots");

  const [modalState, setModalState] = useState({
    visible: false,
    initialValues: null,
  } as ModalState);

  // TODO: Update to match ballot info
  const openModal = (values: any) => {
    const newCategories = values.categories.map((category: any) => category.name);
    console.log(values);
    setModalState({
      visible: true,
      initialValues: { ...values, categories: newCategories },
    });
  };

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
                  let editButton;
                  category.criterias.forEach((criteria: Criteria) => {
                    criteria.ballots.forEach((ballot: Ballot) => {
                      if (ballot.projectId === project.id) {
                        score += ballot.score;
                        ballotsNumber++;
                        // editButton = (<Button type="primary">Edit<Button/>);
                        editButton = score;
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
                    editScore: (
                      <Button type="primary" onClick={() => openModal(ballot)}>
                        Edit
                      </Button>
                    ),
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
