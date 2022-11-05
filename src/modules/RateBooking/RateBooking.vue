<template>
  <section>
    <b-card class="form-wrapper mb-3 border-radius-lg" body-class="pt-3 pb-0">
      <ValidationObserver ref="formObserver" v-slot="{ handleSubmit }">
        <b-form autocomplete="off" @submit.prevent="handleSubmit(onRateCreate)">
          <input
            id="designatedtype"
            v-model="vm.designatedtype"
            type="hidden"
          />

          <div class="grid grid--9">
            <FormElementWithValidation
              v-for="(item, index) in el.MainEl"
              :key="`MainEl${index}`"
              :item="item"
              v-model="vm[item.name]"
              :dataset="ds[item.ds]"
              formControlSize="sm"
            >
            </FormElementWithValidation>

            <div class="item ml-auto text-right span30">
              <b-button
                v-if="countDown > 0"
                size="sm"
                variant="danger"
                disabled
                class="mr-3"
              >
                <span class="d-flex align-items-center">
                  <b-spinner class="mr-2" small></b-spinner>
                  {{ countDown }}
                </span>
              </b-button>
              <b-button
                size="sm"
                variant="default"
                class="bg-light mr-3"
                @click="(vm = {}), (countDown = 0),  $refs.formObserver.reset();"
                >Clear Fields</b-button
              >
              <b-button type="submit" size="sm" variant="success" class="btn-warning text-white bg-gradient-warning"
               >Book Rate</b-button
              >
            </div>
          </div>
          <div class="grid grid--9">
            <FormElementWithValidation
              v-for="(item, index) in el.DealEl"
              :key="`DealEl${index}`"
              :item="item"
              v-model="vm[item.name]"
              :dataset="ds[item.ds]"
              formControlSize="sm"
              @customEvent="item.customEvent ? item.customEvent.call() : null"
            >
            </FormElementWithValidation>
          </div>
        </b-form>
      </ValidationObserver>
    </b-card>
    <b-card body-class="p-0" class="shadow border-radius-lg" v-if="Object.keys(ActiveCompany).length && items.length">
      <b-table
        :sticky-header="stickyHeader"
        :no-border-collapse="noCollapse"
        responsive
        size="sm"
        table-variant="light"
        :items="items"
        :fields="fields"
        class="mb-0 border-radius-lg custom_table"
        style="min-height: 50vh"
      >
        <template v-for="field in fields" v-slot:[`cell(${field.key})`]="data">
          <slot
            v-if="field.key != 'actions'"
            :name="field.key"
            :data="data.item"
            >{{ cellValue(data) }}</slot
          >
          <slot v-else :name="field.key" :data="data.item">
            <b-navbar class="text-nowrap p-0">
              <b-button
                size="sm"
                class="btn-success bg-gradient-success mr-2"
                @click="onDealCreate(data.item)"
              >
                Book Deal
              </b-button>
              <b-button
                size="sm"
                class="btn-primary bg-gradient-primary mr-2"
                @click="showInfoModal(data.item, data.index, $event.target)"
              >
                Split
              </b-button>
            </b-navbar>
          </slot>
        </template>

        <template #row-details="row">
          <b-card>
            <ul>
              <li v-for="(value, key) in row.item" :key="key">
                {{ key }}: {{ value }}
              </li>
            </ul>
          </b-card>
        </template>

        <!-- We are using utility class `text-nowrap` to help illustrate horizontal scrolling -->
      </b-table>
      <!-- Info modal -->
      <b-modal
        :id="infoModal.id"
        :title="infoModal.title"
        ok-only
        @hide="resetInfoModal"
      >
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
    </b-card>


    <no-data v-else-if="!Object.keys(ActiveCompany).length" title="Select a company" msg="Select a company before making actions."></no-data>
    <no-data v-else-if="!items.length" title="No Rate Found" msg=""></no-data>
    
  </section>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      vm: {},
      countDown: 0,
      stickyHeader: true,
      noCollapse: true,
      items: [],
      fields: [
        {
          key: "actions",
          stickyColumn: true,
          isRowHeader: true,
          variant: "light",
        },
        { key: "trade_date", label: "Trade Date" },
        { key: "deal_id", label: "Rate Id"},
        { key: "curr_pair", label: "Curr Pair"},
        {
          key: "buy_sell",
          label: "BuySell",
          tdClass: (value, key, item) => {
            return value == "SELL" ? "text-danger" : "text-success";
          },
        },
        { key: "fc_amount", label: "FC Amount", tdClass: "text-right" },
        { key: "open_amount", label: "Open Amount", tdClass: "text-right" },
        { key: "tenor", label: "Tenor"},
        { key: "trade_date", label: "Trade Date" },
        {
          key: "interbank_rate",
          label: "Interbank Rate",
          tdClass: "text-right",
        },
        { key: "client_mrg", label: "Client Mrg", tdClass: "text-right" },
        { key: "bank_mrg", label: "Bank Mrg", tdClass: "text-right" },
        { key: "fwd_points", label: "Fwd Points", tdClass: "text-right" },
        { key: "client_rate", label: "Client Rate", tdClass: "text-right" },
        { key: "fc2_amount", label: "Eqvt Amount", tdClass: "text-right" },
      ],
      infoModal: {
        id: "info-modal",
        title: "",
        content: "",
      },
      currencyPair: [
          { "code": "USD/INR", "descr": "USD/INR"},
          { "code": "EUR/USD", "descr": "EUR/USD"},
          { "code": "USD/JPY", "descr": "USD/JPY"},
          { "code": "GBP/USD", "descr": "GBP/USD"},
          { "code": "AUD/USD", "descr": "AUD/USD"},
          { "code": "USD/CAD", "descr": "USD/CAD"},
          { "code": "USD/CNY", "descr": "USD/CNY"},
          { "code": "USD/CHF", "descr": "USD/CHF"},
          { "code": "USD/HKD", "descr": "USD/HKD"},
      ]
    };
  },
  computed: {
    ...mapState(["ActiveCompany"]),
    el() {
      return getEl(this);
    },
  },
  watch: {
    countDown(newVal) {
      if (newVal == 0) {
        this.$set(this.vm, "interbank_rate", "");
      }
    },
  },
  created() {
    this.fetchAllRates();
  },
  methods: {
    fetchAllRates() {
      this.$credCAPI
        .collection("rate/read")
        .read()
        .then((response) => {
           this.items = response || [];
        });
    },
    onRateCreate(){
      const vObj = this.createDataObj(this.vm);
      
      this.$credCAPI
        .collection("rate/create")
       .create({body: vObj})
        .then((response) => {
          this.fetchAllRates()
          this.vm.rate_id = response.rate_id || "2022103000001"
          this.vm = {}
          this.$refs.formObserver.reset()
          this.$_successMessage(`Rate booked successfully.`);
        });
    },
    onDealCreate(item){
      const vObj = {
        data:{
          "curr_pair": item.curr_pair || "",
          "buy_sell": item.buy_sell || "",
          "fc_amount": item.fc_amount || "",
          "tenor": item.tenor || "",
          "maturity_date": item.maturity_date || "",
          "interbank_rate": item.interbank_rate || "",
          "client_mrg": item.client_mrg || "",
          "bank_mrg": item.bank_mrg || "",
          "fwd_points": item.fwd_points || "",
          "client_rate": item.client_rate || "",
          "fc2_amount": item.fc2_amount || "",
        }
      }

      this.$credCAPI
       .collection("deal/create")
       .create({body: vObj})
        .then((response) => {
          this.$_successMessage(`Deal created successfully.`);
        });
    },
    createDataObj(vm) {
			return {
				data: {
            "type":  vm.type ||"",
					  "deal_id": vm.deal_id ||  "",
            "trade_date": this.$today() ||  "",
            "curr_pair": vm.curr_pair || "",
            "buy_sell": vm.buy_sell || "",
            "fc_amount": vm.fc_amount || "",
            "open_amount": vm.open_amount || "",
            "open_amount_per": vm.open_amount_per || "",
            "tenor": vm.tenor || "",
            "maturity_date": vm.maturity_date || "",
            "interbank_rate": vm.interbank_rate || "",
            "client_mrg": vm.client_mrg || "",
            "bank_mrg": vm.bank_mrg || "",
            "fwd_points": vm.fwd_points || "",
            "client_rate": vm.client_rate || "",
            "fc2_amount": vm.fc2_amount || ""
				}
			};
		},
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1;
          this.countDownTimer();
        }, 1000);
      }
    },
    onChange_interbank_rate() {
      this.countDown = 10;
      this.countDownTimer();
    },
    fetchRateData() {
      if(!(this.vm.curr_pair && this.vm.buy_sell && this.vm.tenor && this.vm.fc_amount)){
          this.$set(this.vm, "bank_mrg", "")
          this.$set(this.vm, "client_mrg", "")
          this.$set(this.vm, "client_rate", "")
          this.$set(this.vm, "fc2_amount", "")
          this.$set(this.vm, "fwd_points", "")
          this.$set(this.vm, "interbank_rate", "")
          this.$set(this.vm, "maturity_date", "")
      }
      else{
        const vObj = {
          body: {
            "curr_pair": this.vm.curr_pair || '',
            "buy_sell": this.vm.buy_sell || '',
            "fc_amount": this.vm.fc_amount || '',
            "tenor": this.vm.tenor || '',
            "rates": this.items
            }
        }
      this.$store.commit("loading", true);
      this.$credCAPI
        .collection("deal/rate/read")
        .read(vObj)
        .then((response) => {
           this.$set(this.vm, "bank_mrg", response.bank_mrg || "")
           this.$set(this.vm, "client_mrg", response.client_mrg || "")
           this.$set(this.vm, "client_rate", response.client_rate || "")
           this.$set(this.vm, "fc2_amount", response.fc2_amount || "")
           this.$set(this.vm, "fwd_points", response.fwd_points || "")
           this.$set(this.vm, "interbank_rate", response.interbank_rate || "")
           this.$set(this.vm, "maturity_date", response.maturity_date || "")
           this.$store.commit("loading", false);
        });
      }
    },
    showInfoModal(item, index, button) {
      this.infoModal.title = `Row index: ${index}`;
      this.infoModal.content = JSON.stringify(item, null, 2);
      this.$root.$emit("bv::show::modal", this.infoModal.id, button);
    },
    resetInfoModal() {
      this.infoModal.title = "";
      this.infoModal.content = "";
    },

    cellValue(data) {
      if (!data || data.value == null || data.value == "") return "-";

      if (isNaN(data.value)) {
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
    prepareeQuery(){
      if(!this.vm.deal_query){
        return
      }
      const str = this.vm.deal_query;
      const strSplit  = str.split(" ")
      const isCurrency = ["inr","usd"]

      var input = 'user1@gmail.com';
        var preferredPatterns = [
          ".*@gmail.com$",
          ".*@yahoo.com$",
          ".*@live.com$"
        ];
        let CurrencyPatternArr = []
        this.currencyPair.forEach(item=>{
          CurrencyPatternArr.push(item.code)
        })

        var BuySellPattern = new RegExp(["BUY","SELL"].join('|'));
        var TenorPattern = new RegExp(["SPOT"].join('|'));
        var CurrencyPattern = new RegExp(CurrencyPatternArr.join('|'));
        const numberCheck = function(num){ return (!isNaN(parseFloat(num)) && !isNaN(num - 0)) }

        strSplit.forEach((item, index)=>{
          const vStr = item.toString().toUpperCase()
          if(BuySellPattern.test(vStr)){
              this.$set(this.vm, 'buy_sell', vStr)
          }
          if(TenorPattern.test(vStr)){
              this.$set(this.vm, 'tenor', vStr)
          }
          if(CurrencyPattern.test(vStr)){
            this.$set(this.vm, 'curr_pair', vStr)
          }
          
          if(numberCheck(item)){
            this.$set(this.vm, 'fc_amount', vStr)
          }

          if(vStr.length == 1 && vStr == "M" && numberCheck(strSplit[index-1])){
              this.$set(this.vm, 'fc_amount', strSplit[index-1] * 10000000)
              
          }
        })


    }
  },
};

