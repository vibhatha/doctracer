import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const Timeline = ({ data }) => {
    const [selectedGazette, setSelectedGazette] = useState(null);

    useEffect(() => {
        const svg = d3.select("#timeline-svg")
            .attr("width", 1000)
            .attr("height", 150);

        const scale = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)))
            .range([50, 950]);

        const circles = svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => scale(new Date(d.date)))
            .attr("cy", 50)
            .attr("r", 8)
            .attr("fill", "steelblue")
            .style("cursor", "pointer")
            .on("mouseover", (event, d) => {
                d3.select("#tooltip")
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .html(`<strong>ID:</strong> ${d.id}<br><strong>Date:</strong> ${d.date}<br><strong>Name:</strong> ${d.name}`)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", () => {
                d3.select("#tooltip")
                    .transition()
                    .duration(200)
                    .style("opacity", 0);
            })
            .on("click", (event, d) => {
                setSelectedGazette(d);
            });

        circles.transition()
            .duration(1000)
            .attr("r", 10);

        svg.append("g")
            .attr("transform", "translate(0, 70)")
            .call(d3.axisBottom(scale));

    }, [data]);

    return (
        <div>
            <svg id="timeline-svg"></svg>
            <div id="tooltip" style={{
                position: "absolute",
                opacity: 0,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                pointerEvents: "none",
                transition: "opacity 0.2s"
            }}></div>
            {selectedGazette && (
                <div style={{ marginTop: "10px" }}>
                    <strong>Selected Gazette:</strong>
                    <p>ID: {selectedGazette.id}</p>
                    <p>Date: {selectedGazette.date}</p>
                    <p>Name: {selectedGazette.name}</p>
                </div>
            )}
        </div>
    );
};

export default Timeline;