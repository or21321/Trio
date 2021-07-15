<template>
  <section>
    <div class="card-labels-edit">
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
        console.log('cardLabelsEdit creadted!');
        this.cardToEdit = JSON.parse(JSON.stringify(this.card))
        console.log('cardToEdit', this.cardToEdit);
    },
    methods: {  
        updateTask() {  
            this.$emit('updateTask', this.card)
        }
    },

}   
</script>
