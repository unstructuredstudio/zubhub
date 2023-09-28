import ZubhubAPI from '../../api';
import * as ProjectActions from './projectActions';
import * as AuthActions from './authActions';
import { toast } from 'react-toastify';

const API = new ZubhubAPI();

/**
 * @function getUserProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getUserProfile = args => {
  return dispatch => {
    let profile;
    return API.getUserProfile(args)
      .then(res => {
        if (!res.username) {
          throw new Error(args.t('profile.errors.profileFetchError'));
        } else {
          profile = res;
          return dispatch(
            ProjectActions.getUserProjects({
              username: res.username,
              limit: 4,
              token: args.token,
              t: args.t
            }),
          );
        }
      })
      .then(res => {
        return { ...res, profile, loading: false };
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function getUserTeams
 * @author Hemant <hks@iamhks.com>
 *
 * @todo - describe function's signature
 */
export const deleteTeam = args => {
  return dispatch => {
    return API.deleteTeam(args)
    .then(res => {
      if (res.detail !== 'Group deleted successfully.') {
        throw new Error(res.detail);
      } else {
        toast.success(args.t('profile.delete.toastSuccess'));
        // args.logout(args);
        args.history.push('/profile');
      }
    })
    .catch(error => {
      if (error.message.startsWith('Unexpected')) {
        return {
          dialog_error: args.t('profile.delete.errors.unexpected'),
        };
      } else {
        return { dialog_error: error.message };
      }
    });
  };
};

/**
 * @function getUserTeams
 * @author Hemant <hks@iamhks.com>
 *
 * @todo - describe function's signature
 */
