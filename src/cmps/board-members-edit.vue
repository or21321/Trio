<template>
  <section>
    <!-- <div class="card-members-edit"> -->
    <div class="card-edit-header">
      <span>Invite to Board</span>
      <span @click.stop="close" class="close-popup-btn">X</span>
    </div>
    <div class="card-edit-main popup-layout-1">
      <input type="text" v-model="filterName" placeholder="Search members" />
      <ul class="board-members-list">
        <!-- <h4>BOARD MEMBERS</h4> -->
        <li
          @click="toggleUserAsBoardMember(user)"
          class="card-member-preview"
          v-for="user in membersToDisplay"
          :key="user._id"
        >
          <div class="member-name">
            <avatar :size="28" :username="user.fullname" :src="user.imgUrl"
             color="#172b4d"
              backgroundColor="#dfe1e6" />
            <span>{{ user.fullname }} ({{ user.username }})</span>
          </div>
          <span
            v-if="user.isBoardMember"
            class="material-icons-outlined check-member-icon"
            >check</span
          >
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import avatar from "vue-avatar";

export default {
  components: {
    avatar,
  },
  props: {
    users: {
      type: Array,
      required: true,
    },
    members: {
      type: Array,
      required: true,
    },
    // createdBy: {
    //   type: Object,
    //   required: true,
    // },
  },
  data() {
    return {
      membersToEdit: null,
      filteredBoardMembers: null,
      filterName:''
    };
  },
  async created() {
    try {
      await this.$store.dispatch({ type: "loadUsers" });
      this.membersToEdit = JSON.parse(JSON.stringify(this.members));
      this.filterBoardMembers();
    } catch (err) {
      console.log("Error loading users:", err);
    }
  },
  watch: {
    members: {
      // immediate: true,
      handler() {
        console.log("Watcher on members");
        this.filterBoardMembers();
      },
    },
  },
  computed: {
    allUsers() {
      return this.$store.getters.users;
    },
     membersToDisplay(){
       const members = this.filteredBoardMembers
       if(!this.filterName) return members
       let rgx = new RegExp(this.filterName ,'i')
      return members.filter(member => rgx.test(member.username) || rgx.test(member.fullname))
    }
  },
  methods: {
    toggleUserAsBoardMember(user) {
      const isUserMemberIdx = this.membersToEdit.findIndex(member => member._id === user._id)
      if (isUserMemberIdx === -1) {
        const miniUser = {
          username: user.username,
          fullname: user.fullname,
          _id: user._id,
          imgUrl: user.imgUrl,
        };
        this.membersToEdit.push(miniUser);
      } else {
        // console.log("Remove");
        this.membersToEdit.splice(isUserMemberIdx, 1);
      }
      // console.log("members to update", this.membersToEdit);
      this.updateMembers();
    },

    filterBoardMembers() {
      const users = JSON.parse(JSON.stringify(this.users));
      users.forEach(user => user.isBoardMember = false)
      //we can use lodash here to create a mapped object with key of id
      this.members.forEach(member => {

        const foundMember = users.find(user => user._id === member._id)
        if(foundMember) foundMember.isBoardMember = true
      })
        this.filteredBoardMembers = users;
    },
    updateMembers() {
      console.log("update", this.membersToEdit);
      this.$emit("updateMembers", this.membersToEdit);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>