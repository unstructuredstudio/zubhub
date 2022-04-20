import React from 'react';
import { Avatar, Button, ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
// import fbicon from 'fbicon.png';

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
    borderColor: 'white',
  },
  whatsapp: {
    width: '40px',
    height: '40px',
    backgroundColor: 'transparent',
  },
  avatar: {
    width: '35px',
    height: '35px',
    backgroundColor: 'transparent',
    border: '3px solid white',
  },
});

const SocialButtons = () => {
  const ahref = window.location.href;
  const classes = useStyles();
  return (
    <>
      <ButtonGroup className={classes.buttonGroup} orientation="vertical">
        <Button
          variant="uncontained"
          className={classes.button}
          href={
            'https://www.facebook.com/sharer/sharer.php?u=' +
            ahref +
            '&quote=Check%20out%20this%20project%20on%20ZubHub!'
          }
        >
          <Avatar
            className={classes.avatar}
            src={
              'http://assets.stickpng.com/images/60fea6c83d624000048712b7.png'
            }
          />
        </Button>
        <Button
          variant="uncontained"
          className={classes.button}
          href={
            'https://web.whatsapp.com/send?text=' +
            'Check out this project on ZubHub! ' +
            ahref
          }
        >
          <Avatar
            className={classes.whatsapp}
            src={
              'https://pnggrid.com/wp-content/uploads/2021/05/WhatsApp-logo-png-White.png'
            }
          />
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
