<template>
    <div>
        <button @click="upUserValue(value)">Book Deal</button>
        <button>Split</button>
    </div>
</template>

 <script>
 export default {
     props: {
         method: { type: Function },
     },
     data: function() {
         return {
             hotInstance: null,
             row: null,
             col: null,
             value: 0
         }
     },
     methods: {
         upUserValue(character_id) {
           this.getData();
         }
     }
 }
 </script>