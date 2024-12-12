import React, { useEffect, useState } from "react";
import * as d3 from "d3";

const Timeline = ({ data }) => {
    const [selectedGazette, setSelectedGazette] = useState(null);
    const [yearRange, setYearRange] = useState([]);
    const [currentYear, setCurrentYear] = useState(null);

    useEffect(() => {
        // Calculate year range from data
        // console.log(data.map(d => console.log(d.isParent)));
        const years = data.map(d => new Date(d.date).getFullYear());
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);
        setYearRange([minYear, maxYear]);
        setCurrentYear(maxYear);

        const svg = d3.select("#timeline-svg")
            .attr("width", 1000)
            .attr("height", 300); // Increased height to accommodate stacked circles

        svg.selectAll("*").remove();

        const margin = { top: 20, right: 50, bottom: 50, left: 50 };
        const width = 1000 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const scale = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)))
            .range([0, width]);

        const colorScale = d3.scaleSequential()
            .domain([minYear, maxYear])
            .interpolator(d3.interpolateViridis);

        // Filter data for current year
        const filteredData = data.filter(d => 
            new Date(d.date).getFullYear() <= currentYear
        );

        // Group documents by date
        const dateGroups = d3.group(filteredData, d => d.date);
        
        // Create array of objects with position information
        const positionedData = [];
        dateGroups.forEach((documents, date) => {
            documents.forEach((doc, index) => {
                positionedData.push({
                    ...doc,
                    stackIndex: index,
                    totalInStack: documents.length
                });
            });
        });

        // Calculate vertical offset for stacked circles
        const circleRadius = d => d.isParent ? 20 : 10; // Larger radius for parent nodes
        const verticalSpacing = 30; // Increased to accommodate larger circles
        const baseY = height / 2;

        // Add circles
        const circles = g.selectAll("circle")
            .data(positionedData)
            .enter()
            .append("circle")
            .attr("cx", d => scale(new Date(d.date)))
            .attr("cy", d => {
                if (d.totalInStack === 1) return baseY;
                const offset = (d.stackIndex - (d.totalInStack - 1) / 2) * verticalSpacing;
                return baseY + offset;
            })
            .attr("r", d => circleRadius(d))
            .attr("fill", d => colorScale(new Date(d.date).getFullYear()))
            .style("cursor", "pointer")
            .style("filter", d => d.isParent 
                ? "drop-shadow(0 0 4px rgba(0,0,0,0.5))" 
                : "drop-shadow(0 0 2px rgba(0,0,0,0.3))")
            .style("stroke", d => d.isParent ? "#fff" : "none")
            .style("stroke-width", d => d.isParent ? 2 : 0)
            .on("mouseover", (event, d) => {
                const currentRadius = circleRadius(d);
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr("r", currentRadius * 1.5);

                d3.select("#tooltip")
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .html(`
                        <strong>ID:</strong> ${d.id}<br>
                        <strong>Date:</strong> ${new Date(d.date).toLocaleDateString()}<br>
                        <strong>Name:</strong> ${d.name}<br>
                        <strong>Type:</strong> ${d.isParent ? 'Parent' : 'Child'}<br>
                        <strong>Documents on this date:</strong> ${d.totalInStack}
                    `)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", (event, d) => {
                d3.select(event.currentTarget)
                    .transition()
                    .duration(200)
                    .attr("r", circleRadius(d));

                d3.select("#tooltip")
                    .transition()
                    .duration(200)
                    .style("opacity", 0);
            });

        // Add connecting lines for stacked documents
        dateGroups.forEach((documents, date) => {
            if (documents.length > 1) {
                const x = scale(new Date(date));
                const y1 = baseY + ((-(documents.length - 1) / 2) * verticalSpacing);
                const y2 = baseY + ((documents.length - 1) / 2) * verticalSpacing;
                
                g.append("line")
                    .attr("x1", x)
                    .attr("y1", y1)
                    .attr("x2", x)
                    .attr("y2", y2)
                    .attr("stroke", "#ccc")
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", "2,2")
                    .style("opacity", 0.5);
            }
        });

        // Add x-axis
        const xAxis = g.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(scale)
                .tickFormat(d3.timeFormat("%Y-%m"))
                .tickSize(-height)
            );

        xAxis.selectAll(".tick line")
            .attr("stroke", "#e0e0e0")
            .attr("stroke-dasharray", "2,2");

        // Add year slider
        const sliderContainer = d3.select("#year-slider-container");
        sliderContainer.selectAll("*").remove();

        const slider = sliderContainer
            .append("input")
            .attr("type", "range")
            .attr("min", minYear)
            .attr("max", maxYear)
            .attr("value", currentYear)
            .attr("step", 1)
            .style("width", "100%")
            .on("input", function() {
                setCurrentYear(+this.value);
            });

    }, [data, currentYear]);

    return (
        <div>
            <div id="year-slider-container" style={{
                margin: "20px 50px",
                padding: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px"
            }}>
                <div style={{ marginBottom: "10px" }}>
                    Year: {currentYear}
                </div>
            </div>
            <svg id="timeline-svg"></svg>
            <div id="tooltip" style={{
                position: "absolute",
                opacity: 0,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                padding: "10px",
                borderRadius: "5px",
                fontSize: "12px",
                pointerEvents: "none",
                transition: "opacity 0.2s",
                zIndex: 1000
            }}></div>
        </div>
    );
};

export default Timeline;