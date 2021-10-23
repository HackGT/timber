import React from "react";
import { Typography, Card, Slider } from "antd";

const { Paragraph } = Typography;

interface Props {
  criteria: any;
  changeScore: (value: number, id: number) => void;
}

const CriteriaCard: React.FC<Props> = props => {
  const marks = {
    [props.criteria.minScore]: `${props.criteria.minScore}`,
    [props.criteria.maxScore]: `${props.criteria.maxScore}`,
  };

  return (
    <div>
      <Card hoverable title={props.criteria.name} size="small" style={{ maxWidth: "500px" }}>
        <Paragraph>{props.criteria.description}</Paragraph>
        <Slider
          marks={marks}
          min={props.criteria.minScore}
          max={props.criteria.maxScore}
          onChange={(value: any) => props.changeScore(value, props.criteria.id)}
        />
      </Card>
    </div>
  );
};

export default CriteriaCard;
