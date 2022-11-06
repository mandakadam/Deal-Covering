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

          <div class="grid grid--6">
            <FormElementWithValidation
              v-for="(item, index) in el.DealEl"
              :key="`DealEl${index}`"
              :item="item"
              v-model="vm[item.name]"
              :dataset="ds[item.ds]"
              formControlSize="sm"
            >
            </FormElementWithValidation>
           <div class="item ml-auto text-right align-self-end">
              <b-button
                size="sm"
                variant="default"
                class="bg-light mr-3"
                @click="(vm = {}), (countDown = 0)"
                ><b-icon-arrow-clockwise /> Clear</b-button
              >
              <b-button size="sm" variant="success"><b-icon-filter /> Apply</b-button>
            </div>
          </div>
        </b-form>
      </ValidationObserver>
    </b-card>
    <div class="d-flex justify-content-between mb-3">
      <h5 class="text-light m-0">Deal Booking</h5>
      <b-button size="sm" variant="dark" class="mt-n1" :disabled="selectedItems.length < 1" @click="$refs['MergeDealModal'].showModal()"><b-icon-shuffle /> Merge Deals</b-button>
    </div>
    <b-card body-class="p-0" class="shadow border-radius-lg" v-if="Object.keys(ActiveCompany).length && items.length">
      <b-table
        :sticky-header="true"
        :no-border-collapse="true"
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
              <b-form-checkbox
                class="mr-2"
                @change="(e)=>onSelectItems(e, data.item)"
              >
              </b-form-checkbox>

              <b-button
                size="sm"
                class="btn-success bg-gradient-success mr-2"
                @click="onCreateDeal(data.item)"
              >
                Book Deal
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
    <no-data v-else-if="!items.length" title="No Deal Found" msg=""></no-data>

    <MergeDealModal ref="MergeDealModal" :dataSource="selectedItems[1]"/>
  </section>
</template>

<script>
import { mapState } from "vuex";
import MergeDealModal from "@/components/DealComponents/MergeDealModal.vue"

export default {
   components: {
    MergeDealModal
  },
  data() {
    return {
      vm: {},
      countDown: 0,
      selectedItems:[],
      stickyHeader: true,
      noCollapse: true,
      selectedDeal:{},
      items: [],
      fields: [
        {
          key: "actions",
          stickyColumn: true,
          isRowHeader: true,
          variant: "light",
        },
        { key: "trade_date", label: "Trade Date" },
        { key: "deal_id", label: "Rate Id" },
        { key: "curr_pair", label: "Curr Pair" },
        {
          key: "buy_sell",
          label: "BuySell",
          tdClass: (value, key, item) => {
            return value == "SELL" ? "text-danger" : "text-success";
          },
        },
        { key: "fc_amount", label: "FC Amount", tdClass: "text-right" },
        { key: "open_amount", label: "Open Amount", tdClass: "text-right" },
        { key: "tenor", label: "Tenor" },
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
    this.fetchAllDeals();
  },
  methods: {
    fetchAllDeals() {
      this.$credCAPI
        .collection("deal/read")
        .read()
        .then((response) => {
           this.items = response || [];
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
    onSelectItems(val, item, index){
      if(val == true){
          this.selectedItems.push(item);
      }
      else{
        this.selectedItems = this.selectedItems.filter(i => {
          return i.deal_id != item.deal_id
        })
      }
      
    },
    onCreateDeal(item){
      const vObj = {
        data:{
          ...item
        }
      }

      this.$credCAPI
       .collection("deal/create")
       .create({body: vObj})
        .then((response) => {
          this.$_successMessage(`Deal created successfully.`);
        });
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
    DealEl: [
      {
        type: "date",
        name: "booking_date",
        label: "Booking Date",
        rules: {},
        value: vm.$today()
      },
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
        type: "select",
        name: "rate_id",
        label: "Rate ID",
        static: true,
        ds: [{ code: "rate_id", descr: "rate_id" }],
        "ds-code": "code",
        "ds-name": "descr",
      },
      {
        type: "select",
        name: "deal_id",
        label: "Deal Id",
        static: true,
        ds: [{ code: "deal_id", descr: "deal_id" }],
        "ds-code": "code",
        "ds-name": "descr",
      },
    ],
  };
}
</script>
