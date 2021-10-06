import React, { useEffect } from 'react';
import { Table, Tag, Space, Typography } from 'antd'
import axios from 'axios';
import useAxios from 'axios-hooks';

import ProjectTable from './ProjectTable';
import { Project } from '../../types/Project';
import { Ballot } from '../../types/Ballot';

const { Title } = Typography;

const Dashboard = () => {
    const [{ data: projects, loading: projectLoading, error: projectError }] = useAxios("/projects");

    useEffect(() => {
        console.log(projectLoading);
        console.log(projects[0].ballots);
    }, [projectLoading])

    return (
        <div style={{ marginTop: '30px' }}>
            <Title level={2} style={{textAlign: 'center'}}>Dashboard</Title>
            {projects.map((project: Project) => {
                const generateData = () => {
                    const data: any = {}
                    project.ballots.map((ballot: Ballot) => {
                        data[ballot.user.name] = (data[ballot.user.name] || 0) + ballot.score;
                    })
                    return Object.entries(data).map((e) => ({ judge: e[0], total: e[1] } ));
                }

                return <div key={project.id}>
                    <Title key={project.id} level={3}>{`${project.id} - ${project.name}`}</Title>
                    <>
                    {
                        project.categories.map((category: any) => (
                            <>
                                <Title level={5} key={category.id}>{category.name}</Title>
                                <ProjectTable data={generateData()} />
                            </>
                                
                            ))
                    }
                    </>
                </div>
            })}
        </div>
    )
}

export default Dashboard;