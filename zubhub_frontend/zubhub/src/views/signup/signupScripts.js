import * as Yup from 'yup';
import countryMap from '../../assets/js/countryMap.json';
import intlTelInput from 'intl-tel-input';
import { calculateLabelWidth } from '../../assets/js/utils/scripts';


/**
* @constant vars
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe constant's function
*/
export const vars = {
  phone_field_touched: undefined,
  email_field_touched: undefined,
  iti: undefined,
  utils_scripts_url: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.min.js',
  preferred_countries: ['in', 'us']
};


/**
* @function handleMouseDownPassword
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleMouseDownPassword = e => {
  e.preventDefault();
};


/**
* @function getLocations
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const getLocations = props => {
  return props.getLocations({ t: props.t });
};


/**
* @function signup
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const signup = (e, props) => {
  e.preventDefault();
  props.setFieldTouched('username', true);
  props.setFieldTouched('email', true);
  props.setFieldTouched('phone', true);
  props.setFieldTouched('dateOfBirth', true);
  props.setFieldTouched('user_location', true);
  props.setFieldTouched('password1', true);
  props.setFieldTouched('password2', true);
  vars.phone_field_touched = true;
  vars.email_field_touched = true;


  props.validateForm().then(errors => {
    if (
      Object.keys(errors).length < 1 &&
      typeof props.values.user_location === "string" && 
      props.values.user_location.length > 0
    ) {

     props.signup({
        values: { ...props.values, subscribe: !props.values.subscribe, phone: vars.iti.getNumber()  },
        history: props.history,
      })
      .catch(error => {
        const messages = JSON.parse(error.message);
        if (typeof messages === 'object') {
          const server_errors = {};
          Object.keys(messages).forEach(key => {
            if (key === 'non_field_errors') {
              server_errors['non_field_errors'] = messages[key][0];
            } else if (key === 'location') {
              server_errors['user_location'] = messages[key][0];
            } else {
              server_errors[key] = messages[key][0];
            }
          });
          props.setStatus({ ...server_errors });
        } else {
          props.setStatus({
            non_field_errors: props.t('signup.errors.unexpected'),
          });
        }
      });
    }
  })
};


/**
* @function handleTooltipOpen
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleTooltipOpen = () => {
  return { tool_tip_open: true };
};


/**
* @function handleTooltipClose
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleTooltipClose = () => {
  return { tool_tip_open: false };
};


/**
* @function handleToggleSubscribeBox
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleToggleSubscribeBox = (e, props, state) => {
  let subscribe_box_checked = !state.subscribe_box_checked;
  props.setFieldValue('subscribe', subscribe_box_checked);
  return { subscribe_box_checked };
};



/**
* @function handleLocationChange
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const handleLocationChange = (e, props) => {
  if(vars.iti?.setCountry && e.target.value && 
    vars.iti.getSelectedCountryData().iso2 !== countryMap[e.target.value]){
    vars.iti.setCountry(countryMap[e.target.value])
  };
   props.handleChange(e);
};


/**
* @function setLocationWithTelCountry
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const setLocationWithTelCountry = (props) => {
  if(vars.iti?.getSelectedCountryData){
    let country_name;
    let keys = Object.keys(countryMap);
    for(let i=0; i < keys.length ; i++){
       if(countryMap[keys[i]] === vars.iti.getSelectedCountryData().iso2){
         country_name = keys[i];
         break;
       };
    };

    if(country_name &&
     props.values.user_location !== country_name){
      props.setFieldValue('user_location', country_name);
    };

  };

};


/**
* @function initIntlTelInput
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const initIntlTelInput = (props, refs) => {
  if (refs.phone_el.current?.firstChild) {
    vars.iti = intlTelInput(refs.phone_el.current.firstChild, {
      preferredCountries: vars.preferred_countries,
      utilsScript: vars.utils_scripts_url,
    });
    refs.phone_el.current.firstChild.addEventListener("countrychange", ()=>setLocationWithTelCountry(props));

    setTimeout(()=>setLocationWithTelCountry(props), 1000);
  }
};



/**
* @function setLabelWidthOfStaticFields
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe function's signature
*/
export const setLabelWidthOfStaticFields = (refs, document, props)=>{
   refs.date_of_birth_el.current.childNodes[1].childNodes[0].style.width = 
   `${calculateLabelWidth(props.t('signup.inputs.dateOfBirth.label'), document)}px`;
   refs.phone_el.current.childNodes[1].childNodes[0].style.width = 
   `${calculateLabelWidth(props.t('signup.inputs.phone.label'), document)}px`;
};



/**
* @object validationSchema
* @author Raymond Ndibe <ndiberaymond1@gmail.com>
* 
* @todo - describe object's function
*/
export const validationSchema = Yup.object().shape({
  username: Yup.string().required('required'),
  email: Yup.string()
    .email('invalid')
    .test('email_is_empty', 'phoneOrEmail', function (value) {
      return vars.email_field_touched && !value && !this.parent.phone
        ? false
        : true;
    }),
  phone: Yup.string()
    .test('phone_is_invalid', 'invalid', function () {
      return vars.iti.isValidNumber() || !vars.iti.getNumber() ? true : false;
    })
    .test('phone_is_empty', 'phoneOrEmail', function () {
      return vars.phone_field_touched && !vars.iti.getNumber() && !this.parent.email
        ? false
        : true;
    }),
  dateOfBirth: Yup.date().max(new Date(), 'max').required('required'),
  user_location: Yup.string().min(1, 'min').required('required'),
  password1: Yup.string().min(8, 'min').required('required'),
  password2: Yup.string()
    .oneOf([Yup.ref('password1'), null], 'noMatch')
    .required('required'),
  bio: Yup.string().max(255, 'tooLong'),
});

// /^[+][0-9]{9,15}$/g.test(value)
