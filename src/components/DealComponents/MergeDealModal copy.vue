<template>
      <b-modal
        size="md"
        id="MergeDealModal"
        title="Merge Deal"
        @hide="hideModal"
        @ok="handleOk"
        centered
        no-fade
      >
        <h4 class="modal_subheading" :class="dataSource.buy_sell == 'BUY' ? 'text-success' : 'text-danger'">{{dataSource.buy_sell}} {{dataSource.curr_pair}}</h4>
        <div class="row form-wrapper">
          <div class="col-lg-12">
               <b-card body-class="p-2" class="border-radius-lg  bg-opacity-10 h-100 " :class="dataSource.buy_sell == 'BUY' ? 'text-bg-success' : 'text-bg-danger'" shadow>
              <table class="table b-table table-sm table-borderless mb-0">
                <tbody>
                 
                  <tr>
                    <td>{{dataSource.curr_pair?.split('/')[0] || "-"}}</td>
                    <td> {{ dataSource.fc_amount|| 0 | convertCommaString  }}</td>
                  </tr>
                  <tr>
                    <td>{{dataSource.curr_pair?.split('/')[1] || "-"}}</td>
                    <td> {{ dataSource.fc2_amount || 0 | convertCommaString  }}</td>
                  </tr>
                  <tr>
                    <td>Forward</td>
                    <td> {{ $today()  || "-"}} - {{ $today()  || "-"}} </td>
                  </tr>
                  <tr>
                    <td>Clinet Rate</td>
                    <td> {{ dataSource.client_rate  || "-"}}</td>
                  </tr>                
                  <tr>
                    <td>Total Deals</td>
                    <td style="font-size:14px"> <b-badge>2</b-badge></td>
                  </tr>                
                  </tbody>
              </table>
            </b-card>  
          </div>
        
        </div>
        
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
            split: 1,
            split_details: [{fc_amt: "", fc2_amt: ""}]
        }
    },
    methods:{
    showModal() {
      this.$bvModal.show("MergeDealModal");
    },
    hideModal() {
      this.$bvModal.hide("MergeDealModal");
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
</script>

<style>

</style>