<template>
    <b-card class="shadow m-3 text-center">
       <img src="@/assets/img/animate_css-i.svg" alt="No Data Found" height="200" />
       <div>
       <slot name="msg">

       </slot>
       </div>
    </b-card>
</template>
<script>
export default {
    props:['msg'],
    data:()=>({

    })
}
</script>