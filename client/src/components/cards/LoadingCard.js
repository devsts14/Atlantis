import React from 'react';
import { Skeleton } from 'antd';

const LoadingCard = ({ count }) => {
  const cards = () => {
    let totalCards = [];
    for (let i = 0; i < count; i++) {
      totalCards.push(
        <div key={i} className='card'>
          {' '}
          <Skeleton active></Skeleton>
        </div>
      );
    }
    return totalCards;
  };
  return <div className='product-grid'>{cards()}</div>;
};

export default LoadingCard;
