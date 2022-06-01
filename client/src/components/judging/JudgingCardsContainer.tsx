import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Popconfirm, message } from "antd";

import { Criteria } from "../../types/Criteria";
import { handleAxiosError } from "../../util/util";
import CriteriaCardContainer from "./CriteriaCardContainer";

interface Props {
  data: any;
  displayIntermediary: () => void;
  refetchCurrentProject: () => void;
}
const JudgingCardsContainer: React.FC<Props> = props => {
  const [projectScores, setProjectScores] = useState({});
  const [categoryToCriteriaMapping, setCategoryToCriteriaMapping] = useState({})

  useEffect(() => {
    if (!props.data || props.data.length === 0) {
      return;
    }

    const newCriteriaArray: any[] = [];
    const newCategoryToCriteriaMapping: any = {}

    props.data.categories.forEach((category: any) => {
      category.criterias.forEach((criteria: any) => {
        newCriteriaArray.push(criteria)
        if (newCategoryToCriteriaMapping[category.name]) {
          newCategoryToCriteriaMapping[category.name].push(criteria)
        } else {
          newCategoryToCriteriaMapping[category.name] = [criteria]
        }
      });
    });

    const mapping: any = {};
    newCriteriaArray.forEach((criteria: Criteria) => {
      mapping[criteria.id] = criteria.minScore;
    });

    setProjectScores(mapping);
    setCategoryToCriteriaMapping(newCategoryToCriteriaMapping)
  }, [props.data, setProjectScores, setCategoryToCriteriaMapping]);

  const onSubmit = async () => {
    const hide = message.loading("Loading...", 0);
    const ballots: any = {
      criterium: projectScores,
      round: props.data.round,
      projectId: props.data.id,
    };
    try {
      await axios.post("/ballots", ballots);
      await axios.patch(`/assignments/${props.data.assignmentId}`, {
        data: { status: "COMPLETED" },
      });
      hide();
      props.displayIntermediary();
      props.refetchCurrentProject();
    } catch (err: any) {
      hide();
      handleAxiosError(err);
    }
  };
  const onSkip = async () => {
    const hide = message.loading("Loading...", 0);
    try {
      await axios.patch(`/assignments/${props.data.assignmentId}`, { data: { status: "SKIPPED" } });
      hide();
      props.displayIntermediary();
      props.refetchCurrentProject();
    } catch (err: any) {
      hide();
      handleAxiosError(err);
    }
  };
  const changeScore = (value: number, id: number) => {
    const objectValue = {
      ...projectScores,
      [id]: value,
    };
    setProjectScores(objectValue);
  };

  const renderCategoryContainers = (cToCMapping: any) => {
    const categoryContainerArr = []
    for (const key of Object.keys(cToCMapping)) {
      categoryContainerArr.push(<CriteriaCardContainer criteriaArray={cToCMapping[key]} changeScore={changeScore} categoryName={key}/>)
    }
    return categoryContainerArr;
  }

  return (
    <>
      {renderCategoryContainers(categoryToCriteriaMapping)}
      <div style={{ marginTop: "15px" }}>
        <Popconfirm
          placement="right"
          title="Are you sure you want to submit these scores?"
          onConfirm={onSubmit}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" style={{ marginRight: "10px" }}>
            Submit
          </Button>
        </Popconfirm>
        <Popconfirm
          placement="right"
          title="Are you sure you want to skip this project?"
          onConfirm={onSkip}
          okText="Yes"
          cancelText="No"
        >
          <Button>Skip</Button>
        </Popconfirm>
      </div>
    </>
  );
};
export default JudgingCardsContainer;
