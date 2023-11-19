import i18next from 'i18next';
import { sanitizeObject } from '../utils.js';
/**
 * API class containing all the calls to the backend api endpoints
 */
class API {
  constructor() {
    /**
     * @property {string}  this.domain - url string of the domain + root url path.
     * Is used as base url to be extended while making API requests
     */
    this.domain =
      process.env.REACT_APP_NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND_PRODUCTION_URL + '/api/'
        : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL + '/api/';
  }

  /**
   * @method request - Constructs the request object and sends it to the backend
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @param {string} url - the api endpoint
   * @param {string} method - the http method of the request to be constructed
   * @param {string} token - the user auth token if provided
   * @param {string} body - request body
   * @param {string} content_type - content type to be used for the request
   * @returns {Promise<>}
   */
  request = ({
    url = '/',
    method = 'GET',
    token,
    body,
    content_type = 'application/json',
  }) => {
    if (method === 'GET' && !token) {
      return fetch(this.domain + url, {
        method,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        withCredentials: 'true',
        headers: new Headers({
          'Content-Type': content_type,
          'Accept-Language': `${i18next.language},en;q=0.5`,
        }),
      });
    } else if (token && body) {
      return fetch(this.domain + url, {
        method,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        withCredentials: 'true',
        headers: content_type
          ? new Headers({
            Authorization: `Token ${token}`,
            'Content-Type': content_type,
            'Accept-Language': `${i18next.language},en;q=0.5`,
          })
          : new Headers({
            Authorization: `Token ${token}`,
            'Accept-Language': `${i18next.language},en;q=0.5`,
          }),
        body,
      });
    } else if (token) {
      return fetch(this.domain + url, {
        method,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        withCredentials: 'true',
        headers: new Headers({
          Authorization: `Token ${token}`,
          'Content-Type': content_type,
          'Accept-Language': `${i18next.language},en;q=0.5`,
        }),
      });
    } else if (body) {
      return fetch(this.domain + url, {
        method,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        withCredentials: 'true',
        headers: new Headers({
          'Content-Type': content_type,
          'Accept-Language': `${i18next.language},en;q=0.5`,
        }),
        body,
      });
    }
  };

