import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const toNumber = (val) => {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}
const isUndef = (v) => v === undefined || v === null;

export default new Vuex.Store({
  state: {
    refCount: 0,
    isLoading: false,
    isActionPerformed: false,
    validationErrors: [],
    checkedItemList: [],
    selectedFilters: [],
    parameters: {}
  },
  mutations: {
    loading(state, isLoading) {
      if (isLoading) {
        state.refCount++;
        state.isLoading = true;
      } else if (state.refCount > 0) {
        state.refCount--;
        state.isLoading = (state.refCount > 0);
      }
    },
    OnActionPerformed(state, isActionPerformed) {
      if (isActionPerformed) {
        state.isActionPerformed = true;
        //  state.checkedItemList = []
      }
      else {
        state.isActionPerformed = false;
      }
    },
    OnValidationErrors(state, val) {
      if (val) {
        state.validationErrors = val;
      }
      else {
        state.validationErrors = [];
      }
    },
    OnSelectedFilters(state, val) {
      if (val) {
        state.selectedFilters = val;
      }
      else {
        state.selectedFilters = [];
      }

    },
    OnCheckedItem(state, val) {
      if (val) {
        state.checkedItemList = val;
      }
      else {
        state.checkedItemList = [];
        state.checkedItemList.length = 0;
      }
    }
  },
  actions: {
    getParameters({ state }, config) {
      const Parameters = Object.entries({
        "FUNDREGISTRY.AMOUNTROUND": "amountround",
      });
      const parameters = Parameters.map(parameter => parameter[0]);
      const BODY = {
        body: {
          "filter": [{ "field": "paramname", "value": parameters, "asgn": "in" }]
        },
      }

      Vue.$credCAPI
        .collection("registry/parameter/read")
        .read(BODY)
        .then((result) => {
          if (result.message !== undefined || result.status === "unsuccess")
            return;
          Parameters.map(parameter => {
            let params = result[parameter[0]];
            if (isUndef(params)) return;
            if (params.PARAMVALUE.toLowerCase() === "true") {
              state.parameters[parameter[1]] = true;
            }
            if (params.PARAMVALUE.toLowerCase() === "false") {
              state.parameters[parameter[1]] = false;
            }
            state.parameters[parameter[1]] = toNumber(params.PARAMVALUE);

            config = Object.assign(config, {}, state.parameters);
            return config;
          });
        })
    }
  },
})