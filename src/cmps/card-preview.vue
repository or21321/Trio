<template>
  <div @click="toCardDetails" class="card-preview">
    <div class="card-labels" v-if="card.cardLabels">{{cardLabels[0].color}}</div>
    <span class="card-preview-title">{{ card.title }}</span>
    <img
      class="img-preview"
      v-if="card.attachments.length"
      :src="card.attachments[0].url"
    />
    <div class="card-info">
      <div class="card-badges"></div>
      <ul class="card-members" v-if="card.members.length">
        <!-- Todo: click on avatar open remove-confirm-popup -->
        <avatar
          class="hover-background"
          v-for="member in card.members"
          :key="member.id"
          :username="member.fullname"
          :src="member.imgUrl"
          :size="28"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import avatar from "vue-avatar";

export default {
  components: {
    avatar,
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
    groupId: {
      type: String,
      required: true,
    },
  },
  data() {  
  return {
    cardLabels: []
  }
  },
watch: {
  'card.labelIds': {
    immediate: true,
    handler() { 
      console.log('watch handler on card', this.card);
    },
  }
},
  methods: {
    toCardDetails() {
      this.$router.push(
        `${this.$route.path}/g/${this.groupId}/c/${this.card.id}`
      );
    },
    filterCardLabels() {  
      console.log('filterCardLabels', this.card.labelIds);
      
    }
  },
};
</script>
