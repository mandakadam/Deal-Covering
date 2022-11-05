<template>
      <b-modal
        size="xl"
        id="mergeDealModal"
        title="Merge Deal"
        @hide="hideModal"
        @ok="handleOk"
        @shown="fetchData"
        centered
        no-fade
      >
      
      <div class="form-wrapper">
           <ValidationObserver ref="formObserver" v-slot="{ handleSubmit }">
              <b-form autocomplete="off" @submit.prevent="handleSubmit(handleSubmit)">
                <div class="grid grid--6">
                  <div class="item span100" style="font-size:12px">
                    Rate: 
                    <b-badge pill class="mr-2">2022103000001</b-badge>
                    <b-badge pill>2022103000004</b-badge>
                  </div>
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
      </div>

      <b-card body-class="p-0" class="shadow border-radius-lg" v-if="items.length">
        <b-table
          :sticky-header="true"
          :no-border-collapse="true"
          responsive
          scrollable
          size="sm"
          table-variant="light"
          head-variant="dark"
          :items="items"
          :fields="fields"
          class="mb-0 border-radius-lg custom_table"
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
                  class="btn-danger bg-gradient-danger mr-2"
                >
                  Remove
                </b-button>
                <b-button
                  size="sm"
                  class="btn-success bg-gradient-success mr-2"
                >
                  Add Swap
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
      
      </b-card>
        
         <template #modal-footer="{ ok, cancel }">
          <b-button size="md" variant="danger" @click="cancel()" class=" border-radius-md">
            Cancel
          </b-button>
          <b-button size="md" variant="success" class="bg-gradient-primary border-radius-md" @click="ok()">
            Merge
          </b-button>
        </template>
        
        <!-- <pre>{{ item }}</pre> -->
      </b-modal>
</template>

<script>
export default {
    props: ["dataSource"],
    data(){
        return{
           vm: {},
           currencyPair: this.$config.currencyPair,
           items: [{
      "curr_pair": "USD/INR",
      "buy_sell": "SELL",
      "fc_amount": "",
      "tenor": "SPOT",
      "maturity_date": "",
      "interbank_rate": "1",
      "client_mrg": "11",
      "bank_mrg": "1",
      "fwd_points": "",
      "client_rate": "1",
      "fc2_amount": "",
      "id": 4
    }],
            fields: [
              {
                key: "actions",
                stickyColumn: true,
                isRowHeader: true,
                variant: "light",
              },
              { key: "tenor", label: "Tenor"},
               { key: "rate_id", label: "Rate Id"},
                { key: "curr_pair", label: "Curr Pair"},
              { key: "open_amount", label: "Open Amount", tdClass: "text-right" },
              { key: "utilise_amount", label: "Utilise", tdClass: "text-right" },
              { key: "period", label: "Period" },
              {
                key: "interbank_rate",
                label: "Interbank Rate",
                tdClass: "text-right",
              },
              { key: "client_mrg", label: "Client Mrg", tdClass: "text-right" },
              { key: "bank_mrg", label: "Bank Mrg", tdClass: "text-right" },
              { key: "swap_points", label: "Swap Points", tdClass: "text-right" },
              { key: "client_rate", label: "Client Rate", tdClass: "text-right" },
            ],
        }
    },
     computed: {
      el() {
        return getEl(this);
      },
    },
    methods:{
      fetchData(){
      this.vm = {...this.dataSource}
      },
    showModal() {
      this.$bvModal.show("mergeDealModal");
    },
    hideModal() {
      this.$bvModal.hide("mergeDealModal");
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
     handleOk(bvModalEvent) {
        bvModalEvent.preventDefault()
        this.handleSubmit()
      },
      async handleSubmit() {
        const success = await this.$refs.formObserver.validate();
        if (!success) {
            return;
        }
       this.onCreateSplit()
      },
      handleHide() {
      },
      addSplitDetails(){
            this.split_details = [];
        for(var i = 1; i <= (this.split <= 3 ? this.split : 1); i++){
                this.split_details.push({fc_amt: "", fc2_amt: ""})
        }
        },
        onCreateSplit(){
            const vObj = {
            data:{
                "deal_id": this.dataSource.deal_id || "",
                "split": this.split || "",
                "split_details" : this.split_details || []
            }
        }

        this.$credCAPI
        .collection("deal/split/create")
        .create({body: vObj})
            .then((response) => {
            this.$_successMessage(`Deal Split process started.`);
            this.hideModal()
            });
        }
    },
    
}


function getEl(vm) {
  return {
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
        name: "fc2_amt",
        label: vm.dataSource.curr_pair?.split('/')[0],
        rules: {}
      },
      {
        type: "number",
        name: "fc2_amt",
        label: vm.dataSource.curr_pair?.split('/')[1],
        rules: {}
      },
      
      {
        type: "number",
        name: "interbank_rate",
        label: "Interbank Rate",
        rules: {},
        handlers: {
          blur: [vm.onChange_interbank_rate],
        },
        disabled:true
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
        disabled:true
      },
      {
        type: "select",
        name: "tenor",
        label: "Tenor",
        static: true,
        ds: [{ code: "SPOT", descr: "SPOT" },{ code: "FWD", descr: "FORWARD" }],
        "ds-code": "code",
        "ds-name": "descr",
        description: `${vm.vm.trade_date || ''}  ${vm.vm.maturity_date || ''}`,
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
        name: "bank_mrg",
        label: "Bank Mrg",
        rules: {},
      },
    ],
  };
}
</script>

<style>

</style>