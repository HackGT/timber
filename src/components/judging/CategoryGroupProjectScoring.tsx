import React, { useEffect, useState } from "react";
import axios from "axios";
import useAxios from "axios-hooks";
import {
  Button,
  Card,
  Empty,
  Input,
  InputNumber,
  Select,
  Slider,
  Spin,
  Typography,
  message,
} from "antd";
import { apiUrl, Service } from "@hex-labs/core";

import ErrorDisplay from "../../displays/ErrorDisplay";
import { Category } from "../../types/Category";
import { CategoryGroup } from "../../types/CategoryGroup";
import { Project } from "../../types/Project";
import { handleAxiosError, HG13_TMP_spoofTableNumber } from "../../util/util";
import { User } from "../../types/User";
import { TableGroup } from "../../types/TableGroup";
import { useCurrentHexathon } from "../../contexts/CurrentHexathonContext";

const { Paragraph, Text, Title } = Typography;
const { Search } = Input;

type ScoreMap = Record<number, Record<number, number>>;

interface Props {
  user: User;
}

const CategoryGroupProjectScoring: React.FC<Props> = ({ user }) => {
  const categoryGroups = user.categoryGroups || [];
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(categoryGroups[0]?.id);
  const [projects, setProjects] = useState<Project[]>([]);
  const [scores, setScores] = useState<ScoreMap>({});
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [savingProjectId, setSavingProjectId] = useState<number | null>(null);
  const { currentHexathon } = useCurrentHexathon();
  const [{ data: tableGroupsData }] = useAxios<TableGroup[]>({
    url: apiUrl(Service.EXPO, "/table-groups"),
    params: { hexathon: currentHexathon?.id },
  });

  const getTableGroupName = (project: Project) =>
    project.tableGroup?.name ??
    tableGroupsData?.find(tableGroup => tableGroup.id === project.tableGroupId)?.name;

  const selectedGroup = categoryGroups.find(
    (categoryGroup: CategoryGroup) => categoryGroup.id === selectedGroupId
  );

  useEffect(() => {
    if (!selectedGroupId) {
      setProjects([]);
      return undefined;
    }

    let active = true;
    setLoading(true);
    setError(null);

    axios
      .get(apiUrl(Service.EXPO, `/projects/special/category-group/${selectedGroupId}`))
      .then(response => {
        if (active) {
          setProjects(response.data);
        }
      })
      .catch(requestError => {
        if (active) {
          setError(requestError);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [selectedGroupId]);

  const getProjectCategories = (project: Project) => {
    const categoryIds = new Set(selectedGroup?.categories.map(category => category.id));
    return project.categories.filter(
      (category: Category) => categoryIds.has(category.id) && category.judgedExternally !== true
    );
  };

  useEffect(() => {
    setScores(previousScores => {
      const nextScores = { ...previousScores };

      projects.forEach(project => {
        const projectScores = { ...(nextScores[project.id] || {}) };
        getProjectCategories(project).forEach(category => {
          category.criterias.forEach(criteria => {
            if (projectScores[criteria.id] === undefined) {
              const existingBallot = project.ballots.find(
                ballot => ballot.criteriaId === criteria.id && ballot.userId === +user.id
              );
              projectScores[criteria.id] = existingBallot?.score ?? criteria.minScore;
            }
          });
        });
        nextScores[project.id] = projectScores;
      });

      return nextScores;
    });
  }, [projects, selectedGroupId]);

  const changeScore = (projectId: number, criteriaId: number, value: number) => {
    setScores(previousScores => ({
      ...previousScores,
      [projectId]: {
        ...previousScores[projectId],
        [criteriaId]: value,
      },
    }));
  };

  const saveScores = async (project: Project) => {
    const projectScores = scores[project.id] || {};
    setSavingProjectId(project.id);

    try {
      await axios.post(apiUrl(Service.EXPO, "/ballots"), {
        criterium: projectScores,
        round: project.round,
        projectId: project.id,
        userId: +user.id,
      });
      message.success(`Scores saved for ${project.name}`);
    } catch (requestError: any) {
      handleAxiosError(requestError);
    } finally {
      setSavingProjectId(null);
    }
  };

  if (categoryGroups.length === 0) {
    return null;
  }

  const filteredProjects = projects.filter(project => {
    const query = searchText.trim().toLowerCase();
    return (
      query === "" ||
      project.name.toLowerCase().includes(query) ||
      String(project.id).includes(query) ||
      project.members.some(member => member.name.toLowerCase().includes(query))
    );
  });

  return (
    <section>
      <Title level={2}>Category Group Projects</Title>
      <Paragraph>
        Score projects in your assigned category groups. These scores are saved separately from the
        queued judging assignments.
      </Paragraph>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <Select
          aria-label="Category group"
          value={selectedGroupId}
          options={categoryGroups.map(categoryGroup => ({
            label: categoryGroup.name,
            value: categoryGroup.id,
          }))}
          onChange={value => setSelectedGroupId(value)}
          style={{ minWidth: 240 }}
        />
        <Search
          aria-label="Search projects"
          placeholder="Search projects"
          allowClear
          value={searchText}
          onChange={event => setSearchText(event.target.value)}
          style={{ maxWidth: 360 }}
        />
      </div>

      {loading && <Spin />}
      {error && <ErrorDisplay error={error} />}
      {!loading && !error && filteredProjects.length === 0 && (
        <Empty description="No projects found" />
      )}

      {!loading &&
        !error &&
        filteredProjects.map(project => {
          const projectCategories = getProjectCategories(project);
          return (
            <Card
              key={project.id}
              title={`${project.name} (#${project.id})`}
              extra={
                <Button
                  type="primary"
                  loading={savingProjectId === project.id}
                  disabled={projectCategories.length === 0}
                  onClick={() => saveScores(project)}
                >
                  Save Scores
                </Button>
              }
              style={{ marginBottom: 16 }}
            >
              <Text type="secondary">
                Table {HG13_TMP_spoofTableNumber(project.table, getTableGroupName(project))} | Expo {project.expo} | Round {project.round}
              </Text>
              {project.devpostUrl && (
                <div>
                  <a href={project.devpostUrl} target="_blank" rel="noreferrer">
                    Devpost Submission
                  </a>
                </div>
              )}
              {projectCategories.length === 0 ? (
                <Paragraph type="secondary">
                  No judgeable categories are assigned to this project.
                </Paragraph>
              ) : (
                projectCategories.map(category => (
                  <div key={category.id}>
                    <Title level={4}>{category.name}</Title>
                    {category.criterias.map(criteria => {
                      const value = scores[project.id]?.[criteria.id] ?? criteria.minScore;
                      return (
                        <div key={criteria.id} style={{ marginBottom: 16 }}>
                          <Text strong>{criteria.name}</Text>
                          <Paragraph type="secondary">{criteria.description}</Paragraph>
                          <Slider
                            min={criteria.minScore}
                            max={criteria.maxScore}
                            value={value}
                            onChange={nextValue =>
                              changeScore(project.id, criteria.id, nextValue as number)
                            }
                          />
                          <InputNumber
                            min={criteria.minScore}
                            max={criteria.maxScore}
                            value={value}
                            onChange={nextValue =>
                              nextValue !== null && changeScore(project.id, criteria.id, nextValue)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </Card>
          );
        })}
    </section>
  );
};

export default CategoryGroupProjectScoring;
