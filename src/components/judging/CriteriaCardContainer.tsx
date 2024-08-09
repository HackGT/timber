import React from "react";
import { Typography } from "antd";

import CriteriaCard from "./CriteriaCard";

const { Title } = Typography;

interface Props {
  criteriaArray: any[];
  changeScore: (value: number, id: number) => void;
  categoryName: string;
  projectScores: any;
}

const CriteriaCardContainer: React.FC<Props> = props => (
  <div>
    <Title level={3}>{props.categoryName}</Title>
    {props.criteriaArray.map((criteria: any) => {
      const currScore = props.projectScores[criteria.id];
      return (
        <CriteriaCard criteria={criteria} changeScore={props.changeScore} currScore={currScore} />
      )
    })}
  </div>
);

export default CriteriaCardContainer;
