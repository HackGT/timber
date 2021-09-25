import React from "react";
import { Button, Result } from "antd";
import { SmileOutlined } from "@ant-design/icons/lib";
import { Link } from "react-router-dom";

const ResultForm: React.FC = () => (
  <Result
    icon={<SmileOutlined />}
    title="Great, you finished your submission!"
    extra={
      <Link to="/">
        <Button type="primary">View Dashboard</Button>
      </Link>
    }
  />
);

export default ResultForm;
