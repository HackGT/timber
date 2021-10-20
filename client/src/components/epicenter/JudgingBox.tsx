import { Button, Popover, Tag, Typography } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { Ballot } from "../../types/Ballot";
import { Project } from "../../types/Project";
import { handleAxiosError } from "../../util/util";
import { Category } from "../../types/Category";

const { Title, Text } = Typography;

interface Props {
  key: number;
  project: Project;
}

const JudgingBox: React.FC<Props> = props => {
  const [expo, setExpo] = useState(props.project.expo);
  const [round, setRound] = useState(props.project.round);
  const [scoreData, setScoreData] = useState({});

  const decrementRound = async () => {
    axios
      .patch(`/projects/${props.project.id}`, {
        round: round - 1,
      })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        handleAxiosError(err);
      });
    setRound(round - 1);
  };

  const incrementRound = async () => {
    axios
      .patch(`/projects/${props.project.id}`, {
        round: round + 1,
      })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        handleAxiosError(err);
      });
    setRound(round + 1);
  };

  const decrementExpo = async () => {
    axios
      .patch(`/projects/${props.project.id}`, {
        expo: expo - 1,
      })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        handleAxiosError(err);
      });
    setExpo(expo - 1);
  };

  const incrementExpo = async () => {
    axios
      .patch(`/projects/${props.project.id}`, {
        expo: expo + 1,
      })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        handleAxiosError(err);
      });
    setExpo(expo + 1);
  };

  const generateScoreData = () => {
    const data: any = {};
    props.project.categories.forEach((category: Category) => {
      data[category.name] = {};
      props.project.ballots.forEach((ballot: Ballot) => {
        if (ballot.criteria.categoryId === category.id) {
          data[category.name][ballot.user.name] =
            (data[category.name][ballot.user.name] || 0) + ballot.score;
        }
      });
    });
    setScoreData(data);
  };

  useEffect(() => {
    generateScoreData();
  }, []);

  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Title level={5}>{props.project.name}</Title>
      <a href={props.project.devpostUrl} target="_blank" rel="noreferrer">
        {props.project.devpostUrl}
      </a>
      <div>
        {props.project.categories.map(category => (
          <Tag>{category.name}</Tag>
        ))}
      </div>
      <>
        {Object.entries(scoreData).map((category: any) => {
          let scoreString = "";
          Object.entries(category[1]).map(score => {
            if (scoreString !== "") {
              scoreString = `${scoreString}, ${score[1]}`;
            } else {
              scoreString = `${score[1]}`;
            }
          });
          return <Text>{`${category[0]}: ${scoreString}`}</Text>;
        })}
      </>
      <a href={props.project.devpostUrl} target="_blank" rel="noreferrer">
        Join Meeting Room
      </a>
      <Text>Change Round</Text>
      <div>
        <Button disabled={round === 1} onClick={decrementRound}>
          Move Back 1
        </Button>
        <Button style={{ marginLeft: "10px" }} onClick={incrementRound}>
          Move Up 1
        </Button>
      </div>
      <Text>Change Expo</Text>
      <div>
        <Button disabled={expo === 1} onClick={decrementExpo}>
          Move Back 1
        </Button>
        <Button style={{ marginLeft: "10px" }} onClick={incrementExpo}>
          Move Up 1
        </Button>
      </div>
    </div>
  );

  return (
    <Popover content={content} key={props.key} placement="bottom">
      <div className="judging-boxes">
        <div className="judging-box-top-row">
          <p>E:{expo}</p>
          <p>R:{round}</p>
        </div>
        <p className="judging-box-project-id">P{props.project.id}</p>
      </div>
    </Popover>
  );
};

export default JudgingBox;
