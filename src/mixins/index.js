export const Globalmixin = {
  data: () => ({
    ds: {}, // Data Set
    ds_prefetched: {}, // Data Set
    ignore_prc_con: "n", // Confirm Validation flag for crate and update requests
  }),
  watch: {

  },
  computed: {

  },
  methods: {
    showNotificationSpinner(msg) {
      const STYLE = "position: fixed; bottom: 0; right: 0; background: #1d1d77; padding: 10px; color: #fff; box-shadow: rgba(0, 0, 0, 0.78) -2px 1px 4px 0px; border-radius: 5px 0 0 0; font-weight: bold;";
      const tpl = document.getElementById('notificationWrap');
      if (!(tpl && tpl.length)) {
        const DIV = document.createElement('div');
        DIV.setAttribute('id', "notificationWrap");
        DIV.setAttribute("style", STYLE);
        DIV.innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp;&nbsp;&nbsp;' + msg;
        document.querySelector('body').appendChild(DIV);
      }
      else {
        this.closeNotificationSpinner();
        this.showNotificationSpinner(msg)
      }
    },
    closeNotificationSpinner() {
      const tpl = document.getElementById('notificationWrap');
      (tpl && tpl.parentNode) && tpl.parentNode.removeChild(tpl);
    },
    async $responseHandler(response, callback, _this, mainScreen) {

      if (response && response.status == "unsuccess") {
        await _this.$_showAlert("Alert", (response.msg || response.error));
        _this.ignore_prc_con = "n"
        this.$store.commit("OnCheckedItem", undefined);
        this.$store.commit("OnActionPerformed", true);
        return response
      }

      if (response && response.status == "confirm") {
        await _this.$_confirmMessage({
          msg: (response.msg || response.error),
          title: "Confirm"
        }).then(confirm => {
          if (confirm) {
            _this.ignore_prc_con = "y"
            callback.call(_this)
          }
          _this.ignore_prc_con = "n"
        })
        return response;
      }

      _this.ignore_prc_con = "n"

      await _this.$_showAlert("Success", response.msg || "Action Permformed Successfully");

      await setTimeout(function () {
        if (!mainScreen) _this.$router.go(-1);
      }, 1000);

      this.$store.commit("OnCheckedItem", undefined);
      this.$store.commit("OnActionPerformed", true);
      return response;
    },
    groupBy(xs, key) {
      return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    },
    $_getDatalist(list, datalist, staticFilters) {
      let vObj_static = {
        body: {
          //data:list.replace(/ /g,'')
          "filter": [
            {
              "field": "MODULE_NAME",
              "value": list,
              "asgn": "in",
              "type": "string"
            }
          ]
        },
      };
      if (!!staticFilters) {
        vObj_static.body.filter = [...vObj_static.body.filter, ...staticFilters];
      }
      const vObj_datalist = {
        body: {
          //data:list.replace(/ /g,'')
          "filter": datalist
        },
      };
      var that = this;

      const staticRead = that.$credCAPI
        .collection("registry/static/read")
        .read(vObj_static)
        .then((response) => {
          if (response && response.length) {
            return this.groupBy(response, 'MODULE_NAME')
          }
        })
        .catch(error => console.error(error));

      const datalistRead = that.$credCAPI
        .collection("registry/datalist/read")
        .read(vObj_datalist)
        .then((response) => {
          return response
        })
        .catch(error => console.error(error));

      return Promise.all([staticRead, datalistRead]);

    },
    $_successMessage(msg) {
      const h = this.$createElement;
      const messageVNode = h('div', { domProps: { innerHTML: msg } });

      this.$bvToast.toast([messageVNode], {
        title: "Success !!!",
        variant: 'success',
        solid: true,
        autoHideDelay: 3000,
      })
      this.$store.commit("loading", false);
    },
    $_errorMessage(msg) {
      const h = this.$createElement;
      const messageVNode = h('div', { domProps: { innerHTML: msg } });

      this.$bvToast.toast([messageVNode], {
        title: "Error !!!",
        variant: 'danger',
        solid: true,
        autoHideDelay: 3000,
      })
      this.$store.commit("loading", false);
    },
    $_confirmMessage({ action, size, msg, title }) {
      const h = this.$createElement;
      const messageVNode = h('div', { class: ['confirm-box'], domProps: { innerHTML: msg || `Please confirm that you want to ${action}` } });
      return this.$bvModal.msgBoxConfirm([messageVNode], {
        // title: title || 'Confirm',
        size: size || 'sm',
        buttonSize: 'sm',
        okVariant: 'primary',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      });
    },
    $_showAlert(title, msg) {
      const h = this.$createElement;
      const messageVNode = h('div', { class: ['confirm-box'], domProps: { innerHTML: msg || `<b>Something unexpected happened</b>` } });
      return this.$bvModal.msgBoxOk([messageVNode], {
        // title: title,
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'success',
        centered: true,
        noCloseOnBackdrop: true
      })
    },
    async $_setFilter(dsName, columnName, codeField, filterBasedOn, val) {
      if (this.ds_prefetched[dsName] == undefined) {
        let promise = new Promise((resolve, reject) => {
          setTimeout(() => resolve("done!"), 1000)
        });
        let result = await promise; // wait until the promise resolves (*)
      }
      const filtered = this.ds_prefetched[dsName].filter((item) => {
        return item[filterBasedOn] == val;
      });

      const check_filtered = filtered.filter((item) => {
        return item[codeField] == this.vm[columnName];
      });

      const finalVal = check_filtered.length ? check_filtered : filtered

      if (filtered.length) {
        this.$set(this.ds, dsName, filtered);
        this.$set(
          this.vm,
          columnName,
          // filtered[0] ? filtered[0][codeField].toString() : ""
          finalVal[0] ? finalVal[0][codeField].toString() : ""
        );
      }
    },
    $_getCheckedItems({ items, referenceKey }) {
      const _list = []
      items.forEach((element,) => {
        var _key = {}
        for (var i in element) {
          if (referenceKey.indexOf(i) >= 0) {
            _key[i] = element[i];
          }
        }
        _list.push(_key)
      });
      return _list
    },
    $_getFieldData(fields, localeName) {
      const _f = []
      fields.sort().forEach(element => {
        _f.push({
          key: element,
          label: localeName.hasOwnProperty(element) ? localeName[element] : element.replace("_", " "),
          sortable: true
        })
      });
      return _f
    },
    $_getColumnData(fields, localeName) {
      const _f = fields.map(item => {
        item.label = localeName[item.key],
          item.sortable = true
        return item
      });
      return _f
    },
    $_selectInput(e) {
      e.target.select()
    },
    $_handleAmountChange(e) {
      if (!!this.$currencySymbolToNumber(e.target.value))
        this.vm.AMOUNT = this.$convertCommaString(this.$currencySymbolToNumber(e.target.value));
      else
        e.target.value = this.vm.AMOUNT;
    },
    $_handleDecimalInput(e) {
      var charCode = e.which ? e.which : e.keyCode;
      if (
        charCode == 46 ||
        (charCode >= 60 && charCode <= 90) ||
        (charCode >= 97 && charCode <= 122)
      ) {
        e.preventDefault();
        return false;
      } else if (charCode < 48 || charCode > 57) {
        return true;
      }
    },
    cellValue(data) {
      if (!data || data.value == null || data.value == "") return "-";

      if (isNaN(data.value) || data.field.amountrounding == 0) {
        return data.value || "-";
      } else {
        let numFormat = "0,0";
        if (
          data.field.amountrounding &&
          (!data.field.rounding || data.field.rounding != "card")
        ) {
          numFormat += `.${"0".repeat(data.field.amountrounding)}`;
        }
        return (
          this.$options.filters.number(
            parseFloat(data.value).toString(),
            numFormat
          ) || "-"
        );
      }
    },
  }
};
