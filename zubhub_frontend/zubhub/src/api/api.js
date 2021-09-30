import i18next from 'i18next';

class API {
  constructor() {
    // this.domain = "dksldkslkdks"
    this.domain =
      process.env.REACT_APP_NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND_PRODUCTION_URL + '/api/'
        : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL + '/api/';
  }

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

  /**********************login with email and password******************************/
  login = ({ username, password }) => {
    const url = 'rest-auth/login/';
    const method = 'POST';
    const body = JSON.stringify({ username, password });

    return this.request({ url, method, body }).then(res => res.json());
  };
  /****************************************************/

  /**********************logout******************************/
  logout = token => {
    const url = 'rest-auth/logout/';
    const method = 'POST';
    return this.request({ url, method, token }).then(res => res.json());
  };
  /****************************************************/

  /**********************signup******************************/
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
  /****************************************************/

  /*****************send email confirmation ******************/
  sendEmailConfirmation = key => {
    const url = 'rest-auth/registration/verify-email/';
    const method = 'POST';
    const body = JSON.stringify({ key });

    return this.request({ url, method, body }).then(res =>
      Promise.resolve(res.status === 200 ? { detail: 'ok' } : res.json()),
    );
  };
  /*******************************************************************/

  /*****************send phone confirmation ******************/
  sendPhoneConfirmation = key => {
    const url = 'creators/verify-phone/';
    const method = 'POST';
    const body = JSON.stringify({ key });

    return this.request({ url, method, body }).then(res =>
      Promise.resolve(res.status === 200 ? { detail: 'ok' } : res.json()),
    );
  };
  /*******************************************************************/

  /********************send password reset link********************************/
  sendPasswordResetLink = email => {
    const url = 'rest-auth/password/reset/';
    const method = 'POST';
    const body = JSON.stringify({ email });

    return this.request({ url, method, body }).then(res =>
      Promise.resolve(res.status === 200 ? { detail: 'ok' } : res.json()),
    );
  };
  /********************************************************************/

  /********************password reset confirmation********************************/
  passwordResetConfirm = ({ new_password1, new_password2, uid, token }) => {
    const url = 'rest-auth/password/reset/confirm/';
    const method = 'POST';
    const body = JSON.stringify({ new_password1, new_password2, uid, token });

    return this.request({ url, method, body }).then(res =>
      Promise.resolve(res.status === 200 ? { detail: 'ok' } : res.json()),
    );
  };
  /********************************************************************/

  /************************** get authenticated user's details **************************/
  getAuthUser = token => {
    const url = 'creators/authUser/';
    return this.request({ url, token }).then(res => res.json());
  };

  /********************************************************************/

  /************************** get user profile **************************/
  getUserProfile = ({ username, token }) => {
    const url = `creators/${username}/`;
    if (token) {
      return this.request({ url, token }).then(res => res.json());
    } else {
      return this.request({ url }).then(res => res.json());
    }
  };

  /*************************** get user projects *********************************/
  getUserProjects = ({ username, page, limit }) => {
    let url;
    if (limit && page) {
      url = `creators/${username}/projects/?limit=${limit}&&${page}`;
    } else if (limit) {
      url = `creators/${username}/projects/?limit=${limit}`;
    } else if (page) {
      url = `creators/${username}/projects/?${page}`;
    } else {
      url = `creators/${username}/projects/`;
    }

    return this.request({ url }).then(res => res.json());
  };
  /*********************************************************************/

  /*************************** search projects *********************************/
  searchProjects = ({ page, query_string }) => {
    let url;
    if (page) {
      url = `projects/search/?q=${query_string}&page=${page}`;
    } else {
      url = `projects/search/?q=${query_string}`;
    }

    return this.request({ url }).then(res => res.json());
  };
  /*********************************************************************/