  /**
   * @method login - login with email and password
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  login = ({ username, password }) => {
    const url = 'rest-auth/login/';
    const method = 'POST';
    const body = JSON.stringify({ username, password });

    return this.request({ url, method, body }).then(res => res.json());
  };

  /**
   * @method theme - get the latest theme from the backend
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  theme = () => {
    const url = 'theme/';
    const method = 'GET';
    // const body = JSON.stringify({ username, password });

    return this.request({ url, method }).then(res => res.json());
  };

  /**
   * @method logout - logout a user with the user's token
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  logout = token => {
    const initialUrl = window.location.href
    sessionStorage.setItem('initialUrl', initialUrl)

    const url = 'rest-auth/logout/';
    const method = 'POST';
    return this.request({ url, method, token }).then(res => res.json());
  };

  /**
   * @method signup - create an account for a user with the user's details
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  signup = ({
    username,
    email,
    phone,
    dateOfBirth,
    user_location,
    password1,
    password2,
    bio,
    subscribe,
  }) => {
    const url = 'creators/register/';
    const method = 'POST';
    const body = JSON.stringify({
      username,
      email,
      phone,
      dateOfBirth,
      location: user_location,
      password1,
      password2,
      bio,
      subscribe,
    });

    return this.request({ url, method, body }).then(res => res.json());
  };

  /**
   * @method sendEmailConfirmation - verify a user's email by making api call
   *         to this endpoint with the provided key
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  sendEmailConfirmation = key => {
    const url = 'rest-auth/registration/verify-email/';
    const method = 'POST';
    const body = JSON.stringify({ key });

    return this.request({ url, method, body }).then(res =>
      Promise.resolve(res.status === 200 ? { detail: 'ok' } : res.json()),
    );
  };

  /**
   * @method sendPhoneConfirmation - verify a user's phone number by making api call
   *         to this endpoint with the provided key
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  sendPhoneConfirmation = key => {
    const url = 'creators/verify-phone/';
    const method = 'POST';
    const body = JSON.stringify({ key });

    return this.request({ url, method, body }).then(res =>
      Promise.resolve(res.status === 200 ? { detail: 'ok' } : res.json()),
    );
  };

  /**
   * @method sendPasswordResetLink
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  sendPasswordResetLink = email => {
    const url = 'rest-auth/password/reset/';
    const method = 'POST';
    const body = JSON.stringify({ email });

    return this.request({ url, method, body }).then(res =>
      Promise.resolve(res.status === 200 ? { detail: 'ok' } : res.json()),
    );
  };

  /**
   * @method passwordResetConfirm
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  passwordResetConfirm = ({ new_password1, new_password2, uid, token }) => {
    const url = 'rest-auth/password/reset/confirm/';
    const method = 'POST';
    const body = JSON.stringify({ new_password1, new_password2, uid, token });

    return this.request({ url, method, body }).then(res =>
      Promise.resolve(res.status === 200 ? { detail: 'ok' } : res.json()),
    );
  };

  /**
   * @method getAuthUser - make api request to this endpoint providing a valid user token to
   *         get the user profile of the user with the provided token
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getAuthUser = token => {
    const url = 'creators/auth-user/';
    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method getAccountStatus - make api request to this endpoint providing a valid user token to
   *         get the account status of the creator the token belongs to.
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getAccountStatus = token => {
    const url = 'creators/account-status/';
    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method getUserProfile - get the user profile of the user that the username belongs to
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getUserProfile = ({ username, token }) => {
    const url = `creators/${username}/`;
    if (token) {
      return this.request({ url, token }).then(res => res.json());
    } else {
      return this.request({ url }).then(res => res.json());
    }
  };

  /**
   * @method getTeamProfile - get the team profile of the user that the groupname belongs to
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  getTeamProfile = ({ groupname, token }) => {
    const url = `creators/group/${groupname}/`;
    if (token) {
      return this.request({ url, token }).then(res => res.json());
    } else {
      return this.request({ url }).then(res => res.json());
    }
  };

  /**
   * @method removeTeamMember
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  removeTeamMember = ({ groupname, username, token }) => {
    const url = `creators/${groupname}/remove-member/${username}/`;
    const method = 'DELETE';
    if (token) {
      return this.request({ url, method ,token }).then(res => res.json());
    } else {
      return this.request({ url, method }).then(res => res.json());
    }
  };

  /**
   * @method followTeam
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  followTeam = ({ groupname, username, token }) => {
    const url = `creators/${groupname}/toggle-follow/${username}/`;
    const method = 'GET';
    if (token) {
      return this.request({ url, method ,token }).then(res => res.json());
    } else {
      return this.request({ url, method }).then(res => res.json());
    }
  };

  /**
   * @method teamMembers
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  teamMembers = ({ groupname, token }) => {
    const url = `creators/${groupname}/members/`;
    const method = 'GET';
    if (token) {
      return this.request({ url, method ,token }).then(res => res.json());
    } else {
      return this.request({ url, method }).then(res => res.json());
    }
  };

  /**
   * @method teamMembersId
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  teamMembersId = ( id ) => {
    const url = `creators/id/${id}/`;
    const method = 'GET';
    return this.request({ url, method }).then(res => res.json());
  };

  /**
   * @method deleteTeam
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  deleteTeam = ({ groupname, token }) => {
    const url = `creators/${groupname}/delete-group/`;
    const method = 'DELETE';
    if (token) {
      return this.request({ url, method ,token }).then(res => res.json());
    } else {
      return this.request({ url, method }).then(res => res.json());
    }
  };

  /**
   * @method teamFollowers
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  teamFollowers = ({ groupname, token }) => {
    const url = `creators/${groupname}/group-followers/`;
    const method = 'GET';
    if (token) {
      return this.request({ url, method ,token }).then(res => res.json());
    } else {
      return this.request({ url, method }).then(res => res.json());
    }
  };

  /**
   * @method userTeams
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  userTeams = ({ username, token }) => {
    const url = `creators/groups/${username}/`;
    const method = 'GET';
    if (token) {
      return this.request({ url, method ,token }).then(res => res.json());
    } else {
      return this.request({ url, method }).then(res => res.json());
    }
  };

  /**
   * @method allTeams
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  allTeams = ({ token }) => {
    const url = `creators/teams/`;
    const method = 'GET';
    if (token) {
      return this.request({ url, method ,token }).then(res => res.json());
    } else {
      return this.request({ url, method }).then(res => res.json());
    }
  };

  /**
   * @method addTeamMembers
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  addTeamMembers = ({ groupname, data, token }) => {
    const url = `creators/${groupname}/add-members/`;
    const method = 'POST';
    const content_type = false;
    const body = data;
    if (token) {
      return this.request({ url, method ,token, body, content_type }).then(res => res.json());
    } else {
      return this.request({ url, method }).then(res => res.json());
    }
  };

  /**
   * @method editTeam
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  editTeam = ({ groupname, data, token }) => {
    const url = `creators/${groupname}/edit-group/`;
    const method = 'POST';
    const content_type = 'application/json';
    const body = JSON.stringify(data);
  
    if (token) {
      return this.request({ url, method, token, body, content_type }).then(res => res.json());
    } else {
      return this.request({ url, method, body, content_type }).then(res => res.json());
    }
  };

  /**
   * @method createTeam
   * @author Hemant Kumar Singh <hks@iamhks.com>
   *
   * @todo - describe method's signature
   */
  createTeam = ({ data, token }) => {
    const url = `creators/create-group/`;
    const method = 'POST';
    const content_type = 'application/json';
    const body = JSON.stringify(data);
    if (token) {
      return this.request({ url, method ,token, body, content_type }).then(res => res.json());
    } else {
      return this.request({ url, method }).then(res => res.json());
    }
  };

