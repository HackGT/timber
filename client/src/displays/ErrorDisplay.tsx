import React from "react";
import { Button, Result } from "antd";

interface Props {
  error: Error | undefined;
}

const ErrorDisplay: React.FC<Props> = props => {
  try {
    console.error(JSON.parse(JSON.stringify(props.error)));
  } catch {
    console.error(props.error);
  }

  return (
    <Result
      status="error"
      title="Something Went Wrong :("
      subTitle={props.error?.message}
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      }
    />
  );
};

export default ErrorDisplay;
