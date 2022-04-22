import React from 'react';
import { ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles({
  buttonGroup: {
    width: '50px',
    height: '100%',
    display: 'inherit',
    alignItems: 'center',
    margin: 'none',
  },
  button: {
    width: '50px',
    height: '50px',
    borderRadius: '50% !important',
    margin: '5%',
    color: 'white',
  },
});

const SocialButtons = () => {
  const classes = useStyles();
  const url = window.location.href;
  return (
    <>
      <ButtonGroup className={classes.buttonGroup} orientation="vertical">
        <IconButton
          className={classes.button}
          onClick={() =>
            window.open(
              'https://www.facebook.com/sharer/sharer.php?u=' +
                url +
                '&quote=Check%20out%20this%20project%20on%20ZubHub!',
            )
          }
        >
          <FacebookIcon />
        </IconButton>
        <IconButton
          className={classes.button}
          onClick={() =>
            window.open(
              'https://web.whatsapp.com/send?text=' +
                'Check out this project on ZubHub! ' +
                url,
            )
          }
        >
          <WhatsAppIcon />
        </IconButton>
        <IconButton
          className={classes.button}
          onClick={() => {
            navigator.clipboard
              .writeText(url)
              .then(() => {
                alert('Link copied to clipboard: ' + url);
              })
              .catch(() => {
                alert('Something went wrong!');
              });
          }}
        >
          <LinkIcon />
        </IconButton>
      </ButtonGroup>
    </>
  );
};

export default SocialButtons;
