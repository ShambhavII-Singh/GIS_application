import React from 'react';
import Lottie from 'lottie-react';

import './Hero.css';
import SubHeading from '../../components/common/Subheading'; 
import heroAnimation from '../../assets/animations/heroAnimation.json';

const Hero = () => (
    <div className='app__header app__wrapper section__padding' id='#home'>
        <div className='app__wrapper_info'>
            <SubHeading title="Let us work for a less-polluted Delhi" />
            <h1 className='app__header-h1'>A green<br /> bus ride</h1>
            <p className='app__header-p'>Gives you the route with the least possible pollution levels between two bus stands.</p>
            <button type="button" className="custom__button" onClick={() => {window.location.href='#pages';}}>Know More</button>
        </div>
        <div className='app__header-img app__wrapper_img section__padding'>
            <Lottie animationData={heroAnimation} loop={true} />
        </div>
    </div>
);

export default Hero;