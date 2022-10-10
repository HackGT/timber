import React from "react";
import { Card, Tag, Divider } from "antd";
import { Project } from "../../types/Project";
import { User } from "../../types/User";
import { Category } from "../../types/Category";
import { Hackathon } from "../../types/Hackathon";


interface Props {
    project: Project;
    category: Category;
    members: User[];
    hackathon: Hackathon;
}

// category use a preset tag

const WinnerCard: React.FC<Props> = props => {
    const memberNames = props.members.map((member) =>
        <li>{member}</li>
    );
    console.log(props);
    return (
        <Card title={<span style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{props.project.name}</span>}>   

        <b>Category:</b> <Tag color="blue">{props.category.name}</Tag>
        <Divider />

        <b>Members</b>
        <p>{props.members.map((member) =>
            <li>{member.name}</li>
        )}</p>
        <Divider />

        <p><b>Hackathon:</b> {props.hackathon.name}</p>


        </Card>
    );
};

export default WinnerCard;