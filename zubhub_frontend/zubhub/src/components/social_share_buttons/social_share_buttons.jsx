import React from 'react';
import { FacebookShareButton, WhatsappShareButton } from 'react-share';
import { Avatar, Button, ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';

const useStyles = makeStyles({
  text: {
    color: 'white',
  },
  buttonGroup: {
    width: '50px',
    height: '200px',
    display: 'flex-column',
    alignItems: 'center',
    marginBottom: '20px',
  },
  button: {
    width: '50px',
    height: '50px',
    borderRadius: '50% !important',
    margin: '10px',
  },
  avatar: {
    width: '35px',
    height: '35px',
  },
});

const SocialButtons = () => {
  const ahref = window.location.href;
  const classes = useStyles();
  return (
    <>
      <ButtonGroup className={classes.buttonGroup} orientation="vertical">
        <h3 className={classes.text}>Share</h3>
        <Button variant="uncontained" className={classes.button}>
          <FacebookShareButton url={ahref} quote="Check out this project!">
            <Avatar
              className={classes.avatar}
              src={'https://www.facebook.com/images/fb_icon_325x325.png'}
            />
          </FacebookShareButton>
        </Button>

        <Button variant="uncontained" className={classes.button}>
          <WhatsappShareButton url={ahref} title="Check out this project!">
            <Avatar
              className={classes.avatar}
              src={
                'https://seeklogo.com/images/W/whatsapp-icon-logo-8CA4FB831E-seeklogo.com.png'
              }
            />
          </WhatsappShareButton>
        </Button>

        <Button
          variant="uncontained"
          className={classes.button}
          onClick={() => {
            navigator.clipboard.writeText(ahref);
            alert('Link to this project copied to clipboard!');
          }}
        >
          <Avatar className={classes.avatar}>
            <LinkIcon />
          </Avatar>
        </Button>
      </ButtonGroup>
    </>
  );
};

export default SocialButtons;
