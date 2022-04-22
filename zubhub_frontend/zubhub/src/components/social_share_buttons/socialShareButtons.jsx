import React from 'react';
import { ButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LinkIcon from '@material-ui/icons/Link';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import IconButton from '@material-ui/core/IconButton';
import { useMediaQuery } from '@material-ui/core';

const styles = makeStyles({
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    width: '50px',
    height: '50px',
    borderRadius: '50% !important',
    color: 'white',
  },
  buttonGroup: {
    height: '100%',
    display: 'inherit',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const SocialButtons = () => {
  const classes = styles();
  const url = window.location.href;
  const mediaQuery = useMediaQuery('(min-width: 1080px)');
  return (
    <>
      <ButtonGroup
        className={classes.buttonGroup}
        orientation={(mediaQuery && 'vertical') || 'horizontal'}
      >
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
