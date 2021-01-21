import React from 'react'
import { Button } from 'reactstrap';
import {Link} from 'react-router-dom'
import './dashboard.css'
function Dashboard(
    {lightBg,topLine,lightText,lightTextDesc,description,headline,buttonLabel,img,imgStart,alt,linksto}
) {
    
    return (
        <>
        <div
          // className={lightBg ? 'home__hero-section' : 'home__hero-section darkBg'}
          className={'home__hero-section'}
        >
          <div className='container'>
            <div
              className='row home__hero-row'
              style={{
                display: 'flex',
                flexDirection: imgStart === 'start' ? 'row-reverse' : 'row'
              }}
            >
              <div className='col'>
                <div className='home__hero-text-wrapper'>
                  <div className='top-line'>{topLine}</div>
                  <h1 className={'heading dark'}>
                    {headline}
                  </h1>
                  <p
                    className={'home__hero-subtitle dark'
                    }
                  >
                    {description}
                  </p>
                  <Link to={linksto}>
                    <Button color="primary">
                      {buttonLabel}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className='col'>
                <div className='home__hero-img-wrapper'>
                  <img src={img} alt={alt} className='home__hero-img' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
}

export default Dashboard
