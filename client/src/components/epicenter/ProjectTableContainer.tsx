import React from "react";
import { Space, Typography } from "antd";
import useAxios from "axios-hooks";

import ProjectTable from "./ProjectTable";
import { Project } from "../../types/Project";
import { Ballot } from "../../types/Ballot";

const { Title } = Typography;

interface Props {
  projects: Project[]
  isSponsor: boolean;
}

const ProjectTableContainer: React.FC<Props> = props => (
    <div>
      {props.projects.map((project: Project) => {
        const generateData = (categoryId: number) => {
          const data: any = {};
          let total = 0;
          project.ballots.forEach((ballot: Ballot) => {
            if (ballot.criteria.categoryId === categoryId) {
              data[ballot.user.name] = (data[ballot.user.name] || 0) + ballot.score;
              total += ballot.score;
            }
          });
          const newData = Object.entries(data).map(e => ({ judge: e[0], total: e[1] }));
          newData.push({ judge: "Average", total: Math.round((total / newData.length) * 10) / 10 });
          return newData;
        };

        return (
          <div key={project.id}>
            <Title key={project.id} level={4}>{props.isSponsor ? `Project Name: ${project.name}`:`${project.id} - ${project.name}`}</Title>
            <>
              {project.categories.map((category: any) => (
                <>
                  <Title level={5} key={category.id}>
                    {category.name}
                  </Title>
                  <ProjectTable data={generateData(category.id)} />
                </>
              ))}
            </>
            <br />
          </div>
        );
      })}
    </div>
  );

export default ProjectTableContainer;