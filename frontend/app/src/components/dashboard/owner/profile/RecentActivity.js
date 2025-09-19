import React from 'react';
import '../../../../styles/dashboard/owner/profile/recentActivity.css';

export default function RecentActivity() {
  const activities = [
    {
      icon: 'fas fa-car',
      title: 'Added new vehicle: Tesla Model Y',
      time: '2 days ago'
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Completed rental with John Doe',
      time: '5 days ago'
    },
    {
      icon: 'fas fa-star',
      title: 'Received 5-star rating',
      time: '1 week ago'
    },
    {
      icon: 'fas fa-dollar-sign',
      title: 'Earned $245 from rental',
      time: '1 week ago'
    },
    {
      icon: 'fas fa-wrench',
      title: 'Updated vehicle availability',
      time: '2 weeks ago'
    }
  ];

  return (
    <div className="profile-card">
      <div className="card-header">
        <h3>Recent Activity</h3>
        <i className="fas fa-clock"></i>
      </div>
      <div className="card-content">
        <div className="activity-list">
          {activities.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                <i className={activity.icon}></i>
              </div>
              <div className="activity-info">
                <span className="activity-title">{activity.title}</span>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}