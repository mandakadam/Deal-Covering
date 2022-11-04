<template>
  <div id="app">
    <div class="min-height-300 bg-primary position-absolute w-100"></div>
    <aside class="sidenav" :class="sidenav ? 'active' : '' ">
      <b-sidebar id="sidebar-1" variant="dark" title="Asian Paints [ASPT]" shadow no-close-on-route-change v-model="sidenav" sidebar-class="bg-white m-3 rounded">
        <SidebarComponent/>
      </b-sidebar>
    </aside>

    <section class="main-content position-relative">
       <HeaderComponent />
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
      sidenav:true
    }
  }
}
</script>

<style>
</style>
