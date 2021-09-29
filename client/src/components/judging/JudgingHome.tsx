import React from "react";
import useAxios from "axios-hooks";
import HexLabsCard from "./HexLabsCard"

const JudgingHome: React.FC = () => {
  const hi = "hi";
  const [{ data, loading, error}] = useAxios('/assignments/current-project');
  
  if (loading) {
    return <p>Loading...</p>
  }
  if (error) {
    return <p>Error!</p>
  }
  if (data.length === 0) {
    return <p>You have no projects queued!</p>
  }
  const criteriaArray: any= [];
  data.forEach((category: any) => {
    category.criterias.map((criteria: any) => criteriaArray.push(criteria));
  });
  console.log(criteriaArray)
  // return <CriteriaCard {...criteriaArray[0]}/>;
  return <>
    {criteriaArray.map((criteria: any) => <HexLabsCard {...criteria} />)}
  </>;
};

export default JudgingHome;
