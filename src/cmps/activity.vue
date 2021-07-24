<template>
  <ul class="first-option activities">
    <li v-if="hasHeader" class="activity">
      <span class="material-icons-outlined icon">format_list_bulleted</span>
      <span class="option">Activity</span>
    </li>
    <li v-for="activity in activities" :key="activity.id" class="activity">
      <avatar
      class="avatar-activity"
        :size="32"
        :username="activity.byMember.fullname"
        :src="activity.byMember.imgUrl"
        backgroundColor="#DFE1E6"
        color="#172b4d"
      />
      <div class="info">
        <p class="option">
          <span class="activity-user">{{ activity.byMember.fullname }} </span>
          <span class="activity-txt">{{ activity.txt }}</span>
        </p>
        <span class="activity-time">{{
          activity.createdAt | moment("from", "now")
        }}</span>
      </div>
    </li>
  </ul>
</template>

<script>
import avatar from "vue-avatar";

export default {
  props: {
    activities: {
      type: Array,
      required: true,
    },
    hasHeader: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    avatar
  }
};
</script>