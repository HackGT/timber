import { Card, Button } from "antd";
import React from "react";

interface Props {
  category: any;
  openModal: (values: any) => void;
}

const CategoryCard: React.FC<Props> = ({ category, openModal }) => (
  <Card
    title={category.name}
    extra={
      <Button type="text" size="small" onClick={() => openModal(category)}>
        Edit
      </Button>
    }
  >
    <p>{category.description}</p>
    {category.criterias.map((criteria: any) => (
      <Card size="small" type="inner" title={criteria.name}>
        {criteria.description}
        <br />
        Scored: {criteria.minScore} - {criteria.maxScore}
      </Card>
    ))}
  </Card>
);

export default CategoryCard;