export const getUserTeams = args => {
  return dispatch => {
    let profile;
    return API.userTeams(args)
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function getTeamProfile
 * @author Hemant <hks@iamhks.com>
 *
 * @todo - describe function's signature
 */
export const getTeamProfile = args => {
  return dispatch => {
    let profile;
    return API.getTeamProfile(args)
      .then(res => {
        profile=res;
        return { ...res, profile, loading: false };
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function getAllTeams
 * @author Hemant <hks@iamhks.com>
 *
 * @todo - describe function's signature
 */
export const getAllTeams = args => {
  return dispatch => {
    let profile;
    return API.allTeams(args)
    .then(res => {
      profile = res;
      const filteredResults = res.results.filter(result => result.members.length > 0);

      return { ...res, profile, results: filteredResults, loading: false };
    })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function editTeamProfile
 * @author Hemant <hks@iamhks.com>
 *
 * @todo - describe function's signature
 */
export const editTeam = args => {
  return dispatch => {
    let profile;
    return API.editTeam(args)
      .then(res => {
        profile=res;
        return { ...res, profile, loading: false };
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function editUserProfile
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const editUserProfile = args => {
  return dispatch => {
    return API.editUserProfile(args).then(res => {
      if (res.id) {
        dispatch(
          AuthActions.setAuthUser({
            avatar: res.avatar,
            username: res.username,
          }),
        );

        return { profile: res };
      } else {
        throw new Error(JSON.stringify(res));
      }
    });
  };
};

/**
 * @function suggestCreators
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const suggestCreators = args => {
  return () => {
    return API.searchCreators(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return res.results.length > 0
            ? { creator_suggestion: res.results }
            : { creator_suggestion_open: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { creator_suggestion_open: false };
      });
  };
};

/**
 * @function searchCreators
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const searchCreators = args => {
  return () => {
    return API.searchCreators(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return { ...res, loading: false, tab: args.tab };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('projects.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false, tab: args.tab };
      });
  };
};

/**
 * @function toggleFollow
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const toggleFollow = args => {
  return () => {
    return API.toggleFollow(args)
      .then(res => {
        if (res.username) {
          return { profile: res };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function toggleTeamFollow
 * @author Hemant <hks@iamhks.com>
 *
 * @todo - describe function's signature
 */
export const toggleTeamFollow = args => {
  return () => {
    return API.followTeam(args)
    // .then(res => {
      
    //   } else {
    //     res = Object.keys(res)
    //       .map(key => res[key])
    //       .join('\n');
    //     throw new Error(res);
    //   }
    // })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function removeMember
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const removeMember = args => {
  return () => {
    return API.removeMember(args)
      .then(res => {
        if (res.username) {
          return { profile: res };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('groupMembers.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function addMembers
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const addMembers = args => {
  return () => {
    return API.addMembers(args).then(res => {
      if (!res.id) {
        throw new Error(JSON.stringify(res));
      } else {
        toast.success(args.t('addGroupMembers.createToastSuccess'));
        return args.history.push('/profile');
      }
    });
  };
};

/**
 * @function getMembers
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getMembers = args => {
  return () => {
    return API.getMembers(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            members: res.results,
            prev_page: res.previous,
            next_page: res.next,
            loading: false,
          };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('groupMembers.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function getFollowers
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getFollowers = args => {
  return () => {
    return API.getFollowers(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            followers: res.results,
            prev_page: res.previous,
            next_page: res.next,
            loading: false,
          };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function getTeamFollowers
 * @author Hemant <hks@iamhks.com>
 *
 * @todo - describe function's signature
 */
export const getTeamFollowers = args => {
  return () => {
    return API.teamFollowers(args)
      .then(res => {
        if (Array.isArray(res.results)) {
            const followerIds = res.results.map(follower => follower.id);
              return {
                followerIds: followerIds,
                prev_page: res.previous,
                next_page: res.next,
                loading: false,
              };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

export const getTeamFollowersPage = args => {
  return () => {
    return API.teamFollowers(args)
    .then(res => {
      if (Array.isArray(res.results)) {
        return {
          followers: res.results,
          prev_page: res.previous,
          next_page: res.next,
          loading: false,
        };
      } else {
        res = Object.keys(res)
          .map(key => res[key])
          .join('\n');
        throw new Error(res);
      }
    })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function getTeamMembers
 * @author Hemant <hks@iamhks.com>
 *
 * @todo - describe function's signature
 */
// export const getTeamMembers = args => {
//   return () => {
//     return API.teamMembers(args)
//       .then(res => {
//         if (Array.isArray(res.members)) {
//           return {
//             followers: res.members,
//             loading: false,
//           };
//         } else {
//           res = Object.keys(res)
//             .map(key => res[key])
//             .join('\n');
//           throw new Error(res);
//         }
//       })
//       .catch(error => {
//         if (error.message.startsWith('Unexpected')) {
//           toast.warning(args.t('profile.errors.unexpected'));
//         } else {
//           toast.warning(error.message);
//         }
//         return { loading: false };
//       });
//   };
// };
export const getTeamMembers = args => {
  return async () => {
    try {
      const teamMembersResponse = await API.teamMembers(args); //uses the creators/${groupname}/members/ to get the group members for that group name
        // console.log(`data from the getTeamMembers API ${JSON.stringify(teamMembersResponse.members)}`); //get all the members of a group
      if (Array.isArray(teamMembersResponse.members)) {
        const memberInfoPromises = teamMembersResponse.members.map(member => API.teamMembersId(member.member));//extracts the array of all the members from the creatorsgroup instance and for each memeber in the array id get the full details about the member/creator using the Api creators/id/${memberId}

        const memberInfoResponses = await Promise.all(memberInfoPromises);//retuns or resolve just the array of details of each memeber that is gotten from the membersInfoResponse
        // console.log(`data from the getTeamMembers that is sent to the TeamMember page  ${JSON.stringify(memberInfoResponses)}`);

        const combinedData = teamMembersResponse.members.map((member, index) => ({
          ...member,
          additionalInfo: memberInfoResponses[index], // Add additional information here
        }));
        // console.log(`combined data ${JSON.stringify(combinedData)}`);
        // console.log(`memberInfo ${JSON.stringify(memberInfoResponses)}`);
        return {
          followers: memberInfoResponses,
          loading: false,
          teamMembersIdAndRole:combinedData
        };
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      if (error.message.startsWith('Unexpected')) {
        toast.warning(args.t('profile.errors.unexpected'));
      } else {
        toast.warning(error.message);
      }
      return { loading: false };
    }
  };
};

/**
 * @function getFollowing
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getFollowing = args => {
  return () => {
    return API.getFollowing(args)
      .then(res => {
        if (Array.isArray(res.results)) {
          return {
            following: res.results,
            prev_page: res.previous,
            next_page: res.next,
            loading: false,
          };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('profile.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function addComment
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const addComment = args => {
  return () => {
    return API.addProfileComment(args)
      .then(res => {
        if (res.username) {
          return { profile: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('comments.errors.unexpected'));
        } else {
          toast.warning(error.message);
        }
        return { loading: false };
      });
  };
};

/**
 * @function sendGroupInviteConfirmation
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const sendGroupInviteConfirmation = args => {
  return () => {
    return API.sendGroupInviteConfirmation(args.key).then(res => {
      if (res.detail !== 'ok') {
        throw new Error(res.detail);
      } else {
        toast.success(args.t('emailConfirm.toastSuccess'));
        setTimeout(() => {
          args.history.push('/');
        }, 4000);
      }
    });
  };
};

/**
 * @function getHelp
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getHelp = args => {
  return () => {
    return API.getHelp()
      .then(res => {
        if (res) {
          return { help: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('signup.errors.unexpected'));
          return {
            loading: false,
          };
        } else {
          toast.warning(args.t('signup.errors.unexpected'));
          return { loading: false };
        }
      });
  };
};

/**
 * @function getChallenge
 * @author Sucahkra Sharma <suchakra@unstructured.studio>
 *
 */
 export const getChallenge = args => {
  return () => {
    return API.getChallenge()
      .then(res => {
        if (res) {
          return { challenge: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('signup.errors.unexpected'));
          return {
            loading: false,
          };
        } else {
          toast.warning(args.t('signup.errors.unexpected'));
          return { loading: false };
        }
      });
  };
};

/**
 * @function getPrivacy
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getPrivacy = args => {
  return () => {
    return API.getPrivacy()
      .then(res => {
        if (res) {
          return { privacy: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('signup.errors.unexpected'));
          return {
            loading: false,
          };
        } else {
          toast.warning(args.t('signup.errors.unexpected'));
          return { loading: false };
        }
      });
  };
};

/**
 * @function getFaqs
 * @author Raymond Ndibe <ndiberaymond1@gmail.com>
 *
 * @todo - describe function's signature
 */
export const getFaqs = args => {
  return () => {
    return API.getFaqs()
      .then(res => {
        if (res) {
          return { faqs: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('signup.errors.unexpected'));
          return {
            loading: false,
          };
        } else {
          toast.warning(args.t('signup.errors.unexpected'));
          return { loading: false };
        }
      });
  };
};

/**
 * @function getAmbassadors
 * @author Srishti Sethi <srishti@unstructured.studio>
 *
 * @todo - describe function's signature
 */
 export const getAmbassadors = args => {
  return () => {
    return API.getAmbassadors(args)
      .then(res => {
        if (res) {
          return { ambassadors: res, loading: false };
        } else {
          res = Object.keys(res)
            .map(key => res[key])
            .join('\n');
          throw new Error(res);
        }
      })
      .catch(error => {
        if (error.message.startsWith('Unexpected')) {
          toast.warning(args.t('signup.errors.unexpected'));
          return {
            loading: false,
          };
        } else {
          console.log('sorry')
          toast.warning(args.t('signup.errors.unexpected'));
          return { loading: false };
        }
      });
  };
};
