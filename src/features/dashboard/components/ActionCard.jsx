import React from 'react';
import { Link } from 'react-router-dom';

const ActionCard = ({ title, description, linkTo, linkText }) => {
  return (
    <div className="action-card">
      <h4>{title}</h4>
      <p>{description}</p>
      <Link to={linkTo}>{linkText}</Link>
    </div>
  );
};

export default ActionCard;
