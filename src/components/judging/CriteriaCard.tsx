import React from "react";
import { Typography, Card, Slider } from "antd";
import { Badge } from "@chakra-ui/react";

const { Paragraph } = Typography;

interface Props {
  criteria: any;
  changeScore: (value: number, id: number) => void;
  currScore: string;
}

const CriteriaCard: React.FC<Props> = props => {
  const marks = {
    [props.criteria.minScore]: `${props.criteria.minScore}`,
    [props.criteria.maxScore]: `${props.criteria.maxScore}`,
  };

  return (
    <div>
      <Card hoverable title={props.criteria.name} size="small" style={{ maxWidth: "500px" }}>
        <Paragraph>{props.criteria.description} <Badge colorScheme="blue" variant="subtle">
          {props.currScore}
        </Badge></Paragraph>

        <Slider
          marks={marks}
          min={props.criteria.minScore}
          max={props.criteria.maxScore}
          onChange={(value: any) => props.changeScore(value, props.criteria.id)}
        />
      </Card>
      <br />
    </div>
  );
};

export default CriteriaCard;
