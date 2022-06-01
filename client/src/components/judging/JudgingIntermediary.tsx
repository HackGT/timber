import React from "react";
import { Typography, Button } from "antd";

const { Paragraph } = Typography;

interface Props {
  hideIntermediary: () => void;
}

const JudgingIntermediary: React.FC<Props> = props => {
  const marks = {
    
  };

  return (
    <div>
      <Button onClick={props.hideIntermediary}>Click Here!</Button>
    </div>
  );
};

export default JudgingIntermediary;