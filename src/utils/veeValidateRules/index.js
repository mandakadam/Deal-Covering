import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/en.json';

Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  });
});

extend("numeric_comma", {
  params: ["numeric_comma"],
  validate: (value) => {
   // var pattern = /\d{1,2}[,.]\d{1,2}/;
    var pattern = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/;
    if (pattern.test(value)) {
      return true;
    }
    return false;
  },
  message:
    "The {_field_} may only contain numeric characters"
});

/*import { required, confirmed, length, email, alpha_num, numeric, min, max, max_value } from "vee-validate/dist/rules";
import { extend, validate } from "vee-validate";

extend("required", {
  ...required
});

extend("email", {
  ...email,
  message: "This field must be a valid email"
});

extend("confirmed", {
  ...confirmed,
  message: "This field confirmation does not match"
});

extend("length", {
  ...length,
  message: "This field must have 2 options"
});

extend("alpha_num", {
  ...alpha_num,
  message: "No special character allowed"
});
extend("numeric", {
  ...numeric,
  message: "This field must be number"
});
extend("min", {
  ...min,
  params: ['min'],
  message: 'The {_field_} field must be {min} or more'
});
extend("max", {
  ...max,
  params: ['max'],
  message: 'The {_field_} field must be {max} or less'
});
extend("max_value", {
  ...max_value,
  params: ['max_value'],
  message: 'The {_field_} field must be {max_value} or less'
});
*/