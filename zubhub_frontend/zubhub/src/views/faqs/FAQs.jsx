import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';

import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Container,
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import * as UserActions from '../../store/actions/userActions';
import LoadingPage from '../loading/LoadingPage';
import ErrorPage from '../error/ErrorPage';
import styles from '../../assets/js/styles/views/faqs/FAQsStyles';

const useStyles = makeStyles(styles);

/**
 * @function FAQs
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function FAQs(props) {
  const classes = useStyles();

  const [state, setState] = React.useState({
    loading: true,
    faqs: [],
  });

  React.useEffect(() => {
    handleSetState(props.getFaqs({ t: props.t }));
  }, []);

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState(state => ({ ...state, ...obj }));
      });
    }
  };

  const { loading, faqs } = state;
  const { t } = props;

  if (loading) {
    return <LoadingPage />;
  } else if (faqs.length > 0) {
    return (
      <Box className={classes.root}>
        <Container className={classes.containerStyle}>
          <Card className={classes.cardStyle}>
            <Typography className={classes.faqsHeadingStyle}>
              {t('faqs.title')}
            </Typography>
            {faqs.map(faq => (
              <Accordion>
                <AccordionSummary
                  expandIcon={
                    <>
                      <Typography>{t('faqs.answer')}</Typography>
                      <ExpandMoreIcon />
                    </>
                  }
                  aria-controls={t('faqs.answer')}
                  id={t('faqs.question')}
                >
                  <Typography className={classes.heading}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails aria-label={t('faqs.answer')}>
                  <Typography
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  ></Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Card>
        </Container>
      </Box>
    );
  } else {
    return <ErrorPage error={t('faqs.errors.page_empty')} />;
  }
}

FAQs.propTypes = {
  auth: PropTypes.object.isRequired,
  getFaqs: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getFaqs: args => {
      return dispatch(UserActions.getFaqs(args));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FAQs);
