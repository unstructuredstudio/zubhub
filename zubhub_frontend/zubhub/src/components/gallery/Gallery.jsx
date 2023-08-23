import { CardMedia, Grid, IconButton, makeStyles } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { galleryStyles } from './gallery.styles';
import _ from 'lodash';
import { ArrowBackOutlined, ArrowForwardOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import styles from '../../assets/js/styles';
import { refactorVideoUrl } from '../input/inputScripts';
import { isGdriveORVimeoORYoutube } from '../../views/project_details/projectDetailsScripts';

const uniqueId = 'imgContainer';

// displayType can be linear or grid
export default function Gallery({ type = 'image', images = [], videos = [], displayType = 'grid' }) {
  const classes = makeStyles(galleryStyles)({ imgSize: images.length });
  const commonClasses = makeStyles(styles)();

  const [isScrollable, setIsScrollable] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    isImageContainerScroll();
    if (window) {
      window.addEventListener('resize', throttle);
    }
  }, []);

  useEffect(() => {
    throttle();
  }, [images]);

  const isImageContainerScroll = () => {
    const scrollableDiv = document.getElementById(uniqueId);
    if (scrollableDiv?.scrollWidth > scrollableDiv?.clientWidth) {
      if (!isScrollable) {
        setIsScrollable(true);
      }
    } else {
      if (isScrollable) {
        setIsScrollable(false);
      }
    }
  };

  const scrollImages = to => {
    const scrollableDiv = document.getElementById(uniqueId);
    const scrollAmount = 100;

    if (to == '>') {
      scrollableDiv.scrollLeft += scrollAmount;
    }
    if (to == '<') {
      scrollableDiv.scrollLeft -= scrollAmount;
    }
  };

  const throttle = _.throttle(isImageContainerScroll, 1);

  const renderImages = images.map((img, index) => {
    return (
      <div key={index.toString()}>
        <img src={img} />
      </div>
    );
  });

  const openVideo = type => {
    videoRef.current.requestFullscreen();
    document.addEventListener('fullscreenchange', function () {
      if (!document.fullscreenElement) {
        // Exit fullscreen, pause the video
        videoRef.current.pause();
      }
    });
  };

  const renderVideos = videos.map((vid, index) => {
    return (
      <div key={index.toString()}>
        {!isGdriveORVimeoORYoutube(refactorVideoUrl(vid)) && (
          <video onClick={openVideo} ref={videoRef}>
            <source src={vid} />
            Your browser does not support the video tag.
          </video>
        )}
        {isGdriveORVimeoORYoutube(refactorVideoUrl(vid)) && (
          <CardMedia
            ref={videoRef}
            onClick={() => openVideo('cardmedia')}
            style={{ objectFit: 'contain' }}
            component="iframe"
            title="YouTube Video"
            src={refactorVideoUrl(vid)}
            height="100%" // You can adjust the height as needed
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
            allowFullScreen
          />
        )}
      </div>
    );
  });

  if (displayType === 'grid') {
    return (
      <div className={classes.container}>
        {images.length > 0 && renderImages}
        {videos.length > 0 && renderVideos}
      </div>
    );
  }

  if (displayType === 'linear') {
    return (
      <>
        <div id={uniqueId} className={classes.containerLinear}>
          {images.length > 0 && renderImages}
          {videos.length > 0 && renderVideos}
        </div>
        {isScrollable && (
          <div className={clsx(commonClasses.displayFlex, commonClasses.justifyCenter)} style={{ marginTop: 10 }}>
            <IconButton onClick={() => scrollImages('<')}>
              <ArrowBackOutlined />
            </IconButton>
            <IconButton onClick={() => scrollImages('>')}>
              <ArrowForwardOutlined />
            </IconButton>
          </div>
        )}
      </>
    );
  }

  return null;
}
