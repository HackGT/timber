import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Popconfirm, message, Modal } from "antd";

import { Criteria } from "../../types/Criteria";
import { handleAxiosError } from "../../util/util";
import CriteriaCardContainer from "./CriteriaCardContainer";
import { apiUrl, Service } from "@hex-labs/core";

interface Props {
  data: any;
}
const JudgingCardsContainer: React.FC<Props> = props => {
  const [projectScores, setProjectScores] = useState({});
  const [categoryToCriteriaMapping, setCategoryToCriteriaMapping] = useState({});

  useEffect(() => {
    if (!props.data[0] || props.data[0].length === 0) {
      return;
    }
    console.log(props.data[0]);

    const newCriteriaArray: any[] = [];
    const newCategoryToCriteriaMapping: any = {};

    props.data[0].categories.forEach((category: any) => {
      category.criterias.forEach((criteria: any) => {
        newCriteriaArray.push(criteria);
        if (newCategoryToCriteriaMapping[category.name]) {
          newCategoryToCriteriaMapping[category.name].push(criteria);
        } else {
          newCategoryToCriteriaMapping[category.name] = [criteria];
        }
      });
    });

    const mapping: any = {};
    newCriteriaArray.forEach((criteria: Criteria) => {
      mapping[criteria.id] = criteria.minScore;
    });

    setProjectScores(mapping);
    setCategoryToCriteriaMapping(newCategoryToCriteriaMapping);
  }, [props.data[0], setProjectScores, setCategoryToCriteriaMapping]);

  const onSubmit = async () => {
    const hide = message.loading("Loading...", 0);
    const ballots: any = {
      criterium: projectScores,
      round: props.data[0].round,
      projectId: props.data[0].id,
    };
    try {
      await axios.post(apiUrl(Service.EXPO, "/ballots"), ballots);
      await axios.patch(apiUrl(Service.EXPO, `/assignments/${props.data[0].assignmentId}`), {
        data: { status: "COMPLETED" },
      });
      hide();

      Modal.info({
        title: "Notification",
        okText: "I'm Here",
        content: props.data[1],

        onOk() {
          window.location.reload();
        },
      });
    } catch (err: any) {
      hide();
      handleAxiosError(err);
    }
  };
  const onSkip = async () => {
    const hide = message.loading("Loading...", 0);
    try {
      await axios.patch(apiUrl(Service.EXPO, `/assignments/${props.data[0].assignmentId}`), {
        data: { status: "SKIPPED" },
      });
      hide();
      Modal.info({
        title: "Notification",
        okText: "I'm Here",
        content: props.data[1],

        onOk() {
          window.location.reload();
        },
      });
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
    const categoryContainerArr = [];
    for (const key of Object.keys(cToCMapping)) {
      categoryContainerArr.push(
        <CriteriaCardContainer
          criteriaArray={cToCMapping[key]}
          changeScore={changeScore}
          categoryName={key}
        />
      );
    }
    return categoryContainerArr;
  };

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
          title="Are you sure that the project is not there?"
          onConfirm={onSkip}
          okText="Yes"
          cancelText="No"
        >
          <Button>This Project Is Not Here</Button>
        </Popconfirm>
      </div>
    </>
  );
};
export default JudgingCardsContainer;
