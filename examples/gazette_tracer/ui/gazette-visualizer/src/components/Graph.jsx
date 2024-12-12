import React, { useEffect } from "react";
import * as d3 from "d3";

const AmendmentGraph = ({ data = { nodes: [], links: [] }, onNodeClick }) => {
    useEffect(() => {
        // Add debugging at the start of useEffect
        console.log("Graph component received data:", data);

        if (!data?.nodes || !data?.links) {
            console.error("Invalid data format:", data);
            return;
        }

        // Find parent nodes (nodes that are only targets, never sources)
        const sourceIds = new Set(data.links.map(link => link.source));
        const targetIds = new Set(data.links.map(link => link.target));
        const parentIds = new Set([...targetIds].filter(id => !sourceIds.has(id)));

        // Group nodes by their parent
        const nodesByParent = {};
        data.links.forEach(link => {
            if (!nodesByParent[link.target]) {
                nodesByParent[link.target] = [];
            }
            nodesByParent[link.target].push(link.source);
        });

        // Sort children for each parent and add indices
        const processedNodes = data.nodes.map(node => {
            if (parentIds.has(node.id)) {
                return { ...node, isParent: true };
            }

            // Find this node's parent
            const parent = data.links.find(link => link.source === node.id)?.target;
            if (!parent) return node;

            // Get all siblings (including self) and sort by date
            const siblings = nodesByParent[parent];
            const sortedSiblings = siblings.sort((a, b) => {
                const nodeA = data.nodes.find(n => n.id === a);
                const nodeB = data.nodes.find(n => n.id === b);
                const dateA = new Date(nodeA.label.split('\n')[1].replace('Date: ', ''));
                const dateB = new Date(nodeB.label.split('\n')[1].replace('Date: ', ''));
                return dateA - dateB;
            });

            return {
                ...node,
                orderIndex: sortedSiblings.indexOf(node.id) + 1,
                parentId: parent
            };
        });

        // Log processed nodes
        console.log("Processed nodes:", processedNodes);

        // Rest of your existing setup code...
        const width = 1000;
        const height = 600;
        const svg = d3.select("#graph-svg")
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid black");

        svg.selectAll("*").remove();

        const simulation = d3.forceSimulation(processedNodes)
            .force("link", d3.forceLink(data.links).id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(30))
            .on("tick", ticked);

        const link = svg.selectAll(".link")
            .data(data.links)
            .enter()
            .append("g")
            .attr("class", "link");

        link.append("line")
            .attr("stroke", "green")
            .attr("stroke-width", 2);

        const node = svg.selectAll(".node")
            .data(processedNodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                console.log("Clicked node:", d);
                onNodeClick?.(d);
            })
            .call(d3.drag()
                .on("start", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on("drag", (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on("end", (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));

        // Add circles to nodes
        node.append("circle")
            .attr("r", 15)
            .attr("fill", d => d.isParent ? "#ff7f0e" : "#1f77b4");

        // Add order number inside the circle for child nodes
        node.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", ".3em")
            .style("fill", "white")
            .style("font-size", "12px")
            .text(d => d.isParent ? "" : d.orderIndex);

        // Add ID labels next to nodes
        node.append("text")
            .text(d => d.id)
            .attr("x", 20)
            .attr("y", 5)
            .style("font-size", "12px")
            .style("fill", "white");

        node.append("title")
            .text(d => d.label)
            .style("fill", "white");

        function ticked() {
            link.select("line")
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x}, ${d.y})`);
        }

    }, [data, onNodeClick]);

    return <svg id="graph-svg"></svg>;
};

export default AmendmentGraph;