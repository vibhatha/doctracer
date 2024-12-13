import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import PdfModal from './PdfModal';

const Timeline = ({ data }) => {
    const [zoomLevel, setZoomLevel] = useState(1);
    const [yearRange, setYearRange] = useState([]);
    const [currentYear, setCurrentYear] = useState(null);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Calculate year range from data
        const years = data.map(d => new Date(d.date).getFullYear());
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);
        setYearRange([minYear, maxYear]);
        setCurrentYear(maxYear);

        const container = d3.select(containerRef.current);
        const containerWidth = containerRef.current.clientWidth;
        const totalWidth = containerWidth * zoomLevel;

        const svg = container.select("#timeline-svg")
            .attr("width", totalWidth)
            .attr("height", 300);

        svg.selectAll("*").remove();

        const margin = { top: 20, right: 50, bottom: 50, left: 50 };
        const width = totalWidth - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const scale = d3.scaleTime()
            .domain(d3.extent(data, d => new Date(d.date)))
            .range([0, width]);

        // Create a simpler color scheme
        const colors = [
            '#2196f3', // blue
            '#4caf50', // green
            '#f44336', // red
            '#9c27b0', // purple
            '#ff9800', // orange
            '#00bcd4', // cyan
            '#795548', // brown
            '#673ab7', // deep purple
            '#3f51b5', // indigo
            '#009688'  // teal
        ];

        // Function to assign colors based on parent sequence
        let currentColorIndex = -1;
        const getNodeColor = (node) => {
            if (node.isParent) {
                currentColorIndex = (currentColorIndex + 1) % colors.length;
                return colors[currentColorIndex];
            }
            return colors[currentColorIndex];
        };

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

        // Sort data by date to ensure proper color sequencing
        const sortedData = [...positionedData].sort((a, b) => 
            new Date(a.date) - new Date(b.date)
        );

        // Pre-calculate colors for all nodes
        const nodeColors = new Map();
        sortedData.forEach(node => {
            nodeColors.set(node.id, getNodeColor(node));
        });

        // Add circles with sequential coloring
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
            .attr("fill", d => nodeColors.get(d.id))
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

                // Find parent gazette
                const parentGazette = d.isParent ? d : data.find(item => item.id === d.parentId);

                d3.select("#tooltip")
                    .transition()
                    .duration(200)
                    .style("opacity", 1)
                    .html(`
                        <strong>${d.name}</strong><br>
                        <strong>ID:</strong> ${d.id}<br>
                        <strong>Date:</strong> ${new Date(d.date).toLocaleDateString()}<br>
                        <strong>Year:</strong> ${new Date(d.date).getFullYear()}<br>
                        ${d.isParent ? '<strong>Type:</strong> Parent Gazette<br>' : ''}
                        ${!d.isParent ? `<strong>Parent:</strong> ${parentGazette?.name || 'N/A'}<br>` : ''}
                        <strong>Documents on this date:</strong> ${d.totalInStack}
                    `)
                    .style("left", (event.pageX + 15) + "px")
                    .style("top", (event.pageY - 28) + "px")
                    .style("background-color", "rgba(0, 0, 0, 0.8)")
                    .style("color", "white")
                    .style("padding", "10px")
                    .style("border-radius", "4px")
                    .style("font-size", "12px")
                    .style("line-height", "1.4");

                // Highlight corresponding label
                g.selectAll("text.gazette-label")
                    .filter(label => label.id === d.id)
                    .transition()
                    .duration(200)
                    .attr("font-size", "12px")
                    .attr("font-weight", "bold")
                    .attr("fill", "#333");
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

                // Reset label
                g.selectAll("text.gazette-label")
                    .filter(label => label.id === d.id)
                    .transition()
                    .duration(200)
                    .attr("font-size", "10px")
                    .attr("font-weight", "normal")
                    .attr("fill", "#666");
            })
            .on("click", (event, d) => {
                if (d.url) {
                    // Find parent information from the graph data
                    const parentInfo = data.find(item => item.id === d.parentId);
                    setSelectedPdf({
                        ...d,
                        parentGazette: parentInfo
                    });
                }
            });

        // Create label positions with force layout
        const labelData = positionedData.map(d => ({
            ...d,
            x: scale(new Date(d.date)),
            y: d.totalInStack === 1 
                ? baseY + circleRadius(d) + 20 
                : baseY + ((d.stackIndex - (d.totalInStack - 1) / 2) * verticalSpacing) + circleRadius(d) + 20
        }));

        // Force simulation to prevent label overlap
        const simulation = d3.forceSimulation(labelData)
            .force("x", d3.forceX(d => d.x).strength(1)) // Keep x position close to original
            .force("y", d3.forceY(d => d.y).strength(0.1)) // Allow more vertical movement
            .force("collision", d3.forceCollide(20)) // Prevent overlap
            .stop();

        // Run the simulation
        for (let i = 0; i < 100; i++) simulation.tick();

        // Add text labels with updated positions
        const labels = g.selectAll("text.gazette-label")
            .data(labelData)
            .enter()
            .append("text")
            .attr("class", "gazette-label")
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("text-anchor", "middle")
            .attr("font-size", "10px")
            .attr("fill", "white")
            .style("pointer-events", "none")
            .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.8)") // Add shadow for better readability
            .text(d => {
                const maxLength = 15;
                const name = d.name.replace(" Extra Ordinary Gazette", "");
                return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
            });

        // Update connecting lines to use the same colors
        const connections = g.selectAll("line.label-connection")
            .data(labelData)
            .enter()
            .append("line")
            .attr("class", "label-connection")
            .attr("x1", d => scale(new Date(d.date)))
            .attr("y1", d => {
                if (d.totalInStack === 1) return baseY;
                const offset = (d.stackIndex - (d.totalInStack - 1) / 2) * verticalSpacing;
                return baseY + offset;
            })
            .attr("x2", d => d.x)
            .attr("y2", d => d.y - 10)
            .attr("stroke", d => `${nodeColors.get(d.id)}80`) // Using same color with transparency
            .attr("stroke-width", 1)
            .style("pointer-events", "none");

        // Update hover effects
        circles.on("mouseover", (event, d) => {
            // ... existing mouseover code ...

            // Highlight corresponding label and connection
            g.selectAll("text.gazette-label")
                .filter(label => label.id === d.id)
                .transition()
                .duration(200)
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.8)");

            g.selectAll("line.label-connection")
                .filter(conn => conn.id === d.id)
                .transition()
                .duration(200)
                .attr("stroke", "rgba(255,255,255,0.8)")
                .attr("stroke-width", 2);
        })
        .on("mouseout", (event, d) => {
            // ... existing mouseout code ...

            // Reset label and connection
            g.selectAll("text.gazette-label")
                .filter(label => label.id === d.id)
                .transition()
                .duration(200)
                .attr("font-size", "10px")
                .attr("font-weight", "normal")
                .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.8)");

            g.selectAll("line.label-connection")
                .filter(conn => conn.id === d.id)
                .transition()
                .duration(200)
                .attr("stroke", "rgba(255,255,255,0.3)")
                .attr("stroke-width", 1);
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

        // Add year labels along the axis
        const yearAxis = d3.axisBottom(scale)
            .tickFormat(d => d.getFullYear())
            .ticks(d3.timeYear);

        g.append("g")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(yearAxis)
            .selectAll("text")
            .style("font-size", "12px")
            .style("fill", "#666");

        // Increase the SVG height to accommodate labels
        svg.attr("height", height + margin.top + margin.bottom + 100);

        // Add clip path to prevent drawing outside viewport
        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", totalWidth - margin.left - margin.right)
            .attr("height", height)
            .attr("x", margin.left)
            .attr("y", 0);

        g.attr("clip-path", "url(#clip)");

    }, [data, currentYear, zoomLevel]);

    return (
        <div>
            {/* Resolution control */}
            <div style={{
                margin: "0 50px",
                padding: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px",
                marginBottom: "10px"
            }}>
                <div style={{ marginBottom: "5px" }}>
                    Resolution: {zoomLevel.toFixed(1)}x
                </div>
                <input
                    type="range"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={zoomLevel}
                    onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                    style={{ width: "100%" }}
                />
            </div>

            {/* Scrollable timeline container */}
            <div 
                ref={containerRef}
                style={{ 
                    margin: "0 50px",
                    overflowX: "auto",
                    overflowY: "hidden",
                    backgroundColor: "#1a1a1a",
                    borderRadius: "5px",
                    // Custom scrollbar styling
                    scrollbarWidth: "thin",
                    scrollbarColor: "#666 #1a1a1a",
                    // Webkit scrollbar styling
                    WebkitOverflowScrolling: "touch"
                }}
            >
                <svg id="timeline-svg"></svg>
            </div>

            {/* Year filter */}
            <div id="year-slider-container" style={{
                margin: "20px 50px",
                padding: "10px",
                backgroundColor: "#f5f5f5",
                borderRadius: "5px"
            }}>
                <div style={{ marginBottom: "10px" }}>
                    Year: {currentYear}
                </div>
                <input
                    type="range"
                    min={yearRange[0]}
                    max={yearRange[1]}
                    value={currentYear}
                    onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                    style={{ width: "100%" }}
                />
            </div>
            
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
            
            {selectedPdf && (
                <PdfModal 
                    gazette={selectedPdf} 
                    onClose={() => setSelectedPdf(null)} 
                />
            )}
        </div>
    );
};

export default Timeline;