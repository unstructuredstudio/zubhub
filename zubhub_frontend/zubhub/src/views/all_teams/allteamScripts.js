/**
 * @function fetchPage
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const fetchPage = (page, props) => {
  return props.getAllTeams({
    page,
    t: props.t,
    token: props.auth.token,
  });
};

export const followTeam = (groupname, username, props) => {
  let token = props.auth.token;
  props.toggleTeamFollow({ groupname, username, token });
};
