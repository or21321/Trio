<template>
  <div class="group-list">
      <card-preview v-for="card in group.tasks" :key="card.id" :card="card"></card-preview>
  </div>
</template>

<script>
import cardPreview from '@/cmps/card-preview'

export default {
    props: {
        group: {
            type: Object,
            require: true
        }
    },
    components: {   
        cardPreview
    },
}
</script>