  /*************************** search creators *********************************/
  searchCreators = ({ page, query_string }) => {
    let url;
    if (page) {
      url = `creators/search/?q=${query_string}&page=${page}`;
    } else {
      url = `creators/search/?q=${query_string}`;
    }

    return this.request({ url }).then(res => res.json());
  };
  /*********************************************************************/

  /********************** get followers *******************************/
  getFollowers = ({ page, username }) => {
    const url = page
      ? `creators/${username}/followers/?${page}`
      : `creators/${username}/followers/`;

    return this.request({ url }).then(res => res.json());
  };
  /*****************************************************************/

  /********************** get following *******************************/
  getFollowing = ({ page, username }) => {
    const url = page
      ? `creators/${username}/following/?${page}`
      : `creators/${username}/following/`;

    return this.request({ url }).then(res => res.json());
  };
  /*****************************************************************/

  /********************** get saved *******************************/
  getSaved = ({ page, token }) => {
    const url = page ? `projects/saved/?${page}` : `projects/saved/`;

    return this.request({ url, token }).then(res => res.json());
  };
  /*****************************************************************/

  /************************** edit user profile **************************/
  editUserProfile = props => {
    const { token, username, email, phone, dateOfBirth, bio, user_location } =
      props;

    const url = 'creators/edit_creator/';
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
  /********************************************************************/

  /************************** delete account **************************/
  deleteAccount = ({ token }) => {
    const url = 'creators/delete/';
    const method = 'DELETE';
    return this.request({ url, method, token }).then(res =>
      Promise.resolve(res.status === 204 ? { detail: 'ok' } : res.json()),
    );
  };
  /********************************************************************/

  /************************** follow creator **************************/
  toggleFollow = ({ id, token }) => {
    const url = `creators/${id}/toggle_follow/`;

    return this.request({ url, token }).then(res => res.json());
  };
  /******************************************************************/

  /********************** get following *******************************/
  getMembers = ({ page, username }) => {
    const url = page
      ? `creators/${username}/members/?${page}`
      : `creators/${username}/members/`;

    return this.request({ url }).then(res => res.json());
  };
  /*****************************************************************/

  /************************** add members **************************/
  addMembers = ({ token, data }) => {
    const url = 'creators/add_members/';
    const method = 'POST';
    const content_type = false;
    const body = data;
    return this.request({ url, method, token, body, content_type }).then(res =>
      res.json(),
    );
  };
  /************************************************************************/

  /************************** remove member from group **************************/
  removeMember = ({ id, token }) => {
    const url = `creators/${id}/remove_member/`;

    return this.request({ url, token }).then(res => res.json());
  };
  /******************************************************************/

  /*****************send phone confirmation ******************/
  sendGroupInviteConfirmation = key => {
    const url = 'creators/confirm_group_invite/';
    const method = 'POST';
    const body = JSON.stringify({ key });

    return this.request({ url, method, body }).then(res =>
      Promise.resolve(res.status === 200 ? { detail: 'ok' } : res.json()),
    );
  };
  /*******************************************************************/

  /************************** get all locations **************************/
  getLocations = () => {
    const url = 'creators/locations/';
    return this.request({ url }).then(res => res.json());
  };
  /********************************************************************/

  /************************** create project **************************/
  createProject = ({
    token,
    title,
    description,
    video,
    images,
    materials_used,
    category,
    tags,
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
    });
    return this.request({ url, method, token, body }).then(res => res.json());
  };
  /************************************************************************/

