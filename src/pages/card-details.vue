<template>
  <section class="card-details" @click="closeCardDetails">
    <section class="card-container" @click.stop v-if="card">
      <header class="header">
        <span class="icon-title material-icons-outlined">title</span>
        <section class="titles">
          <input v-model="card.title" class="main-title" @change="saveCard" />
          <h4 class="sub-title">in list {{ groupName }}</h4>
        </section>
        <span class="close material-icons" @click="closeCardDetails">
          close
        </span>
      </header>
      <main class="main">
        <section class="members grid-details" v-if="card.members.length">
          <span></span>
          <h1 class="title-members">Members</h1>
          <div class="list-members">
            <avatar
              v-for="member in card.members"
              :key="member.id"
              :username="member.fullname"
              :src="member.imgUrl"
              :size="32"
            />
            <span class="item-add-btn" @click="setCurrAction(actions[0])">
              <span class="material-icons-outlined">add</span>
            </span>
          </div>
        </section>
        <section class="description grid-details">
          <span class="material-icons-outlined">subject</span>
          <h1 class="title-description">Description</h1>
          <contenteditable
            class="description-text"
            tag="div"
            :contenteditable="true"
            v-model="card.description"
            placeholder="Add a more detailed description..."
            :noNL="false"
            :noHTML="true"
            @input="saveCard"
          />
        </section>
        <section
          class="attachments grid-details"
          v-if="card.attachments.length"
        >
          <span class="attachments-icon material-icons-outlined"
            >attachments</span
          >
          <h1 class="title-attachments">Attachments</h1>
          <div class="imgs-container">
            <article
              class="img-container"
              v-for="(img, idx) in card.attachments"
              :key="idx"
            >
            <span class="material-icons-outlined delete-img"
            @click="deleteImg(img)">clear</span>
              <img :src="img.url"/>
              <p>{{ img.creatAt | moment("dddd, MMM Do YYYY") }}</p>
            </article>
          </div>
        </section>
        <section class="activity grid-details">
          <span class="material-icons-outlined">format_list_bulleted</span>
          <div class="header-activity">
            <h1 class="title-activity">Activity</h1>
            <button class="toggle-details-activity" @click="setShowComments">
              {{ titleActivityBtn }}
            </button>
          </div>
          <section class="main-activity">
            <div class="comment-line">
              <avatar
                class="avatar"
                :size="32"
                :username="getLoggedinUser.fullname"
                :src="getLoggedinUser.imgUrl"
              />

              <contenteditable
                class="comment-textarea"
                tag="form"
                :contenteditable="true"
                v-model="commentTxt"
                placeholder="Write a comment..."
                :noNL="false"
                :noHTML="true"
                @click="iscommentOpen = true"
                ref="comment"
              />

              <el-button
                class="send-comment"
                v-if="iscommentOpen"
                :disabled="!commentTxt"
                @click="addComment"
                type="primary"
                >Save</el-button
              >
            </div>
            <div
              class="comment-list"
              v-if="titleActivityBtn === 'Hide Details'"
            >
              <article
                class="comment-preview"
                v-for="comment in card.comments"
                :key="comment.id"
              >
                <avatar
                  class="avatar"
                  :size="32"
                  :username="comment.byMember.fullname"
                  :src="comment.byMember.imgUrl"
                />
                <section class="comment-info">
                  <h3 class="comment-info-header">
                    {{ comment.byMember.fullname }}
                    <span
                      >{{ comment.createdAt | moment("from", "now") }}
                    </span>
                  </h3>
                  <p class="comment-info-txt">{{ comment.txt }}</p>
                  <button
                    class="remove-comment"
                    v-if="isYourComment(comment)"
                    @click="removeComment(comment.id)"
                  >
                    Delete
                  </button>
                </section>
              </article>
            </div>
          </section>
        </section>
      </main>
      <nav class="details-actions">
        <section class="add-to-card">
          <h3 class="title">Add to card</h3>
          <button
            v-for="action in actions"
            :key="action.name"
            @click="setCurrAction(action)">
            <span class="material-icons-outlined">{{ action.icon }}</span>
            <span> {{ action.name }} </span>
          </button>
          <label for="input-file">
         <span class="attachments-icon material-icons-outlined">attachments</span>
          <span> Attachment </span>
          </label>
          <input
            id="input-file"
            type="file"
            @change="onUploadImg"
            accept="image/png, image/gif, image/jpeg"
            hidden
          />
          <component
            class="popup"
            v-if="currAction"
            :is="currAction.type"
            :card="card"
            :action="currAction"
            @close="closeEditPopup"
            @updateCard="updateCard"
          />
        </section>

        <section class="action-nav">
          <h3 class="title">Actions</h3>
          <button @click="removeCard">
            <span class="material-icons-outlined">delete</span>
            <span> Delete card </span>
          </button>
        </section>
      </nav>
    </section>
  </section>
</template>

<script>
import { uploadImg } from "../services/img-upload.service.js";
import cardMembersEdit from "@/cmps/dynamic/card-members-edit";
import cardLabelsEdit from "@/cmps/dynamic/card-labels-edit";
import cardChecklistEdit from "@/cmps/dynamic/card-checklist-edit";
import cardDatesEdit from "@/cmps/dynamic/card-dates-edit";
import cardCoverEdit from "@/cmps/dynamic/card-cover-edit";
import avatar from "vue-avatar";

