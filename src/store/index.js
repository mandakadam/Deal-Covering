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
    parameters: {},
    ActiveCompany: {}
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
    },
    onSetActiveCompany(state, val) {
      console.log(val)
      if (val) {
        state.ActiveCompany = val;
      }
      else {
        state.ActiveCompany = "";
      }
    },
  },
  actions: {
   
  },
})