<template>
  <section>
    <div class="card-edit-header">
      <span>{{ action.name }}</span>
           <span class="close material-icons close-popup-btn" @click.stop="close">close</span>
    </div>
    <div class="card-edit-main popup-layout-1">
      <input type="text" placeholder="Search members" />
      <ul>
        <h4>BOARD MEMBERS</h4>
        <li
          @click="toggleUserAsCardMember(user)"
          class="card-member-preview"
          v-for="user in CardMembers"
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
      CardMembers: null,
    };
  },
  async created() {
    try {
      await this.$store.dispatch({ type: "loadUsers" });
      this.cardToEdit = JSON.parse(JSON.stringify(this.card));
      this.filterCardMembers();
    } catch (err) {
      console.log("Error loading users:", err);
    }
  },
  watch: {
    card: {
      deep:true,
      handler() {
        console.log("Watcher on card");
        this.filterCardMembers();
      },
    },
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
      const isUserMemberIdx = this.cardToEdit.members.findIndex((member) => {
        return member.id === user._id;
      });
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
      console.log("users from filter after deep copy", users);
      if (this.card.members.length) {
        this.card.members.map((member) => {
          console.log("member", member);
          const filteredCardMembers = users.map((user) => {
            console.log("user", user);
            if (user._id === member.id) user.isCardMember = true;
            return user;
          });
          console.log("filteredUsersMembers", filteredCardMembers);
          this.CardMembers = filteredCardMembers;
        });
      } else {
        this.CardMembers = users;
      }
      console.log('', )
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
