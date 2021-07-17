<template>
  <section>
    <!-- <div class="card-members-edit"> -->
    <div class="card-edit-header">
      <span>{{ action.name }}</span>
      <span @click.stop="close" class="close-popup-btn">X</span>
    </div>
    <div class="card-edit-main popup-layout-1">
      <input type="text" placeholder="Search members" />
      <ul>
        <h4>BOARD MEMBERS</h4>
        <li
          @click="toggleUserAsCardMember(user)"
          class="card-member-preview"
          v-for="user in filteredCardMembers"
          :key="user._id"
        >
          <div class="member-name">
            <avatar :size="32" :username="user.fullname" :src="user.imgUrl" />
            <span>{{ user.fullname }} ({{ user.username }})</span>
          </div>
          <span
            v-if="user.isCardMember"
            class="material-icons-outlined check-member-icon"
            >check</span
          >
          <!-- <span v-if="user.isCardMember === true" class="check-member-icon"
            >check</span
          > -->
        </li>
      </ul>
    </div>
    <!-- <div class="card-members"> -->
    <!-- </div> -->
    <!-- <div class="edit-content-holder"> -->
    <!-- </div> -->
    <!-- </div> -->
  </section>
</template>

<script>
import avatar from "vue-avatar";

export default {
  components: {
    avatar,
  },
  props: {
    action: {
      type: Object,
      required: true,
    },
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cardToEdit: null,
      filteredCardMembers: null,
    };
  },
  created() {
    this.$store.dispatch({ type: "loadUsers" });
    this.cardToEdit = JSON.parse(JSON.stringify(this.card));
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
    cardMembers() {
      return this.card.members;
    },
  },
  methods: {
    toggleUserAsCardMember(user) {
      console.log("toggleUserAsCardMember()", user);
      const isUserMemberIdx = this.cardToEdit.members.findIndex((member) => {
        return member.id === user._id;
      });
      console.log("isUserMemberIdx", isUserMemberIdx);
      if (isUserMemberIdx === -1) {
        console.log("Add");
        const miniUser = {
          username: user.username,
          fullname: user.fullname,
          id: user._id,
          imgUrl: user.imgUrl,
        };
        this.cardToEdit.members.push(miniUser);
      } else {
        console.log("Remove");
        this.cardToEdit.members.splice(isUserMemberIdx, 1);
        this.updateCard;
      }
      console.log("card to update", this.cardToEdit);
      this.updateCard(this.cardToEdit);
    },
    filterCardMembers() {
      console.log("card members from filter", this.card.members);
      const users = JSON.parse(JSON.stringify(this.users));
      users.map((user) => (user.isCardMember = false));
      if (this.card.members.length) {
        this.card.members.map((member) => {
          const filteredCardMembers = users.map((user) => {
            if (user._id === member.id) user.isCardMember = true;
            return user;
          });
          console.log("filteredUsersMembers", filteredCardMembers);
          this.filteredCardMembers = filteredCardMembers;
        });
      } else {
        console.log("else");
        this.filteredCardMembers = users;
      }
    },
    updateCard() {
      console.log("update", this.cardToEdit);
      this.$emit("updateCard", this.cardToEdit);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
