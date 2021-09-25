import { Card } from "antd";
import useAxios from "axios-hooks";
import React from "react";

import ErrorDisplay from "../../../displays/ErrorDisplay";
import LoadingDisplay from "../../../displays/LoadingDisplay";

const CategoryList: React.FC = () => {
  const [{ data, loading, error }] = useAxios("/categories");

  if (loading) {
    return <LoadingDisplay />;
  }

  if (error) {
    return <ErrorDisplay error={error} />;
  }

  return (
    <>
      <h1>Categories</h1>
      {data.map((category: any) => (
        <Card title={category.name}>
          <p>{category.description}</p>
          {category.criterias.map((criteria: any) => (
            <Card size="small" type="inner" title={criteria.name}>
              {criteria.description}
              <br />
              Scored: {criteria.minScore} - {criteria.maxScore}
            </Card>
          ))}
        </Card>
      ))}
    </>
  );
};

export default CategoryList;
