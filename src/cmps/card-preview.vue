<template>
  <div @click="toCardDetails" class="card-preview">
     <p>Title: {{card.title}}</p> 
     <p>Id: {{card.id}}</p> 
  </div>
</template>

<script>
export default {
    props: {    
        card: { 
            type: Object,
            required: true
        }
    },
    methods: {
        toCardDetails() {
            console.log('toCardDetails(), card.id', this.card.id);
        }
    },
}
</script>
