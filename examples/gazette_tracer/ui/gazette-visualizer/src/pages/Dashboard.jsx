import React, { useEffect, useState } from 'react';
import { fetchTimelineData, fetchGraphData, fetchParentNodes } from '../services/api';
import Timeline from '../components/Timeline';
import Graph from '../components/Graph';

const transformData = (rawData) => {
    const nodes = new Map();
    const links = [];
  
    rawData.forEach(([childId, parentId, childDate, parentDate, childUrl, parentUrl]) => {
      // Add child and parent nodes with URLs
      if (!nodes.has(childId)) {
        nodes.set(childId, { 
          id: childId, 
          label: `Child: ${childId}\nDate: ${childDate}`,
          url: childUrl 
        });
      }
      if (!nodes.has(parentId)) {
        nodes.set(parentId, { 
          id: parentId, 
          label: `Parent: ${parentId}\nDate: ${parentDate}`,
          url: parentUrl 
        });
      }
  
      links.push({ source: childId, target: parentId, label: "AMENDS" });
    });
  
    return {
      nodes: Array.from(nodes.values()),
      links,
    };
};

const Dashboard = () => {
    const [timelineData, setTimelineData] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [parentNodes, setParentNodes] = useState(new Set());

    useEffect(() => {
        const loadData = async () => {
            const [rawTimelineData, graph, parents] = await Promise.all([
                fetchTimelineData(),
                fetchGraphData(),
                fetchParentNodes()
            ]);

            // Process timeline data with parent information
            console.log("rawTimelineData", rawTimelineData);
            const parentIds = new Set(parents.map(p => p[0]));
            console.log("parentIds", parentIds);
            const timeline = rawTimelineData.map(item => ({
                id: item[0],
                date: item[1],
                name: item[2],
                url: item[3],
                isParent: parentIds.has(item[0])
            }));

            console.log("timeline", timeline);

            setTimelineData(timeline);
            setParentNodes(parentIds);
            
            const graphData = transformData(graph);
            setGraphData(graphData);
        };

        loadData();
    }, []);

    const handleNodeClick = (node) => {
        console.log("Node clicked:", node);
        if (node.url) {
            window.open(node.url, '_blank');
        }
    };

    return (
        <div>
            <h1>Gazette Visualizer</h1>
            <h2>Timeline</h2>
            <Timeline data={timelineData} />
        </div>
    );
};

export default Dashboard;