  /**
   * @method getUserProjects - get a paginated list of projects
   *         created by the user with the provided username
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getUserProjects = ({ username, page, limit, token, project_to_omit }) => {
    let url = `creators/${username}/projects`;
    let queryParams = sanitizeObject({ page, limit, project_to_omit })
    const searchParams = new URLSearchParams(queryParams);
    url = `${url}?${searchParams}`;
    return this.request({ url, token }).then(res => res.json());
  };

  getUserActivity = (username, page) => {
    let url = `activitylog/${username}/?page=${page}`;

    return this.request({ url }).then(res => res.json());
  };

  /**
   * @method getUserDrafts - get a paginated list of drafts
   *         created by the user with the provided username
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getUserDrafts = ({ username, page, limit, token }) => {
    let url;
    if (limit && page) {
      url = `creators/${username}/drafts/?limit=${limit}&&${page}`;
    } else if (limit) {
      url = `creators/${username}/drafts/?limit=${limit}`;
    } else if (page) {
      url = `creators/${username}/drafts/?${page}`;
    } else {
      url = `creators/${username}/drafts/`;
    }

    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method searchProjects - perform full-text search of projects
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  searchProjects = ({ page, token, query_string, criteria }) => {
    const params = { q: query_string, criteria };
    if (page) {
      params[page] = page;
    }

    const searchParams = new URLSearchParams(params);
    const url = `projects/search/?${searchParams.toString()}`;

    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method searchCreators
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  searchCreators = ({ page, token, query_string }) => {
    let url;
    if (page) {
      url = `creators/search/?q=${query_string}&page=${page}`;
    } else {
      url = `creators/search/?q=${query_string}`;
    }

    return this.request({ url, token }).then(res => res.json());
  };

  searchTags = ({ query }) => {
    const url = `projects/tags/search/?q=${query}`;

    return this.request({ url }).then(res => res.json());
  };

  autocompleteTags = ({ query, token }) => {
    const url = `projects/tags/autocomplete/?q=${query}`;

    return this.request({ url, token }).then(res => res.json());
  };

  autocompleteProjects = ({ query, token }) => {
    const url = `projects/autocomplete/?q=${query}`;

    return this.request({ url, token }).then(res => res.json());
  };

  autocompleteCreators = ({ query, token }) => {
    const url = `creators/autocomplete/?q=${query}`;

    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method getFollowers - get a list of users that a username is following
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getFollowers = ({ page, username }) => {
    const url = page
      ? `creators/${username}/followers/?${page}`
      : `creators/${username}/followers/`;

    return this.request({ url }).then(res => res.json());
  };

  /**
   * @method getFollowing
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getFollowing = ({ page, username }) => {
    const url = page
      ? `creators/${username}/following/?${page}`
      : `creators/${username}/following/`;

    return this.request({ url }).then(res => res.json());
  };

  /**
   * @method getSaved - get a list of projects bookmarked by the user with the given token
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getSaved = ({ page, token }) => {
    const url = page ? `projects/saved/?${page}` : `projects/saved/`;

    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method editUserProfile
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  editUserProfile = props => {
    const { token, username, email, phone, dateOfBirth, bio, user_location } =
      props;

    const url = 'creators/edit-creator/';
    const method = 'PUT';
    const body = JSON.stringify({
      username,
      email,
      phone,
      dateOfBirth,
      bio,
      location: user_location,
    });
    return this.request({ url, method, token, body }).then(res => res.json());
  };

  /**
   * @method deleteAccount
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  deleteAccount = ({ token }) => {
    const url = 'creators/delete/';
    const method = 'DELETE';
    return this.request({ url, method, token }).then(res =>
      Promise.resolve(res.status === 204 ? { detail: 'ok' } : res.json()),
    );
  };

  /**
   * @method toggleFollow
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  toggleFollow = ({ id, token }) => {
    const url = `creators/${id}/toggle-follow/`;

    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method getMembers
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getMembers = ({ page, username }) => {
    const url = page
      ? `creators/${username}/members/?${page}`
      : `creators/${username}/members/`;

    return this.request({ url }).then(res => res.json());
  };

  /**
   * @method addMembers
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  addMembers = ({ token, data }) => {
    const url = 'creators/add-members/';
    const method = 'POST';
    const content_type = false;
    const body = data;
    return this.request({ url, method, token, body, content_type }).then(res =>
      res.json(),
    );
  };

  /**
   * @method removeMember
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  removeMember = ({ id, token }) => {
    const url = `creators/${id}/remove-member/`;

    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method sendGroupInviteConfirmation
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  sendGroupInviteConfirmation = key => {
    const url = 'creators/confirm-group-invite/';
    const method = 'POST';
    const body = JSON.stringify({ key });

    return this.request({ url, method, body }).then(res =>
      Promise.resolve(res.status === 200 ? { detail: 'ok' } : res.json()),
    );
  };

  /**
   * @method getLocations
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getLocations = () => {
    const url = 'creators/locations/';
    return this.request({ url }).then(res => res.json());
  };

  /**
   * @method createProject
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  createProject = ({
    token,
    title,
    description,
    video,
    images,
    materials_used,
    category,
    tags,
    publish,
    activity,
  }) => {
    const url = 'projects/create/';
    const method = 'POST';
    const body = JSON.stringify({
      title,
      description,
      images,
      video,
      materials_used,
      category,
      tags,
      publish,
      activity,
    });
    return this.request({ url, method, token, body }).then(res => res.json());
  };

  /**
   * @method updateProject
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  updateProject = ({
    token,
    id,
    title,
    description,
    video,
    images,
    materials_used,
    category,
    tags,
    publish,
  }) => {
    const url = `projects/${id}/update/`;
    const method = 'PATCH';

    const body = JSON.stringify({
      id,
      title,
      description,
      images,
      video,
      materials_used,
      category,
      tags,
      publish,
    });
    return this.request({ url, method, token, body }).then(res => res.json());
  };

  /**
   * @method deleteProject
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  deleteProject = ({ token, id }) => {
    const url = `projects/${id}/delete/`;
    const method = 'DELETE';
    return this.request({ url, method, token }).then(res =>
      Promise.resolve(res.status === 204 ? { detail: 'ok' } : res.json()),
    );
  };

  /**
   * @method shouldUploadToLocal
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  shouldUploadToLocal = ({ token }) => {
    const url = 'upload-file-to-local/';
    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method unpublishComment
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  unpublishComment = ({ token, id }) => {
    const url = `projects/${id}/unpublish-comment/`;
    const method = 'PATCH';
    const body = JSON.stringify({});
    return this.request({ url, method, token, body }).then(res =>
      Promise.resolve(
        res.status === 200 ? res.json() : { details: 'unknown error' },
      ),
    );
  };

  /**
   * @method deleteComment
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  deleteComment = ({ token, id }) => {
    const url = `projects/${id}/delete-comment/`;
    const method = 'DELETE';
    return this.request({ url, method, token }).then(res =>
      Promise.resolve(res.status === 204 ? { detail: 'ok' } : res.json()),
    );
  };

  /**
   * @method getProjects
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getProjects = ({ token, page }) => {
    const url = page ? `projects/?page=${page}` : `projects/`;
    return this.request({ token, url }).then(res => res.json());
  };

  /**
  * @method getActivity
  * @author Yaya Mamoudou <yayamamoudou0@gmail.com>
  *
  * @todo - describe method's signature
  */
  getActivity = ({ token, id }) => {
    const url = `activities/${id}`;
    return this.request({ token, url }).then(res => res.json());
  };

