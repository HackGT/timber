import React from "react";
import { Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons/lib";

interface Props {
  label: string;
  helpText: string;
}

const QuestionIconLabel: React.FC<Props> = props => (
  <span>
    {props.label}{" "}
    <Tooltip title={props.helpText}>
      <QuestionCircleOutlined />
    </Tooltip>
  </span>
);

export default QuestionIconLabel;
