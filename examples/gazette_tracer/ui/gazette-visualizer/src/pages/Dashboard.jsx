import React, { useEffect, useState } from 'react';
import { fetchTimelineData, fetchGraphData } from '../services/api';
import Timeline from '../components/Timeline';
import Graph from '../components/Graph';

const transformData = (rawData) => {
    const nodes = new Map(); // To ensure unique nodes
    const links = [];
  
    rawData.forEach(([childId, parentId, childDate, parentDate]) => {
      // Add child and parent nodes if they don't already exist
      if (!nodes.has(childId)) {
        nodes.set(childId, { id: childId, label: `Child: ${childId}\nDate: ${childDate}` });
      }
      if (!nodes.has(parentId)) {
        nodes.set(parentId, { id: parentId, label: `Parent: ${parentId}\nDate: ${parentDate}` });
      }
  
      // Add a link between child and parent
      links.push({ source: childId, target: parentId, label: "AMENDS" });
    });
  
    return {
      nodes: Array.from(nodes.values()), // Convert Map to Array
      links,
    };
  };

const Dashboard = () => {
    const [timelineData, setTimelineData] = useState([]);
    const [graphData, setGraphData] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const rawTimelineData = await fetchTimelineData();
            const timeline = rawTimelineData.map(item => ({
                id: item[0],
                date: item[1],
                name: item[2]
            }));
            const graph = await fetchGraphData();
            setTimelineData(timeline);
            console.log("graph");
            const graphData = transformData(graph);
            console.log(graphData);
            setGraphData(graphData);
        };

        loadData();
    }, []);

    return (
        <div>
            <h1>Gazette Visualizer</h1>
            <h2>Timeline</h2>
            <Timeline data={timelineData} />
            <h2>Amendments Graph</h2>
            <Graph data={graphData} />
        </div>
    );
};

export default Dashboard;