  /**
   * @method getCategories
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getCategories = () => {
    const url = 'projects/categories/';
    return this.request({ url }).then(res => res.json());
  };

  /**
   * @method suggestTags
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  suggestTags = value => {
    const url = `projects/tags/autocomplete/?q=${value}`;
    return this.request({ url }).then(res => res.json());
  };

  /**
   * @method getStaffPicks
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getStaffPicks = ({ token }) => {
    const url = 'projects/staff-picks/';
    return this.request({ token, url }).then(res => res.json());
  };

  /**
   * @method getStaffPick
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getStaffPick = ({ token, page, id }) => {
    const url = page
      ? `projects/staff-picks/${id}/?page=${page}`
      : `projects/staff-picks/${id}`;

    return this.request({ token, url }).then(res => res.json());
  };

  /**
   * @method getProject
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getProject = ({ id, token }) => {
    const url = `projects/${id}`;
    if (token) {
      return this.request({ url, token }).then(res => res.json());
    } else {
      return this.request({ url }).then(res => res.json());
    }
  };

  /**
   * @method toggleLike
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  toggleLike = ({ id, token }) => {
    const url = `projects/${id}/toggle-like/`;

    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method toggleSave
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  toggleSave = ({ id, token }) => {
    const url = `projects/${id}/toggle-save/`;

    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method addComment
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  addComment = ({ id, text, token, parent_id }) => {
    const url = `projects/${id}/add-comment/`;
    const method = 'POST';
    const body = JSON.stringify({ text, parent_id });

    return this.request({ url, method, body, token }).then(res => res.json());
  };

  /**
   * @method viewNotification
   *
   * @todo - describe method's signature
   */
  viewNotification = async ({ id, token, body }) => {
    const url = `notifications/${id}/update/`;
    const method = 'PUT';
    const bodyString = JSON.stringify(body);
    const res = await this.request({ url, method, body: bodyString, token });
    return res.json();
  };

