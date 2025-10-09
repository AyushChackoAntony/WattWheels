import React from 'react';
import '@/styles/dashboard/customer/profile/recentActivity.css';

export default function RecentActivity() {
  const activities = [
    {
      icon: 'fas fa-car',
      title: 'Booked Tesla Model 3',
      time: '2 days ago',
      color: 'primary'
    },
    {
      icon: 'fas fa-calendar-check',
      title: 'Completed trip to Delhi',
      time: '5 days ago',
      color: 'success'
    },
    {
      icon: 'fas fa-star',
      title: 'Gave 5-star rating',
      time: '1 week ago',
      color: 'rating'
    },
    {
      icon: 'fas fa-rupee-sign',
      title: 'Paid ₹2,500 for rental',
      time: '1 week ago',
      color: 'earning'
    },
    {
      icon: 'fas fa-user-check',
      title: 'Profile verified',
      time: '2 weeks ago',
      color: 'verified'
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
              <div className={`activity-icon ${activity.color}`}>
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