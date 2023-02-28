import React from "react";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const NotFoundDisplay: React.FC = () => (
  <Result
    status="404"
    title="404 Error"
    subTitle="Oops! Seems like the page you're looking for doesn't exist."
    extra={
      <Link to="/">
        <Button type="primary">Return Home</Button>
      </Link>
    }
  />
);

export default NotFoundDisplay;
