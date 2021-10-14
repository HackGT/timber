import React, { useState } from "react";
import useAxios from "axios-hooks";
import axios from "axios";

import CriteriaCard from "./CriteriaCard";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import { Button, message } from "antd";
import { Criteria } from "../../types/Criteria";
import { handleAxiosError } from "../../util/util";

const JudgingHome: React.FC = () => {
  const [{ data, loading, error }] = useAxios("/assignments/current-project");
  const [projectScores, setProjectScores] = useState({});

  const onSubmit = async () => {
    const hide = message.loading("Loading...", 0);
    const ballots: any = {
      criterium: projectScores, 
      round: data.round, 
      projectId: data.id,
    }
    

    try {
      await axios.post("/ballots", ballots)
      await axios.patch(`/assignments/${data.assignmentId}`, {data: {status: "COMPLETED"}})
      hide();
      window.location.reload();
    } catch (err: any) {
      hide();
      handleAxiosError(err);
    }
  };

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (data.length === 0) {
    return <p>You have no projects queued!</p>;
  }

  const criteriaArray: any = [];
  data.categories.forEach((category: any) => {
    category.criterias.map((criteria: any) => criteriaArray.push(criteria));
  });

  if (criteriaArray.length !== Object.keys(projectScores).length) {
    const mapping: any = {}
    criteriaArray.forEach((criteria: Criteria) => {
      mapping[criteria.id] = criteria.minScore
    });
    setProjectScores(mapping)
  }

  function changeScore(value: number, id: number) {
    const objectValue = {
      ...projectScores,
      [id]: value,
    };
    setProjectScores(objectValue);
  }

  return (
    <>
      {criteriaArray.map((criteria: any) => (
        <CriteriaCard {...criteria} changeScore={changeScore}/>
      ))}
      <Button onClick={() => onSubmit()}> Submit </Button>
    </>
  );
};

export default JudgingHome;
