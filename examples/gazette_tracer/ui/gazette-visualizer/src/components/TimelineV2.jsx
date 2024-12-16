import React, { useEffect, useState } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { extractTextFromPDF } from '../utils/pdfUtils';
import { summarizeText } from '../utils/summarizeText';

const TimelineV2 = ({ data }) => {
    const [summaries, setSummaries] = useState({});

    useEffect(() => {
        const fetchSummaries = async () => {
            const newSummaries = {};
            for (const item of data) {
                if (item.url) {
                    try {
                        const text = await extractTextFromPDF(item.url);
                        newSummaries[item.id] = summarizeText(text);
                    } catch (error) {
                        console.error(`Error fetching summary for ${item.name}:`, error);
                        newSummaries[item.id] = 'Failed to load summary.';
                    }
                }
            }
            setSummaries(newSummaries);
        };

        fetchSummaries();
    }, [data]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div style={{ maxWidth: '800px', width: '100%' }}>
                <VerticalTimeline>
                    {data.map((item, index) => (
                        <VerticalTimelineElement
                            key={index}
                            date={new Date(item.date).toLocaleDateString()}
                            iconStyle={{
                                background: item.isParent ? '#2196f3' : '#4caf50',
                                color: '#fff',
                                transform: item.isParent ? 'scale(1.2)' : 'scale(1)'
                            }}
                            contentStyle={{
                                background: item.isParent ? '#444' : '#333',
                                color: '#fff',
                                border: item.isParent ? '2px solid #2196f3' : 'none'
                            }}
                            contentArrowStyle={{ borderRight: '7px solid  #333' }}
                            dateClassName="timeline-date"
                        >
                            <h3 className="vertical-timeline-element-title" style={{ color: '#fff', fontSize: item.isParent ? '1.5em' : '1.2em' }}>
                                {item.name}
                            </h3>
                            <h4 className="vertical-timeline-element-subtitle" style={{ color: '#ccc' }}>
                                {item.isParent ? 'Parent Gazette' : 'Child Gazette'}
                            </h4>
                            <p style={{ color: '#ddd' }}>
                                {summaries[item.id] || 'Loading summary...'}
                                {item.url && (
                                    <span> Refer to the <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
                                        gazette
                                    </a>.</span>
                                )}
                            </p>
                        </VerticalTimelineElement>
                    ))}
                </VerticalTimeline>
            </div>
        </div>
    );
};

export default TimelineV2; 