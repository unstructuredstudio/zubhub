import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { connect } from 'react-redux';
import { toast } from 'react-toastify';

import { makeStyles } from '@mui/styles';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddIcon from '@mui/icons-material/Add';
import { Grid, Container, Box, Card, ButtonGroup, Typography, Avatar } from '@mui/material';

import { fetchPage, toggleFollow, removeMember } from './groupMembersScripts';

import * as UserActions from '../../store/actions/userActions';
import CustomButton from '../../components/button/Button';
import ErrorPage from '../error/ErrorPage';
import LoadingPage from '../loading/LoadingPage';
import styles from '../../assets/js/styles/views/group_members/groupMembersStyles';
import commonStyles from '../../assets/js/styles';

const useStyles = makeStyles(styles);
const useCommonStyles = makeStyles(commonStyles);

/**
 * @function buildMembers Component
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
const buildMembers = (members, style, props, state, handleSetState) =>
  members.map(member => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      className={style.classes.groupMembersGridStyle}
      align="center"
      key={member.id}
    >
      <Link className={style.common_classes.textDecorationNone} to={`/creators/${member.username}`}>
        <Card className={style.classes.cardStyle}>
          <Avatar className={style.classes.avatarStyle} src={member.avatar} alt={member.username} />
          {member.id !== props.auth.id ? (
            <CustomButton
              variant="outlined"
              className={style.common_classes.marginBottom1em}
              onClick={(e, id = member.id) => handleSetState(toggleFollow(e, props, state, id, toast))}
              secondaryButtonStyle
            >
              {member.followers.includes(props.auth.id)
                ? props.t('userFollowers.follower.unfollow')
                : props.t('userFollowers.follower.follow')}
            </CustomButton>
          ) : null}
          {props.auth.members_count !== null && props.params.username === props.auth.username ? (
            <CustomButton
              variant="outlined"
              onClick={(e, id = member.id) => handleSetState(removeMember(e, props, state, id, toast))}
              secondaryButtonStyle
            >
              {props.t('groupMembers.remove')}
            </CustomButton>
          ) : null}
          <Typography component="h3" color="textPrimary" className={style.classes.userNameStyle}>
            {member.username}
          </Typography>
        </Card>
      </Link>
    </Grid>
  ));

/**
 * @function GroupMembers View
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
function GroupMembers(props) {
  const classes = useStyles();
  const common_classes = useCommonStyles();

  const [state, setState] = React.useState({
    members: [],
    prev_page: null,
    next_page: null,
    loading: true,
  });

  const handleSetState = obj => {
    if (obj) {
      Promise.resolve(obj).then(obj => {
        setState({ ...state, ...obj });
      });
    }
  };

  React.useEffect(() => {
    handleSetState(fetchPage(null, props));
  }, []);

  const { members, prev_page, next_page, loading } = state;
  const username = props.params.username;
  const { t } = props;
  if (loading) {
    return <LoadingPage />;
  } else if (members && members.length > 0) {
    return (
      <Box className={classes.root}>
        <Container className={classes.mainContainerStyle}>
          <Grid container spacing={3} justify="center">
            <Grid item xs={12}>
              <Typography className={classes.pageHeaderStyle} variant="h3" gutterBottom>
                {`${username}'s ${t('groupMembers.title')}`}
              </Typography>

              {props.auth.members_count !== null && username === props.auth.username ? (
                <CustomButton
                  variant="contained"
                  className={common_classes.floatRight}
                  startIcon={<AddIcon />}
                  primaryButtonStyle
                  onClick={() => props.navigate(`/creators/${username}/add-members`)}
                >
                  {props.t('groupMembers.newMembers')}
                </CustomButton>
              ) : null}
            </Grid>
            {buildMembers(members, { classes, common_classes }, props, state, handleSetState)}
          </Grid>
          <ButtonGroup aria-label={t('groupMembers.ariaLabels.prevNxtButtons')} className={classes.buttonGroupStyle}>
            {prev_page ? (
              <CustomButton
                className={classes.floatLeft}
                size="large"
                startIcon={<NavigateBeforeIcon />}
                onClick={(e, page = prev_page.split('?')[1]) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('groupMembers.prev')}
              </CustomButton>
            ) : null}
            {next_page ? (
              <CustomButton
                className={classes.floatRight}
                size="large"
                endIcon={<NavigateNextIcon />}
                onClick={(e, page = next_page.split('?')[1]) => {
                  handleSetState({ loading: true });
                  handleSetState(fetchPage(page, props));
                }}
                primaryButtonStyle
              >
                {t('groupMembers.next')}
              </CustomButton>
            ) : null}
          </ButtonGroup>
        </Container>
      </Box>
    );
  } else {
    return (
      <>
        {props.auth.members_count !== null && username === props.auth.username ? (
          <CustomButton
            variant="contained"
            className={clsx(common_classes.positionAbsolute, classes.floatingButtonStyle)}
            startIcon={<AddIcon />}
            primaryButtonStyle
            onClick={() => props.navigate(`/creators/${username}/add-members`)}
          >
            {props.t('groupMembers.newMembers')}
          </CustomButton>
        ) : null}
        <ErrorPage error={t('groupMembers.errors.noGroupMembers')} />
      </>
    );
  }
}

GroupMembers.propTypes = {
  auth: PropTypes.object.isRequired,
  toggleFollow: PropTypes.func.isRequired,
  getMembers: PropTypes.func.isRequired,
  removeMember: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({ auth: state.auth });

const mapDispatchToProps = dispatch => ({
  toggleFollow: args => dispatch(UserActions.toggleFollow(args)),
  getMembers: args => dispatch(UserActions.getMembers(args)),
  removeMember: args => dispatch(UserActions.removeMember(args)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupMembers);
