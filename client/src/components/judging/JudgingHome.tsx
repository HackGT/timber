import useAxios from "axios-hooks";
import React from "react";

import ErrorDisplay from "../../displays/ErrorDisplay";
import LoadingDisplay from "../../displays/LoadingDisplay";
import DailyWindow from "../video/DailyWindow";
import JudgingCardsContainer from "./JudgingCardsContainer";

interface Props {
  user: any;
}

const JudgingHome: React.FC<Props> = props => {
  const [{ data, loading, error }] = useAxios("/assignments/current-project");

  if (!props.user.categoryGroupId) {
    return (
      <p>
        Please ask a HexLabs team member to assign you a category group before you start judging.
      </p>
    );
  }

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  if (data.length === 0) {
    return <p>You have no projects queued!</p>;
  }

  return (
    <>
      <h1>Project Name: {data.name}</h1>
      <a href={data.devpostUrl} target="_blank" rel="noreferrer">
        Devpost Submission
      </a>
      <DailyWindow videoUrl={data.roomUrl} />
      <JudgingCardsContainer data={data} />
    </>
  );
};

export default JudgingHome;
