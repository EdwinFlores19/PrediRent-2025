import React from 'react';

const StatsCard = ({ title, value, isPremium }) => {
  const cardClass = isPremium ? 'stats-card premium' : 'stats-card';
  return (
    <div className={cardClass}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default StatsCard;
