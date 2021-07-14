<template>
  <div class="card-preview">
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
    }
}
</script>
