import React from "react";
import { Typography, Card, Slider } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

interface Props {
  id: number;
  name: string;
  description: string;
  minScore: number;
  maxScore: number;
  categoryId: number;
}

const CriteriaCard: React.FC<Props> = (props) => {
  const hi = "hi";
  // const minScore = props.minScore;
  
  const marks = {
    [props.minScore]: `${props.minScore}`,
    [props.maxScore]: `${props.maxScore}`,
  }
  console.log(props)
  return (
    <div>
      <Card title={props.name}>
        <Paragraph>{props.description}</Paragraph>
        <Slider marks={marks} min={props.minScore} max={props.maxScore} />
      </Card>
    </div>
  );
};

export default CriteriaCard;