import React, { useEffect, useState } from "react";
import useAxios from "axios-hooks";
import axios from "axios";
import { Button, Popconfirm, message } from "antd";

import CriteriaCard from "./CriteriaCard";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { Criteria } from "../../types/Criteria";
import { handleAxiosError } from "../../util/util";
import CriteriaCardContainer from "./CriteriaCardContainer";

interface Props {
  data: any;
}

const JudgingCardsContainer: React.FC<Props> = props => {
  const [projectScores, setProjectScores] = useState({});
  const [criteriaArray, setCriteriaArray] = useState<any[]>([]);
  const [categoryContainers, setCategoryContainers] = useState([])

  const changeScore = (value: number, id: number) => {
    const objectValue = {
      ...projectScores,
      [id]: value,
    };
    setProjectScores(objectValue);
  };

  useEffect(() => {
    if (!props.data || props.data.length === 0) {
      return;
    }

    const newCriteriaArray: any[] = [];
    const criteriaCards: any = []

    props.data.categories.forEach((category: any) => {
      criteriaCards.push(<CriteriaCardContainer criteriaArray={category.criterias} changeScore={changeScore} categoryName={category.name}/>)

      category.criterias.map((criteria: any) => {
        
        newCriteriaArray.push(criteria)
      });
    });

    const mapping: any = {};
    newCriteriaArray.forEach((criteria: Criteria) => {
      mapping[criteria.id] = criteria.minScore;
    });

    setCriteriaArray(newCriteriaArray);
    setProjectScores(mapping);
    setCategoryContainers(criteriaCards)
  }, [props.data, setCriteriaArray, setProjectScores, setCategoryContainers]);

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
      window.location.reload();
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
      window.location.reload();
    } catch (err: any) {
      hide();
      handleAxiosError(err);
    }
  };

  

  // const renderCategoryContainers = (cToCMapping: any) => {
  //   const categoryContainerArr = []
  //   for (const key of Object.keys(cToCMapping)) {
  //         }
  //   return categoryContainerArr;
  // }

  return (
    <>
      {/* {criteriaArray.map((criteria: any) => (
        <CriteriaCard criteria={criteria} changeScore={changeScore} />
      ))} */}
      {categoryContainers}
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
