<template>
  <div @click="toCardDetails" class="card-preview">
    <img
      class="img-preview"
      v-if="card.attachments.length"
      :src="card.attachments[0].url"
    />
    <div class="card-labels" v-if="cardLabels && !isLabelsTitlesShown">
      <span
        class="label-preview"
        v-for="label in cardLabels"
        :key="label.id"
        :style="{ backgroundColor: label.color }"
        @click.stop="toggleLabelTitle"
      >
      </span>
      <!-- <span v-else class="label" v-for="label in cardLabels" :key="label.id" :style="{backgroundColor:label.color}">{{label.title}}</span> -->
    </div>
    <div class="card-labels" v-else>
      <!-- <span class="label-preview" v-for="label in cardLabels" :key="label.id" :style="{backgroundColor:label.color}"></span> -->
      <span
        class="label-preview title-shown"
        v-for="label in cardLabels"
        :key="label.id"
        :style="{ backgroundColor: label.color }"
        @click.stop="toggleLabelTitle"
        >{{ label.title }}</span
      >
    </div>
    <span class="card-preview-title">{{ card.title }}</span>
    <div class="card-info">
      <div class="card-badges">
        <div v-if="card.comments.length" class="comment-badge">
          <span class="material-icons-outlined badge-icon">
            chat_bubble_outline
          </span>
          <span>{{ card.comments.length }}</span>
        </div>
      </div>
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
    isLabelsTitlesShown: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      cardLabels: [],
      // isLabelTitleShown: false,
    };
  },
  watch: {
    "card.labelIds": {
      immediate: true,
      handler() {
        console.log("watch from preview, handler on card", this.card);
        this.cardLabels = [];
        this.card.labelIds.forEach((labelId) => {
          const cardLabel = this.currBoard.labels.find((label) => {
            // console.log(label.id === labelId);
            // console.log('label.id', label.id);
            // console.log('labelId', labelId);
            return label.id === labelId;
          });
          if (cardLabel) return this.cardLabels.push(cardLabel);
          else console.log("cardLabel undefined", cardLabel);
        });
        console.log("cardLabels from preview", this.cardLabels);
      },
    },
    "card": { 
      immediate: true,
      handler() { 
        console.log('watcher on card from preview', this.card);
      }
    }
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
  },
  methods: {
    toCardDetails() {
      this.$router.push(
        `${this.$route.path}/g/${this.groupId}/c/${this.card.id}`
      );
    },
    filterCardLabels() {
      console.log("filterCardLabels", this.card.labelIds);
    },
    toggleLabelTitle() {
      // this.isLabelTitleShown = !this.isLabelTitleShown;
      console.log("toogleLabelTitle()", this.isLabelTitleShown);
      this.$emit("toggleLabelsTitles");
    },
  },
};
</script>
