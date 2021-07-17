<template>
  <section>
    <div class="card-checklist-edit">
    <span>{{action.name}}</span>
    </div>
  </section>
</template>

<script>
export default {   
    props: {    
        action: {   
            type: Object,
            required: true
        },
        card: { 
            type: Object,
            required: true
        }
    } ,
    data()  {   
    return {
        cardToEdit: null
    }
    },
    created() {  
        this.cardToEdit = JSON.parse(JSON.stringify(this.card))
    },
    methods: {  
        updateTask() {  
            this.$emit('updateTask', this.card)
        }
    },

}   
</script>
