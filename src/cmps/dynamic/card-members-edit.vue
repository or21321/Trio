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
          v-for="user in boardMembers"
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
       this.filterCardMembers();
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
    boardMembers(){
       console.log(this.$store.getters.currBoard.members);
       return this.$store.getters.currBoard.members
    }
  },
  methods: {
    toggleUserAsCardMember(user) {
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
      } else {
        this.cardToEdit.members.splice(isUserMemberIdx, 1);
          user.isCardMember = false;
        this.updateCard;
      }
      console.log("card to update", this.cardToEdit);
      this.updateCard(this.cardToEdit);
    },
   filterCardMembers(){
      this.boardMembers.map((user) =>{
         this.card.members.forEach(member => { 
            if(member._id === user._id){
               user.isCardMember = true
            }
         }) 
      })
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
