<template>
  <section>
    BookedDeals
    <div>
         <hot-table v-if="DealData.length" :data="DealData" :settings="hotSettings" ></hot-table>

      {{DealData}}
    </div>
  </section>
</template>

<script>
import { HotTable } from '@handsontable/vue';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

registerAllModules();

export default {
  components: {
      HotTable
  },
  data(){
    return {
      DealData:[],
      hotSettings:{
        height: 450,
        fixedColumnsLeft: 2,
        dropdownMenu: false,
        columnSorting: {
        column: 2,
        sortOrder: 'asc',
        sortEmptyCells: true
      },
        hiddenColumns: {
          indicators: true,
        },
        contextMenu: false,
        multiColumnSorting: true,
        filters: true,
        rowHeaders: false,
        colHeaders: true,
        columns: [
           {
            data: "", title: " ", 
            type: "checkbox",
            className: "text-center",
            renderer: 'checkbox'

          },
          { data: "deal_id", title: "Rate Id", type: "text" },
          { data: "trade_date", title: "Trade Date", type: "date", dateFormat: this.$config.globalDateFormatLong  },
          { data: "curr_pair", title: "Curr Pair", type: "text" },
          { data: "buy_sell", title: "BuySell", type: "text",},
          { data: "fc_amount", title: "FC Amount", type: "numeric" },
          { data: "open_amount", title: "Open Amount", type: "numeric" },
          { data: "tenor", title: "Tenor", type: "text" },
          { data: "maturity_date", title: "Period", type: "date", dateFormat: this.$config.globalDateFormatLong  },
          { data: "interbank_rate", title: "Interbank Rate", type: "numeric" },
          { data: "client_mrg", title: "Client Mrg", type:"numeric" },
          { data: "bank_mrg", title: "Bank Mrg", type:"numeric" },
          { data: "fwd_points", title: "Fwd Points", type:"numeric" },
          { data: "client_rate", title: "Client Rate", type:"numeric" },
          { data: "fc2_amount", title: "Eqvt Amount", type:"numeric" },
          
        ],
      licenseKey: 'non-commercial-and-evaluation'
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
          this.DealData =  response.data
        }
      })
    }
  }
}
</script>

<style>

</style>