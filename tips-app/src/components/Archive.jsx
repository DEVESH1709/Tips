import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

function Archive() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
  
    const fetchTips = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/tips`);
        const data = await response.json();
        
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTips(data);
      } catch (error) {
        console.error('Error fetching tips:', error);
      }
    };
    fetchTips();
  }, []);

  return (
    <div className="container">
      <h2>Tip Archive</h2>
      {tips.length === 0 && <p>No tips have been submitted yet.</p>}
      {tips.map((tip, index) => (
        <div className="tip-card" key={index}>
          <p className="tip-message" 
             dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(tip.message) }} />
          <p><strong>Date:</strong> {new Date(tip.date).toLocaleString()}</p>
          {tip.name && <p><strong>Name:</strong> {DOMPurify.sanitize(tip.name)}</p>}
          {tip.email && <p><strong>Email:</strong> {DOMPurify.sanitize(tip.email)}</p>}
          <p><strong>Subscribed:</strong> {tip.subscribe ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
}

export default Archive;
