<template>
    <b-navbar toggleable="lg" type="dark">
   <b-button variant="default" v-b-toggle.sidebar-1 class="p-0 text-white" v-if="!sidebarFlag">
      <b-icon-list />
   </b-button>
    <b-navbar-brand href="#/" class="ml-2 align-items-center d-flex">
      <img src="@/assets/img/Credence-Analytics-Logo.svg" height="28" class="mr-2"/>  
      <span ><b >Trader</b> View</span>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
     
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto align-items-center">
        <div class="custom_search mr-3"> 
        <v-select @input="$store.commit('onSetActiveCompany', ActiveCompany)" v-model="ActiveCompany" class="border-radius-lg" placeholder="Corporate Search" size="sm" theme="dark" :options="ActiveCompanyList" style="min-width:200px"></v-select>
        </div>
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <b-icon-person class="text-white" />
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>  
  
  </b-navbar>
</template>

<script>
export default {
  props:["sidebarFlag"],
  data(){
    return{
        ActiveCompany: null,
        ActiveCompanyList: [{code: "ASPT", label: 'Asian Paints [ASPT]',}, {code: "CT", label: 'Credence Team [CT]'}]
    }
  }
}
</script>

<style lang="scss" >
.custom_search{
.v-select{
  font-size: 12px; 
  input::placeholder,label.text-muted{color: #999 !important; font-weight: normal !important; font-size:11px; text-align: left !important;}
     .vs__dropdown-menu{font-size: 12px; margin: 0; padding: 0;}
                  .vs__dropdown-option{padding: 5px;}
                  
  .vs__dropdown-toggle{border-radius: 6px; border: 0; box-shadow: 0 0 10px rgba(0,0,0,0.2); }
            .vs__selected{font-size: 12px; }
            .vs__search, .vs__search:focus{font-size: 12px;} 
            .vs__actions{transform: scale(0.7); }
        }
      }
</style>