import React from 'react';
import plants from '../images/plant.png';
import fish from '../images/fish.png';
import access2 from '../images/access2.png';
import plants2 from '../images/plant2.png';
import fish2 from '../images/fish2.png';
import access from '../images/access.png';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';
import RecentlyViewed from '../components/home/RecentlyViewed'
import {useSelector} from 'react-redux'
const Home = () => {
  const {user} = useSelector((state)=>({...state}))

  return (
    <div>
      <Carousel
        showStatus={false}
        infiniteLoop={true}
        swipeable={true}
        stopOnHover={true}
        autoPlay={true}
        showThumbs={false}
        showArrows={false}
      >
        <div>
          <img src={window.innerWidth < 500 ?plants2:plants} />
        </div>
        <div>
          <img src={window.innerWidth < 500 ?fish2:fish} />
        </div>
        <div>
          <img src={window.innerWidth < 500 ?access2:access} />
        </div>
      </Carousel>
      <NewArrivals />
      <BestSellers />
      {user && user.token && <RecentlyViewed/>}
    </div>
  );
};

export default Home;
