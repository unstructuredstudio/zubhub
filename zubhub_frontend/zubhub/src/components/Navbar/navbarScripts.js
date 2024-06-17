import { SearchType } from '../../views/search_results/searchResultsScripts';

export const toggleDrawer = (e, sidenav_open) => {
  if (e && e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
    return {};
  } else {
    return { sidenav_open: !sidenav_open };
  }
};

export const toggleSearchBar = open_search_form => ({ open_search_form: !open_search_form });

export const isSearch = pathname => pathname === '/search';

export const handleSubmit = (e, props, query, search_type) => {
  e.preventDefault();
  if (query.length === 0) return;
  const queryParams = new URLSearchParams({
    type: search_type,
    q: query,
  });

  props.navigate(`/search?${queryParams}`);
};

export const onSearchOptionClick = (e, props, option, search_type) => {
  e.preventDefault();

  if (!option || !option.title) return;

  if (option.link) {
    props.navigate(option.link);
  } else {
    const queryParams = new URLSearchParams({
      type: search_type,
      q: option.title,
    });
    props.navigate(`/search?${queryParams}`);
  }
};

export const autoComplete = (props, query, search_type) => {
  if (!props.auth.token || query?.length === 0) {
    return { autocomplete: [] };
  } else if (search_type === SearchType.TAGS) {
    return props.autoCompleteTags({ query, token: props.auth.token }).then(completions => ({
      autocomplete: completions?.map(({ name }) => ({ title: name })),
    }));
  } else if (search_type === SearchType.PROJECTS) {
    return props.autoCompleteProjects({ query, token: props.auth.token }).then(completions => ({
      autocomplete: completions
        ?.filter(c => c.publish.type !== 1)
        .map(({ id, title, creator, images }) => ({
          title,
          shortInfo: creator.username,
          image: images.length > 0 ? images[0].image_url : null,
          link: `/projects/${id}`,
        })),
    }));
  } else if (search_type === SearchType.CREATORS) {
    return props.autoCompleteCreators({ query, token: props.auth.token }).then(completions => ({
      autocomplete: completions?.map(({ username, avatar }) => ({
        title: username,
        image: avatar,
        link: `/creators/${username}`,
      })),
    }));
  } else {
    return { autocomplete: [] };
  }
};
