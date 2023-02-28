import React from 'react';
import CriteriaCard from './CriteriaCard';
import { Typography} from "antd";

const { Title } = Typography;

interface Props {
  criteriaArray: any[];
  changeScore: (value: number, id: number) => void;
  categoryName: string;
}

const CriteriaCardContainer: React.FC<Props> = props => (
    <div>
      <Title level={3}>{props.categoryName}</Title>
      {props.criteriaArray.map((criteria: any) => (
      <CriteriaCard criteria={criteria} changeScore={props.changeScore} />
    ))}
    </div>
  )

export default CriteriaCardContainer;