<template>
  <div id="app">
    <div class="min-height-300 bg-primary position-absolute w-100"></div>
    <aside class="sidebarFlag" :class="sidebarFlag ? 'active' : '' ">
      <b-sidebar id="sidebar-1" variant="dark" no-header shadow no-close-on-route-change v-model="sidebarFlag" sidebar-class="bg-white m-3 border-radius-xl">
         <template #default="{ hide }">
          <header class="b-sidebar-header px-3 py-2">
            <!-- <img src="@/assets/img/logo-ct-dark.png" height="30" /> -->
              <strong>
              {{Object.keys(ActiveCompany).length ? ActiveCompany.label : 'Overview'}}
              </strong>
            <button @click="hide" type="button" aria-label="Close" class="close text-dark"><b-icon-x /></button>
          </header>
             <SidebarComponent/>
              <div class="text-center mt-5 pt-5">
        <img src="@/assets/img/icon-documentation.svg" alt="" height="100"/>
       </div>
         </template>
     
      </b-sidebar>
    </aside>

    <section class="main-content position-relative">
       <HeaderComponent :sidebarFlag="sidebarFlag" />
      <div class="container-fluid">
       <router-view></router-view>
       
      </div>
    </section>

    
		<transition name="bounce" v-if="isLoading">
			<div class="loading">
				<!-- {{refCount}} -->
				<b-icon icon="three-dots" animation="cylon" font-scale="4"></b-icon>
			</div>
		</transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import HeaderComponent from './components/HeaderComponent.vue'
import SidebarComponent from './components/SidebarComponent.vue'

export default {
  name: 'App',
  components: {
    SidebarComponent,
    HeaderComponent
  },
 data(){
    return{
      sidebarFlag:true
    }
  },
  computed: {
		...mapState(["isLoading", "refCount", "validationErrors", "ActiveCompany"]),
	},
}
</script>

<style>
</style>
