<template>
<b-list-group flush class="sidenav_list pt-1">
      <b-list-group-item to="/RateBooking"><b-icon-book class="text-warning"/> Booking</b-list-group-item>
      <b-list-group-item to="/SavedDeals"><b-icon-save-fill class="text-success" /> Saved Deals</b-list-group-item>
      <b-list-group-item to="/DealBooking"><b-icon-check-circle class="text-info" /> Deal Booking</b-list-group-item>
      <b-list-group-item to="/BookedDeals"><b-icon-receipt class="text-primary" /> Booked Deals</b-list-group-item>
      <b-list-group-item to="/CloseDeal"><b-icon-door-closed class="text-danger" /> Close Deal</b-list-group-item>
      <b-list-group-item to="/DealHistory"><b-icon-clock-history class="text-black"/> History</b-list-group-item>
</b-list-group>
</template>

<script>
export default {
 
}
</script>

<style lang="scss">
      .sidenav_list{
            font-size: .875rem;
            .b-icon{margin-right: 0.5rem;}
            .list-group-item:not(.active){border: 0; }
            .router-link-exact-active {
                  background-color: #f6f9fc;
                  box-shadow: none; border: 0;
                  color: #344767;
                  }
      }
</style>