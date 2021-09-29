import React from "react";
import useAxios from "axios-hooks";

import CriteriaCard from "./CriteriaCard";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

const JudgingHome: React.FC = () => {
  const [{ data, loading, error }] = useAxios("/assignments/current-project");

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
  data.forEach((category: any) => {
    category.criterias.map((criteria: any) => criteriaArray.push(criteria));
  });
  console.log(criteriaArray);
  // return <CriteriaCard {...criteriaArray[0]}/>;

  return (
    <>
      {criteriaArray.map((criteria: any) => (
        <CriteriaCard {...criteria} />
      ))}
    </>
  );
};

export default JudgingHome;
