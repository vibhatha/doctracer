import React, { useEffect } from "react";
import * as d3 from "d3";

const AmendmentGraph = ({ data = { nodes: [], links: [] } }) => {
    useEffect(() => {
        if (!data?.nodes || !data?.links) {
            console.error("Invalid data format:", data);
            return;
        }

        // Dimensions and SVG setup
        const width = 1000;
        const height = 600;
        const svg = d3.select("#graph-svg")
            .attr("width", width)
            .attr("height", height)
            .style("border", "1px solid black");

        // Clear any previous content
        svg.selectAll("*").remove();

        // Simulation setup
        const simulation = d3.forceSimulation(data.nodes)
            .force("link", d3.forceLink(data.links).id(d => d.id).distance(150))
            .force("charge", d3.forceManyBody().strength(-400))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(30))
            .on("tick", ticked);

        // Draw links
        const link = svg.selectAll(".link")
            .data(data.links)
            .enter()
            .append("g")
            .attr("class", "link");

        // Add lines for links
        link.append("line")
            .attr("stroke", "green")
            .attr("stroke-width", 2);

        // Add link labels
        link.append("text")
            .attr("dy", -5)
            .attr("text-anchor", "middle")
            .text(d => d.label)
            .style("font-size", "10px")
            .style("fill", "white");

        // Draw nodes
        const node = svg.selectAll(".node")
            .data(data.nodes)
            .enter()
            .append("g")
            .attr("class", "node")
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
            .attr("fill", d => d.id === "2289-43" ? "#ff7f0e" : "#1f77b4"); // Parent node in different color

        // Add labels to nodes
        node.append("text")
            .text(d => d.id)
            .attr("x", 20)
            .attr("y", 5)
            .style("font-size", "12px")
            .style("fill", "white");

        // Add tooltips to nodes
        node.append("title")
            .text(d => d.label)
            .style("fill", "white");

        // Update positions on tick
        function ticked() {
            link.select("line")
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            link.select("text")
                .attr("x", d => (d.source.x + d.target.x) / 2)
                .attr("y", d => (d.source.y + d.target.y) / 2);

            node
                .attr("transform", d => `translate(${d.x}, ${d.y})`);
        }

    }, [data]);

    return <svg id="graph-svg"></svg>;
};

export default AmendmentGraph;