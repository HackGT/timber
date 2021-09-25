import React, { useState } from "react";
import { Steps, Typography } from "antd";
import useAxios from "axios-hooks";

import TeamInfoForm from "./form/TeamInfoForm";
import PrizeInfoForm from "./form/PrizeInfoForm";
import DevpostInfoForm from "./form/DevpostInfoForm";
import { User } from "../../types/User";
import ResultForm from "./form/ResultForm";
import ReviewForm from "./form/ReviewForm";
import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";

const { Title } = Typography;
const { Step } = Steps;

interface Props {
  user: User;
}

const SubmissionFormContainer: React.FC<Props> = props => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState<any>({});

  const [{ data, loading, error }] = useAxios("/config");

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  const submissionsOpen = data.isProjectSubmissionOpen;

  const nextStep = () => {
    if ([0, 1, 2, 3].includes(current)) {
      setCurrent(current + 1);
    }
  };

  const prevStep = () => {
    if ([1, 2, 3].includes(current)) {
      setCurrent(current - 1);
    }
  };

  // Ensures that all the data isn't overwritten, just the changed portions
  const updateData = (updatedData: any) => {
    setFormData({
      ...formData,
      ...updatedData,
    });
  };

  const renderComponent = () => {
    switch (current) {
      case 0:
        return (
          <TeamInfoForm
            updateData={updateData}
            data={formData}
            user={props.user}
            nextStep={nextStep}
          />
        );
      case 1:
        return (
          <PrizeInfoForm
            updateData={updateData}
            data={formData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 2:
        return (
          <DevpostInfoForm
            updateData={updateData}
            data={formData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 3:
        return (
          <ReviewForm
            updateData={updateData}
            data={formData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      case 4:
        return <ResultForm />;
    }

    return null;
  };

  console.log(formData);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      {submissionsOpen && (
        <div>
          <div>{renderComponent()}</div>
          <Steps current={current} style={{ marginBottom: "16px" }}>
            <Step key={0} title="Team Info" />
            <Step key={1} title="Prize Info" />
            <Step key={2} title="Devpost Info" />
            <Step key={3} title="Review" />
          </Steps>
        </div>
      )}
      {!submissionsOpen && (
        <div>
          <Title level={2}>Create Submission</Title>
          <Title level={5}>Submissions are closed</Title>
        </div>
      )}
    </div>
  );
};

export default SubmissionFormContainer;
