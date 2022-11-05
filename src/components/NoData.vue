<template>
    <b-alert show="" variant="warning" class="shadow border-radius-lg d-flex align-items-center">
      <img src="@/assets/img/info.png" alt="" class="mr-3"/>
      <div>
        <h6 class="text-warning mb-1">{{title}}</h6>
          {{msg}}
      </div>
    </b-alert>
</template>
<script>
export default {
    props:['title', 'msg'],
    data:()=>({

    })
}
</script>