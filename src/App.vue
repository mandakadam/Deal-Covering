<template>
  <div id="app">
    <div class="min-height-300 bg-primary position-absolute w-100"></div>
    <aside class="sidebarFlag" :class="sidebarFlag ? 'active' : '' ">
      <b-sidebar id="sidebar-1" variant="dark" title="Asian Paints [ASPT]" shadow no-close-on-route-change v-model="sidebarFlag" sidebar-class="bg-white m-3 border-radius-xl">
        <SidebarComponent/>
        <template>
       <div class="text-center mt-5">
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
  </div>
</template>

<script>
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
  }
}
</script>

<style>
</style>
