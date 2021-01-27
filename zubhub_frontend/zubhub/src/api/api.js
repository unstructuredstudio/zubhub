class API {
  constructor() {
    this.domain =
      process.env.REACT_APP_NODE_ENV === 'production'
        ? process.env.REACT_APP_BACKEND_PRODUCTION_URL + '/api/'
        : process.env.REACT_APP_BACKEND_DEVELOPMENT_URL + '/api/';
  }

  request = ({ url = '/', method = 'GET', token, body }) => {
    if (method === 'GET' && !token) {
      return fetch(this.domain + url, {
        method,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        withCredentials: 'true',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      });
    } else if (token && body) {
      return fetch(this.domain + url, {
        method,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        withCredentials: 'true',
        headers: new Headers({
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
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
          'Content-Type': 'application/json',
        }),
      });
    } else if (body) {
      return fetch(this.domain + url, {
        method,
        xsrfCookieName: 'csrftoken',
        xsrfHeaderName: 'X-CSRFToken',
        withCredentials: 'true',
        headers: new Headers({
          'Content-Type': 'application/json',
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
    dateOfBirth,
    user_location,
    password1,
    password2,
  }) => {
    const url = 'rest-auth/registration/';
    const method = 'POST';
    const body = JSON.stringify({
      username,
      email,
      dateOfBirth,
      location: user_location,
      password1,
      password2,
    });

    return this.request({ url, method, body }).then(res => res.json());
  };
  /****************************************************/

  /*****************send email confirmation ******************/
  send_email_confirmation = key => {
    const url = 'rest-auth/registration/verify-email/';
    const method = 'POST';
    const body = JSON.stringify({ key });

    return this.request({ url, method, body }).then(res => res.json());
  };
  /*******************************************************************/

  /********************send password reset link********************************/
  send_password_reset_link = email => {
    const url = 'rest-auth/password/reset/';
    const method = 'POST';
    const body = JSON.stringify({ email });

    return this.request({ url, method, body }).then(res => res.json());
  };
  /********************************************************************/

  /********************password reset confirmation********************************/
  password_reset_confirm = ({ new_password1, new_password2, uid, token }) => {
    const url = 'rest-auth/password/reset/confirm/';
    const method = 'POST';
    const body = JSON.stringify({ new_password1, new_password2, uid, token });

    return this.request({ url, method, body }).then(res => res.json());
  };
  /********************************************************************/

  /************************** get authenticated user's details **************************/
  get_auth_user = token => {
    const url = 'creators/authUser/';
    return this.request({ url, token }).then(res => res.json());
  };

  /********************************************************************/

  /************************** get user profile **************************/
  get_user_profile = ({ username, token }) => {
    const url = `creators/${username}/`;
    if (token) {
      return this.request({ url, token }).then(res => res.json());
    } else {
      return this.request({ url }).then(res => res.json());
    }
  };

  /*************************** get user projects *********************************/
  get_user_projects = ({ username, page, limit }) => {
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

  /********************** get followers *******************************/
  get_followers = ({ page, username }) => {
    const url = page
      ? `creators/${username}/followers/?${page}`
      : `creators/${username}/followers/`;

    return this.request({ url }).then(res => res.json());
  };
  /*****************************************************************/

  /********************** get following *******************************/
  get_following = ({ page, username }) => {
    const url = page
      ? `creators/${username}/following/?${page}`
      : `creators/${username}/following/`;

    return this.request({ url }).then(res => res.json());
  };
  /*****************************************************************/

  /********************** get saved *******************************/
  get_saved = ({ page, token }) => {
    const url = page ? `projects/saved/?${page}` : `projects/saved/`;

    return this.request({ url, token }).then(res => res.json());
  };
  /*****************************************************************/

  /************************** edit user profile **************************/
  edit_user_profile = profile => {
    const { username } = profile;

    const url = 'creators/edit_creator/';
    const method = 'PUT';
    const token = profile.token;
    const body = JSON.stringify({ username });
    return this.request({ url, method, token, body }).then(res => res.json());
  };
  /********************************************************************/

  /************************** follow creator **************************/
  toggle_follow = ({ id, token }) => {
    const url = `creators/${id}/toggle_follow/`;

    return this.request({ url, token }).then(res => res.json());
  };
  /******************************************************************/

  /************************** get all locations **************************/
  get_locations = () => {
    const url = 'creators/locations/';
    return this.request({ url }).then(res => res.json());
  };
  /********************************************************************/

  /************************** create project **************************/
  create_project = ({
    token,
    title,
    description,
    video,
    images,
    materials_used,
  }) => {
    const url = 'projects/create/';
    const method = 'POST';
    const body = JSON.stringify({
      title,
      description,
      images,
      video,
      materials_used,
    });
    return this.request({ url, method, token, body }).then(res => res.json());
  };
  /************************************************************************/

  /************************** update project **************************/
  update_project = ({
    token,
    id,
    title,
    description,
    video,
    images,
    materials_used,
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
    });
    return this.request({ url, method, token, body }).then(res => res.json());
  };
  /************************************************************************/

  /************************** delete project **************************/
  delete_project = ({ token, id }) => {
    const url = `projects/${id}/delete/`;
    const method = 'DELETE';
    return this.request({ url, method, token }).then(res => ({
      detail:
        res.status === 204
          ? 'ok'
          : 'An error occured while deleting project. Please try again later',
    }));
  };
  /************************************************************************/

  /************************** get projects **************************/
  get_projects = page => {
    const url = page ? `projects/?${page}` : `projects/`;
    return this.request({ url }).then(res => res.json());
  };

  /************************** get project **************************/
  get_project = ({ id, token }) => {
    const url = `projects/${id}`;
    if (token) {
      return this.request({ url, token }).then(res => res.json());
    } else {
      return this.request({ url }).then(res => res.json());
    }
  };

  /************************** like project **************************/
  toggle_like = ({ id, token }) => {
    const url = `projects/${id}/toggle_like/`;

    return this.request({ url, token }).then(res => res.json());
  };
  /******************************************************************/

  /************************** save project for future viewing **************************/
  toggle_save = ({ id, token }) => {
    const url = `projects/${id}/toggle_save/`;

    return this.request({ url, token }).then(res => res.json());
  };
  /******************************************************************/

  /************************** add comment **************************/
  add_comment = ({ id, text, token }) => {
    const url = `projects/${id}/add_comment/`;
    const method = 'POST';
    const body = JSON.stringify({ text });

    return this.request({ url, method, body, token }).then(res => res.json());
  };
}

export default API;