function getEl(vm) {
  return {
    MainEl: [
      {
        type: "radio",
        name: "type",
        label: "Interbank",
        rules: {},
        class: "align-self-center",
      },
      {
        type: "radio",
        name: "type",
        label: "Client",
        rules: {},
        class: "align-self-center",
      },

      {
        type: "text",
        name: "deal_query",
        label: "Enter Deal",
        rules: {},
        class: "span50",
        rules: {},
        handlers: {
          blur: [vm.prepareeQuery],
        },
      },
    ],
    DealEl: [
      {
        type: "select",
        name: "curr_pair",
        label: "Curr Pair",
        static: true,
        ds: vm.currencyPair,
        "ds-code": "code",
        "ds-name": "descr",
        customEvent: vm.fetchRateData,
      },
      {
        type: "select",
        name: "buy_sell",
        label: "BuySell",
        static: true,
        ds: [
          { code: "BUY", descr: "BUY" },
          { code: "SELL", descr: "SELL" },
        ],
        "ds-code": "code",
        "ds-name": "descr",
        customEvent:vm.fetchRateData,
      },
      {
        type: "number",
        name: "fc_amount",
        label: "Amount",
        rules: {},
        handlers: {
          blur: [vm.fetchRateData],
        },
      },
      {
        type: "select",
        name: "tenor",
        label: "Tenor",
        static: true,
        ds: [{ code: "SPOT", descr: "SPOT" }],
        "ds-code": "code",
        "ds-name": "descr",
        description: `${vm.vm.maturity_date || '-'}`,
        customEvent:vm.fetchRateData,
        
      },
      {
        type: "number",
        label: "Client Mrg",
        name: "client_mrg",
        rules: {},
      },
      {
        type: "number",
        name: "interbank_rate",
        label: "Interbank Rate",
        rules: {},
        handlers: {
          blur: [vm.onChange_interbank_rate],
        },
      },
      {
        type: "number",
        name: "bank_mrg",
        label: "Bank Mrg",
        rules: {},
      },
      {
        type: "number",
        name: "fwd_points",
        label: "Fwd Points",
        rules: {},
      },
      {
        type: "number",
        name: "client_rate",
        label: "Client Rate",
        rules: {},
        description: vm.vm.client_rate
          ? vm.$options.filters.convertCommaString(
              parseFloat(vm.vm.client_rate * 1000000),
              2
            )
          : "",
      },
    ],
  };
}
</script>
