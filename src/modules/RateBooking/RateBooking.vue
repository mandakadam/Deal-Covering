<template>
  <section>
    <b-card class="form-wrapper mb-3 border-radius-lg" body-class="pt-3 pb-0">
      <ValidationObserver ref="formObserver">
        <b-form autocomplete="off" @submit.prevent="$de_genBidRate">
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
                @click="(vm = {}), (countDown = 0)"
                >Clear Fields</b-button
              >
              <b-button size="sm" variant="success" @click="vm = {}"
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
            >
            </FormElementWithValidation>
          </div>
        </b-form>
      </ValidationObserver>
    </b-card>
    <b-card body-class="p-0" class="shadow border-radius-lg">
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
        <template #cell(actions)="row">
          <div class="text-nowrap">
            <b-button
              size="sm"
              class="btn-primary mr-1"
              @click="info(row.item, row.index, $event.target)"
            >
              Book Deal
            </b-button>
            <b-button
              size="sm"
              class="btn-primary-dark mr-1"
              @click="info(row.item, row.index, $event.target)"
            >
              Split
            </b-button>
            <!-- <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button> -->
          </div>
        </template>

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
                class="btn-primary mr-1"
                @click="showInfoModal(data.item, data.index, $event.target)"
              >
                Book Deal
              </b-button>
              <b-button
                size="sm"
                class="btn-primary-dark mr-1"
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
  </section>
</template>

<script>
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
        { key: "deal_id", label: "Rate Id", type: "text" },
        { key: "trade_date", label: "Trade Date" },
        { key: "curr_pair", label: "Curr Pair", type: "text" },
        {
          key: "buy_sell",
          label: "BuySell",
          type: "text",
          tdClass: (value, key, item) => {
            return value == "SELL" ? "text-danger" : "text-success";
          },
        },
        { key: "fc_amount", label: "FC Amount", tdClass: "text-right" },
        { key: "open_amount", label: "Open Amount", tdClass: "text-right" },
        { key: "tenor", label: "Tenor", type: "text" },
        { key: "maturity_date", label: "Period" },
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
    };
  },
  computed: {
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
    this.fetchDealData();
  },
  methods: {
    fetchDealData() {
      this.$credCAPI
        .collection("deal/read")
        .read()
        .then((response) => {
          if (response.hasOwnProperty("data")) {
            this.items = response.data;
          }
        });
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
  },
};

function getEl(vm) {
  return {
    MainEl: [
      {
        type: "radio",
        name: "type",
        label: "Interbank",
        rules: "",
        class: "align-self-center",
      },
      {
        type: "radio",
        name: "type",
        label: "Client",
        rules: "",
        class: "align-self-center",
      },

      {
        type: "text",
        name: "deal",
        label: "Enter Deal",
        rules: "",
        class: "span50",
      },
    ],
    DealEl: [
      {
        type: "select",
        name: "curr_pair",
        label: "Curr Pair",
        static: true,
        ds: [
          { code: "USD/INR", descr: "USD/INR" },
          { code: "EUR/INR", descr: "EUR/INR" },
        ],
        "ds-code": "code",
        "ds-name": "descr",
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
      },
      {
        type: "number",
        name: "fc_amount",
        label: "Amount",
        rules: "",
      },
      {
        type: "select",
        name: "tenor",
        label: "Tenor",
        static: true,
        ds: [{ code: "SPOT", descr: "SPOT" }],
        "ds-code": "code",
        "ds-name": "descr",
        description: `(${vm.$today()})`,
      },
      {
        type: "number",
        label: "Client Mrg",
        name: "client_mrg",
        rules: "",
      },
      {
        type: "number",
        name: "interbank_rate",
        label: "Interbank Rate",
        rules: "",
        handlers: {
          blur: [vm.onChange_interbank_rate],
        },
      },
      {
        type: "number",
        name: "bank_mrg",
        label: "Bank Mrg",
        rules: "",
      },
      {
        type: "number",
        name: "fwd_points",
        label: "Fwd Points",
        rules: "",
      },
      {
        type: "number",
        name: "client_rate",
        label: "Client Rate",
        rules: "",
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