  /**
   * @method addProfileComment
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  addProfileComment = ({ id, text, token, parent_id }) => {
    const url = `creators/${id}/add-comment/`;
    const method = 'POST';
    const body = JSON.stringify({ text, parent_id });

    return this.request({ url, method, body, token }).then(res => res.json());
  };

  /**
   * @method getHero
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getHero = () => {
    const url = `hero/`;

    return this.request({ url }).then(res => res.json());
  };

  /**
   * @method getHelp
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getHelp = () => {
    const url = `help/`;

    return this.request({ url }).then(res => res.json());
  };

  /**
 * @method getChallenge
 * @author Suchakra Sharma <suchakra@unstructured.studio>
 *
 */
  getChallenge = () => {
    const url = `challenge/`;

    return this.request({ url }).then(res => res.json());
  };

  /**
   * @method getPrivacy
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getPrivacy = () => {
    const url = `privacy/`;

    return this.request({ url }).then(res => res.json());
  };

  /**
   * @method getFaqs
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getFaqs = () => {
    const url = `faqs/`;

    return this.request({ url }).then(res => res.json());
  };

  /**
   * @method getAmbassadors
   * @author Srishti Sethi <srishti@unstructured.studio>
   *
   * @todo - describe method's signature
   */
  getAmbassadors = ({ token, page }) => {
    const url = page
      ? `ambassadors/?page=${page}`
      : `ambassadors`;

    return this.request({ token, url }).then(res => res.json());
  };

