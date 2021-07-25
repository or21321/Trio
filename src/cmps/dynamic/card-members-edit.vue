<template>
  <section>
    <div class="card-edit-header">
      <span>{{ action.name }}</span>
           <span class="close material-icons close-popup-btn" @click.stop="close">close</span>
    </div>
    <div class="card-edit-main popup-layout-1">
      <input type="text" v-model="filterName" placeholder="Search members" />
      <ul>
        <h4>BOARD MEMBERS</h4>
        <li
          @click="toggleUserAsCardMember(user)"
          class="card-member-preview"
          v-for="user in membersToDisplay"
          :key="user._id"
        >
          <div class="member-name">
            <avatar :size="32" :username="user.fullname" :src="user.imgUrl"
              color="#172b4d"
              backgroundColor="#dfe1e6"
               />
            <span>{{ user.fullname }} ({{ user.username }})</span>
          </div>
          <span
            v-if="user.isCardMember"
            class="material-icons-outlined check-member-icon"
            >check</span
          >
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { eventBus } from "@/services/event-bus-service";
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
      filterName:''
    };
  },
  async created() {
    try {
       await this.$store.dispatch({ type: "loadUsers" });
      this.cardToEdit = JSON.parse(JSON.stringify(this.card));
    } catch (err) {
      console.log("Error loading users:", err);
    }
  },
  watch: {
    card: {
      deep:true,
      handler() {
        console.log("Watcher on card");
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
    boardMembers(){
       return this.$store.getters.currBoard.members
    },
    membersToDisplay(){
       const members = this.boardMembers
       members.map((user) =>{user.isCardMember = false})
       members.map((user) =>{
         this.card.members.forEach(member => {
            if(member._id === user._id) user.isCardMember = true
         }) 
      })
       if(!this.filterName) return members
       let rgx = new RegExp(this.filterName ,'i')
      return members.filter(member => rgx.test(member.username) || rgx.test(member.fullname))
    }
  },
  methods: {
    toggleUserAsCardMember(user) {
      var activityTxt = ''
      var loggedinUser = this.$store.getters.loggedinUser
      const isUserMemberIdx = this.cardToEdit.members.findIndex((member) => {
        return member._id === user._id;
      });
      if (isUserMemberIdx === -1) {
        const miniUser = {
          username: user.username,
          fullname: user.fullname,
          _id: user._id,
          imgUrl: user.imgUrl,
        };
        this.cardToEdit.members.push(miniUser);
        user.isCardMember = true;
        if (user._id === loggedinUser._id) { activityTxt = `joined ${this.card.title}` }
        else { activityTxt = `added ${miniUser.fullname} to ${this.card.title}` }
      } else {
        if (user._id === loggedinUser._id) { activityTxt = `left ${this.card.title}` }
        else { activityTxt = `removed ${this.cardToEdit.members[isUserMemberIdx].fullname} from ${this.card.title}` }
        this.cardToEdit.members.splice(isUserMemberIdx, 1);
        user.isCardMember = false;
      }
      const activity = { 
        txt: activityTxt,
        card: { id: this.cardToEdit.id, title: this.cardToEdit.title } 
      }
      console.log("card to update", this.cardToEdit);
      this.updateCard(this.cardToEdit);
      eventBus.$emit("addActivity", activity);
    },
    updateCard() {
      console.log("update", this.cardToEdit);
      this.$emit("updateCard", this.cardToEdit,true);
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
