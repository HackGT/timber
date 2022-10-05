import React from "react";
import { Card } from "antd";

interface Props {
    project: string;
    category: string;
    members: string[];
    hackathon: string;
}

const WinnerCard: React.FC<Props> = props => {
    const memberNames = props.members.map((member) =>
        <li>{member}</li>
    );
    return (
        <Card
            title={
                <span style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{props.project}</span>
            }
        >   <p>Category: {props.category}</p>
            <p>Members: {memberNames}</p>
            <p>Hackathon: {props.hackathon}</p>
        </Card>
    );
};

export default WinnerCard;