  /************************** update project **************************/
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
    });
    return this.request({ url, method, token, body }).then(res => res.json());
  };
  /************************************************************************/

  /************************** delete project **************************/
  deleteProject = ({ token, id }) => {
    const url = `projects/${id}/delete/`;
    const method = 'DELETE';
    return this.request({ url, method, token }).then(res =>
      Promise.resolve(res.status === 204 ? { detail: 'ok' } : res.json()),
    );
  };
  /************************************************************************/

  /************************** unpublish comment **************************/
  unpublishComment = ({ token, id }) => {
    const url = `projects/${id}/unpublish_comment/`;
    const method = 'PATCH';
    const body = JSON.stringify({});
    return this.request({ url, method, token, body }).then(res =>
      Promise.resolve(
        res.status === 200 ? res.json() : { details: 'unknown error' },
      ),
    );
  };
  /************************************************************************/

  /************************** delete comment **************************/
  deleteComment = ({ token, id }) => {
    const url = `projects/${id}/delete_comment/`;
    const method = 'DELETE';
    return this.request({ url, method, token }).then(res =>
      Promise.resolve(res.status === 204 ? { detail: 'ok' } : res.json()),
    );
  };
  /************************************************************************/

  /************************** get projects **************************/
  getProjects = ({ page }) => {
    const url = page ? `projects/?${page}` : `projects/`;
    return this.request({ url }).then(res => res.json());
  };
  /*************************************************************/

  /************************** get categories **************************/
  getCategories = () => {
    const url = 'projects/categories/';
    return this.request({ url }).then(res => res.json());
  };
  /*************************************************************/

  /************************** suggest tags **************************/
  suggestTags = value => {
    const url = `projects/tags/search/?q=${value}`;
    return this.request({ url }).then(res => res.json());
  };
  /*************************************************************/

  /************************** get staff picks **************************/
  getStaffPicks = () => {
    const url = 'projects/staff_picks/';
    return this.request({ url }).then(res => res.json());
  };
  /******************************************************************/

  getStaffPick = ({ page, id }) => {
    const url = page
      ? `projects/staff_picks/${id}/?page=${page}`
      : `projects/staff_picks/${id}`;

    return this.request({ url }).then(res => res.json());
  };
  /*****************************************************************/

  /************************** get project **************************/
  getProject = ({ id, token }) => {
    const url = `projects/${id}`;
    if (token) {
      return this.request({ url, token }).then(res => res.json());
    } else {
      return this.request({ url }).then(res => res.json());
    }
  };

  /************************** like project **************************/
  toggleLike = ({ id, token }) => {
    const url = `projects/${id}/toggle_like/`;

    return this.request({ url, token }).then(res => res.json());
  };
  /******************************************************************/

  /************************** save project for future viewing **************************/
  toggleSave = ({ id, token }) => {
    const url = `projects/${id}/toggle_save/`;

    return this.request({ url, token }).then(res => res.json());
  };
  /******************************************************************/

  /************************** add comment **************************/
  addComment = ({ id, text, token, parent_id }) => {
    const url = `projects/${id}/add_comment/`;
    const method = 'POST';
    const body = JSON.stringify({ text, parent_id });

    return this.request({ url, method, body, token }).then(res => res.json());
  };

  /************************** add profile comment **************************/
  addProfileComment = ({ id, text, token, parent_id }) => {
    const url = `creators/${id}/add_comment/`;
    const method = 'POST';
    const body = JSON.stringify({ text, parent_id });

    return this.request({ url, method, body, token }).then(res => res.json());
  };
  /***********************************************************************/

  /************************** get hero **************************/
  getHero = () => {
    const url = `hero/`;

    return this.request({ url }).then(res => res.json());
  };

  /************************** get help **************************/
  getHelp = () => {
    const url = `help/`;

    return this.request({ url }).then(res => res.json());
  };

  /************************** get privacy **************************/
  getPrivacy = () => {
    const url = `privacy/`;

    return this.request({ url }).then(res => res.json());
  };

  /************************** get faqs **************************/
  getFaqs = () => {
    const url = `faqs/`;

    return this.request({ url }).then(res => res.json());
  };

  getSignature = args => {
    const url = 'signature/';
    const method = 'POST';
    const token = args.token;
    delete args.token;
    const body = JSON.stringify({ ...args });
    return this.request({ url, method, token, body }).then(res => res.json());
  };
}

export default API;