  /**
   * Gets a user's notifications
   * @param {number} page the page of notifications to get
   * @param {string} token the user's auth token
   * @returns the user's notifications
   */
  getNotifications = (page, token) => {
    const url = 'notifications/?' + new URLSearchParams({ page }).toString();

    return this.request({ url, token }).then(res => res.json());
  };

  /**
   * @method getSignature
   * @author Raymond Ndibe <ndiberaymond1@gmail.com>
   *
   * @todo - describe method's signature
   */
  getSignature = args => {
    const url = 'signature/';
    const method = 'POST';
    const token = args.token;
    delete args.token;
    const body = JSON.stringify({ ...args });
    return this.request({ url, method, token, body }).then(res => res.json());
  };

  createActivity = (token, args) => {
    const url = 'activities/create/';
    const method = 'POST';
    const body = JSON.stringify(args);

    return this.request({ url, method, token, body });
    // .then(res => res.json());
  };

  updateActivity = (token, id, args) => {
    const url = `activities/${id}/update/`;
    const method = 'PATCH';
    // const {
    //   title,
    //   motivation,
    //   learning_goals,
    //   materials_used,
    //   materials_used_image,
    //   facilitation_tips,
    //   activity_images,
    //   making_steps,
    //   inspiring_examples,
    //   inspiring_artist,
    //   video,
    // } = args;

    const body = JSON.stringify(args);
    return this.request({ url, method, token, body });
    //.then(res => res.json());
  };

  deleteActivity = ({ token, id }) => {
    const url = `activities/${id}/delete/`;
    const method = 'DELETE';
    return this.request({ url, method, token });
  };

  getActivities = (params) => {

    let queryParams = sanitizeObject(params)
    const searchParams = new URLSearchParams(queryParams);
    let url = `activities`;
    url = `${url}?${searchParams}`;
    return this.request({ url, method: 'GET' });
    // .then(res => res.json());
  };

  getUnPublishedActivities = token => {
    const url = 'activities/unPublished';
    return this.request({ url, method: 'GET', token });
  };

  getMyActivities = token => {
    const url = 'activities/myActivities';
    return this.request({ url, method: 'GET', token });
  };

  activityToggleSave = ({ id, token }) => {
    const url = `activities/${id}/toggle-save/`;

    return this.request({ url, token }).then(res => res.json());
  };

  activityTogglePublish = ({ id, token }) => {
    const url = `activities/${id}/toggle-publish/`;
    return this.request({ url, token }).then(res => res.json());
  };
}

export default API;