export default {
  components: {
    cardMembersEdit,
    cardLabelsEdit,
    cardChecklistEdit,
    cardDatesEdit,
    cardCoverEdit,
    avatar,
  },
  data() {
    return {
      card: null,
      boardId: this.$route.params.boardId,
      groupId: this.$route.params.groupId,
      cardId: this.$route.params.cardId,
      description: null,
      groupName: null,
      titleActivityBtn: "Hide Details",
      commentTxt: "",
      iscommentOpen: false,
      isLoading: false,
      actions: [
        {
          type: "cardMembersEdit",
          icon: "person_add",
          name: "Members",
        },
        {
          type: "cardLabelsEdit",
          icon: "label",
          name: "Labels",
        },
        {
          type: "cardChecklistEdit",
          icon: "check_box",
          name: "Checklist",
        },
        {
          type: "cardDatesEdit",
          icon: "watch_later",
          name: "Dates",
        },
        {
          type: "cardCoverEdit",
          icon: "wallpaper",
          name: "Cover",
        },
      ],
      currAction: null,
    };
  },
  watch: {
    "$route.params.cardId": {
      immediate: true,
      async handler() {
        try {
           await this.loadCard();
           this.description = this.card.description;
        } catch (err) {
          console.log("cannot get card", err);
          throw err;
        }
      },
    },
  },
  async created() {
    try {
      const group = await this.$store.dispatch({
        type: "getGroupById",
        groupId: this.groupId,
        boardId: this.boardId,
      });
      this.groupName = group.title;
    } catch (err) {
      console.log("cannot get group", err);
      throw err;
    }
  },
  mounted() {
     setTimeout(() => {
      this.$refs.comment.$el.addEventListener(
        "focusout", this.checkCommentEmpty);
        }, 1);
  },
  methods: {
    async loadCard() {
      try {
        this.card = await this.$store.dispatch({
          type: "getCardById",
          cardId: this.cardId,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        console.log("this.card", this.card);
      } catch (err) {
        console.log("Had problem loading card", err);
      }
    },
        async saveCard() {
      try {
        this.card = await this.$store.dispatch({
          type: "saveCard",
          card: this.card,
          groupId: this.groupId,
          boardId: this.boardId,
        });
      } catch (err) {
        console.log("cannot save card", err);
        throw err;
      }
    },
    async removeCard() {
       var msg = {}
      try {
        this.closeCardDetails();
        await this.$store.dispatch({
          type: "removeCard",
          cardId: this.cardId,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        msg = {
           txt:'Card was successfully removed',
           type:'success'
        }
      } catch (err) {
           msg = {
           txt:'Fail remove card, try again later',
           type:'error'
        }
        throw err;
      }finally{
         await this.$store.dispatch({type:'showMsg', msg})
      }
    },
    async updateCard(card) {
      console.log("card", card);
      try {
        await this.$store.dispatch({
          type: "saveCard",
          card,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        this.loadCard();
      } catch (err) {
        console.log("Error updating card:", err);
      }
    },
    closeCardDetails() {
      this.$router.push(`/b/${this.boardId}`);
    },
    //POPUP-COMPONENTS
    closeEditPopup() {
      this.currAction = null;
    },
    setCurrAction(action) {
      this.currAction = action;
    },
    setPopup(value) {
      this.isPopupShow = true;
      this.type = value;
    },
    //ATTACHMENT
    async onUploadImg(ev) {
      try {
        this.isLoading = true;
        const res = await uploadImg(ev);
        this.card.attachments.push({ url: res.url, creatAt: Date.now() });
        this.saveCard();
      } catch (err) {
        console.log("cannot upload image", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    deleteImg(img){
      const imgIdx = this.card.attachments.findIndex(att => att.url === img.url)
      this.card.attachments.splice(imgIdx,1)
      this.saveCard();
    },
   //COMMENTS
    async addComment() {
       this.commentTxt = "";
       this.iscommentOpen = false;

      await this.$store.dispatch({
        type: "addComment",
        commentTxt: this.commentTxt,
        card: this.card,
        groupId: this.groupId,
        boardId: this.boardId,
      });
    },
    checkCommentEmpty() {
       console.log('yes');
      if (!this.commentTxt) this.iscommentOpen = false;
      else this.iscommentOpen = true;
    },
    isYourComment(comment) {
      return comment.byMember._id === this.$store.getters.loggedinUser._id;
    },
    async removeComment(commentId) {
      await this.$store.dispatch({
        type: "removeComment",
        commentId,
        card: this.card,
        groupId: this.groupId,
        boardId: this.boardId,
      });
    },
    setShowComments() {
      if (this.titleActivityBtn === "Show Details") {
        this.titleActivityBtn = "Hide Details";
      } else this.titleActivityBtn = "Show Details";
    },
  },
  computed: {
    classToComment() {
      return { isOpen: this.iscommentOpen };
    },
    getLoggedinUser() {
      return this.$store.getters.loggedinUser;
    },
  },
};
</script>