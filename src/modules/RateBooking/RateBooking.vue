<template>
    <b-card body-class="p-0"  class="shadow">
    <b-table
      :sticky-header="stickyHeader"
      :no-border-collapse="noCollapse"
      responsive
      size="sm"
      table-variant="light"
      :items="items"
      :fields="[
						'actions', ...fields,
        ]"
      class="mb-0 custom_table"
    >
   <template #cell(actions)="row">
    <div class="text-nowrap">
        <b-button size="sm" class="btn-primary mr-1" @click="info(row.item, row.index, $event.target)" >
          Book Deal
        </b-button>
        <b-button size="sm" class="btn-primary-dark mr-1" @click="info(row.item, row.index, $event.target)" >
          Split 
        </b-button>
        <!-- <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button> -->
    </div>
    </template>

    <template v-for="(field) in fields" v-slot:[`cell(${field.key})`]="data">
      <slot v-if="field.key != 'actions'" :name="field.key" :data="data.item">{{ cellValue(data) }}</slot>
      <slot v-else :name="field.key" :data="data.item">
          <b-span class="text-nowrap">
          <b-button size="sm" class="btn-primary mr-1" @click="info(data.item, data.index, $event.target)" >
            Book Deal
          </b-button>
          <b-button size="sm" class="btn-primary-dark mr-1" @click="info(data.item, data.index, $event.target)" >
            Split 
          </b-button>
          </b-span>
      </slot>
    </template>

    <template #row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
          </ul>
        </b-card>
      </template>


       
      <!-- We are using utility class `text-nowrap` to help illustrate horizontal scrolling -->
      
    </b-table>
    
      <!-- Info modal -->
      <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
        <pre>{{ infoModal.content }}</pre>
      </b-modal>
    </b-card>
</template>

<script>
  export default {
    data() {
      return {
        stickyHeader: true,
        noCollapse: true,
        items: [],
        fields: [
          { key: 'actions', stickyColumn: true, isRowHeader: true, variant: 'light' },
          { key: "deal_id", label: "Rate Id", type: "text", },
          { key: "trade_date", label: "Trade Date",},
          { key: "curr_pair", label: "Curr Pair", type: "text" },
          { key: "buy_sell", label: "BuySell", type: "text",},
          { key: "fc_amount", label: "FC Amount", tdClass:"text-right" },
          { key: "open_amount", label: "Open Amount", tdClass:"text-right" },
          { key: "tenor", label: "Tenor", type: "text" },
          { key: "maturity_date", label: "Period", },
          { key: "interbank_rate", label: "Interbank Rate", tdClass:"text-right" },
          { key: "client_mrg", label: "Client Mrg", tdClass:"text-right" },
          { key: "bank_mrg", label: "Bank Mrg", tdClass:"text-right" },
          { key: "fwd_points", label: "Fwd Points", tdClass:"text-right" },
          { key: "client_rate", label: "Client Rate", tdClass:"text-right" },
          { key: "fc2_amount", label: "Eqvt Amount", tdClass:"text-right" },
        ],
         infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        }
      }
    },
    created(){
      this.fetchDealData()
    },
    methods:{
      fetchDealData(){
      this.$credCAPI.collection("deal/read").read().then((response)=>{
        if (response.hasOwnProperty("data")) {
          this.items =  response.data
        }
      })
    },
    info(item, index, button) {
        this.infoModal.title = `Row index: ${index}`
        this.infoModal.content = JSON.stringify(item, null, 2)
        this.$root.$emit('bv::show::modal', this.infoModal.id, button)
      },
      resetInfoModal() {
        this.infoModal.title = ''
        this.infoModal.content = ''
      },
   
    cellValue(data){
			if(!data || data.value == null || data.value == "") return "-"

			      if(isNaN(data.value)){
                return data.value || "-";
            }
            else{
                let numFormat = "0,0";
                if(data.field.amountrounding && (!data.field.rounding || data.field.rounding != 'card')){
                    numFormat += `.${"0".repeat(data.field.amountrounding)}`
                }
                return this.$options.filters.number(parseFloat(data.value).toString(),numFormat) || "-";
            }
		} 
    },
  }
</script>