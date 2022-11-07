<template>
      <b-modal
        size="md"
        id="splitDealModal"
        title="Split Deal"
        @hide="hideModal"
        @ok="handleOk"
        centered
        no-fade
      >
        <h4 class="modal_subheading" :class="dataSource.buy_sell == 'BUY' ? 'text-success' : 'text-danger'">{{dataSource.buy_sell}} {{dataSource.curr_pair}}</h4>
        <div class="row form-wrapper">
          <div class="col-lg-6">
               <b-card body-class="p-2" class="border-radius-lg  bg-opacity-10 h-100 " :class="dataSource.buy_sell == 'BUY' ? 'text-bg-success' : 'text-bg-danger'" shadow>
              <table class="table b-table table-sm table-borderless mb-0">
                <tbody>
                  <tr>
                    <td width="40%"><span>Deal ID</span></td>
                    <td> {{ dataSource.deal_id || "-"}}</td>
                  </tr>
                  <tr>
                    <td>{{dataSource.curr_pair?.split('/')[0] || "-"}}</td>
                    <td> {{ dataSource.fc_amount|| 0 | convertCommaString  }}</td>
                  </tr>
                  <tr>
                    <td>{{dataSource.curr_pair?.split('/')[1] || "-"}}</td>
                    <td> {{ dataSource.fc2_amount || 0 | convertCommaString  }}</td>
                  </tr>
                  <tr>
                    <td>Client Rate</td>
                    <td> {{ dataSource.client_rate  || "-"}}</td>
                  </tr>
                  <tr>
                    <td>Period</td>
                    <td> {{ dataSource.maturity_date  || "-"}}</td>
                  </tr>                
                  <tr>
                    <td>Swap Point</td>
                    <td> {{ dataSource.fwd_points  || "-"}}</td>
                  </tr>                
                  </tbody>
              </table>
            </b-card>  
          </div>
          <div class="col-lg-6">
            <ValidationObserver ref="formObserver" v-slot="{ handleSubmit }">
        <b-form autocomplete="off" @submit.prevent="handleSubmit(handleSubmit)">

              <b-card body-class="p-2 py-1" class="border-radius-lg" :class="dataSource.buy_sell == 'BUY' ? 'border-success' : 'border-danger'" shadow>
              <table class="table b-table table-sm table-borderless mb-0">
                <tbody>
                  <tr>
                    <td style="vertical-align: bottom;" width="40%">Split into deals</td>
                    <td style="vertical-align: bottom;">
                    
                      <FormElementWithValidation
                        :item='{
                            type: "number",
                            name: "split",
                            label: "",
                            hideLabel:true,
                            rules: {required:true},
                             handlers: {
                            change: [addSplitDetails],
                            },
                          }'
                        v-model="split"
                        formControlSize="sm"
                        class="mb-0"
                      >
                      </FormElementWithValidation>
                    </td>
                  </tr>             
                  </tbody>
              </table>
            </b-card>  

            <div class="border-top text-center mt-3">
                <span class="badge badge-dark mt-n3" style="position: relative; top: -10px;">OR</span>
            </div>

          <b-card v-for="(item, index) in split_details" :key="index" body-class="p-2 pb-1" class="border-radius-lg mb-2"  :class="dataSource.buy_sell == 'BUY' ? 'border-success' : 'border-danger'" shadow>
              <table class="table b-table table-sm table-borderless custom_table mb-0">
                <tbody>
                 <tr>
                    <td style="vertical-align: bottom;" width="40%">{{dataSource.curr_pair?.split('/')[0] || "-"}}</td>
                    <td>
                      <FormElementWithValidation
                        :item='{
                            type: "number",
                            name: "fc_amount",
                            label: "Amount",
                            rules: {required:true},
                            hideLabel:true
                          }'
                        v-model="item.fc_amount"
                        formControlSize="sm"
                      >
                      </FormElementWithValidation>
                    </td>
                  </tr>
                  <tr>
                    <td style="vertical-align: bottom;" width="40%">{{dataSource.curr_pair?.split('/')[1] || "-"}}</td>
                    <td> 
                      <FormElementWithValidation
                        :item='{
                            type: "number",
                            name: "fc2_amount",
                            label: "Amount",
                            rules: {required:true},
                            hideLabel:true
                          }'
                        v-model="item.fc2_amount"
                        formControlSize="sm"
                      >
                      </FormElementWithValidation>
                    </td>
                  </tr>
                
                  </tbody>
              </table>
            </b-card> 
        </b-form>
            </ValidationObserver>
          </div>
        </div>
        
         <template #modal-footer="{ ok, cancel }">
          <b-button size="md" variant="danger" @click="cancel()" class=" border-radius-md">
            Cancel
          </b-button>
          <b-button size="md" variant="success" class="bg-gradient-primary border-radius-md" @click="ok()">
            Split Deal
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
            split_details: [{fc_amount: "", fc2_amount: ""}]
        }
    },
    methods:{
    showModal() {
      this.$bvModal.show("splitDealModal");
    },
    hideModal() {
      this.$bvModal.hide("splitDealModal");
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
        
        this.onCraeteDeal(this.dataSource)  // original create
        this.split_details.forEach(item => {
            this.onCraeteDeal(item)
        });
       
      },
      handleHide() {
      },
      addSplitDetails(){
        this.split_details = [];
        for(var i = 1; i <= (this.split <= 3 ? this.split : 1); i++){
                this.split_details.push({fc_amount: "", fc2_amount: ""})
        }
        },
        onCraeteDeal(item){
        let vObj = {
              data:{
                  ...this.dataSource,
                  ...item
              }
          }
        delete vObj.data.id;

        this.$credCAPI
        .collection("deal/create")
        .create({body: vObj})
            .then((response) => {
            this.$_successMessage(`Deal splits created`);
            this.hideModal();
            this.$store.commit("OnActionPerformed", true)
            });
        }
    },
    
}
</script>

<style>

</style>