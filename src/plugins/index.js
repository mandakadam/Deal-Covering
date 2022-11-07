
/* GLOBALMIXIN */
import { Globalmixin } from "@/mixins"


/* DATEPICKER */
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

/* FORM */
import { ValidationObserver } from "vee-validate";
import { ValidationProvider } from "vee-validate";
import "@/utils/veeValidateRules";
import FormElementWithValidation from "@/components/FormElementWithValidation";

/*V-SELECT */
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";

/* DATE */
const dayjs = require('dayjs');
const Big = require('big.js');
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

/* DIRECTIVES */
import directives from "@/directives";

/* DIRECTIVES */
import Vue2Filters from "vue2-filters";
import filters from "@/filters";


/* Table*/
import noData from "@/components/NoData";


/* --------------------------- Finish Importing ------------------------------ */

const components = {
  DatePicker,
  ValidationObserver,
  ValidationProvider,
  FormElementWithValidation,
  vSelect,
  noData,
}

const globalDateFormatShort = window.config.globalDateFormatShort.toUpperCase()
const globalDateFormatLong = window.config.globalDateFormatLong.toUpperCase()
const globalTimeFormat = window.config.globalTimeFormat
const _toString = Object.prototype.toString;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const rFunc = {
  isRefrence(obj) {
    return obj !== null && typeof obj === 'object'
  },
  isPlainArray(arr) {
    return _toString.call(arr) === '[object Array]'
  },
  isPlainObject(obj) {
    return _toString.call(obj) === '[object Object]'
  },
  isTrue(v) {
    return v === true
  },
  isFalse(v) {
    return v === false
  },
  isUndef(val) {
    return val === undefined || val === null
  },
  isNumber(val) {
    var pattern = /^\d+$/;
    return pattern.test(val)
  },
  toNumber(val) {
    var n = parseFloat(val);
    return isNaN(n) ? val : n
  },
  stringToNumber(val) {
    var n = val.replace(/[^0-9\.]+/g, '');
    return Number(n)
  },
  convertStringToNumber(number) {
    var regExpr = /[^0-9.]/g;
    if (typeof number == "number") number = number.toString();
    if (typeof number == "string") number = number.replace(regExpr, "");
    return number ? Math.round(number * 100) / 100 : "";
  },
  convertExponentialtoNumber(number) {
    return Number(new Big(number).toString());
  },
  toFixed(val, decimal) {
    var n = val.toString().replace(/[^0-9\.]+/g, '');
    return Number(n).toFixed(decimal)
  },
  isFalsyValue(v) {
    return !!v === false
  },
  today() {
    return dayjs().format(globalDateFormatShort)
  },
  currentTime() {
    return dayjs().format(globalTimeFormat)
  },
  formatDate(date) {
    const d = dayjs(date, globalDateFormatShort).format(globalDateFormatShort)
    return d
  },
  globalDateFormatShort,
  globalDateFormatLong,
  globalTimeFormat
}


const Plugin = {
  install(Vue, store) {
    // GLOBAL MIXIN
    Vue.mixin(Globalmixin);
    Vue.use(Vue2Filters);

    /* COMPONENTS */
    Object.keys(components).forEach((key) => {
      Vue.component(key, components[key])
    });

    /* DIRECTIVE */
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    });

    /* UTILITY FUNCITONS */
    Object.keys(rFunc).forEach(key => {
      Vue.prototype[`$${key}`] = rFunc[key]
    })
    /* PROTOTYPE */
    Vue.prototype.$config = Vue['$config'] = window.config || {};
    Vue.prototype.$dayjs = Vue['$dayjs'] = dayjs;

    /* FILTERS */
    /*Object.keys(filters).forEach(key => {
      Vue.filter[key] = filters[key]
    })*/
    for(let name in filters) {
        Vue.filter(name, filters[name]);
    }   

  }
}

export default Plugin