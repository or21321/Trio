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
          <h1 class="title-attachments">attachments</h1>
          <div class="imgs-container">
            <article
              class="img-container"
              v-for="(img, idx) in card.attachments"
              :key="idx"
            >
              <img :src="img.url" />
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
                class="hover-pointer"
                :size="32"
                username="Or Hadar"
                src="https://res.cloudinary.com/or21321/image/upload/v1626317415/pp_bqtkzw.jpg"
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
                  class="hover-pointer"
                  :size="32"
                  username="Or Hadar"
                  src="https://res.cloudinary.com/or21321/image/upload/v1626317415/pp_bqtkzw.jpg"
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
      <nav class="nav">
        <section class="add-to-card">
          <h3 class="title">Add to card</h3>
          <button @click="setPopup('Members')">
            <span class="material-icons-outlined">person_add</span>
            <span> Members </span>
          </button>
          <button @click="setPopup('Labels')">
            <span class="material-icons-outlined">label</span>
            <span> Labels </span>
          </button>
          <button @click="setPopup('Checklist')">
            <span class="material-icons-outlined">check_box</span>
            <span> Checklist </span>
          </button>
          <button @click="setPopup('Dates')">
            <span class="material-icons-outlined">watch_later</span>
            <span> Dates </span>
          </button>
          <label for="input-file">
            <span class="attachments-icon material-icons-outlined"
              >attachment</span
            >
            <span> Attachment </span>
          </label>
          <input
            id="input-file"
            type="file"
            @change="onUploadImg"
            accept="image/png, image/gif, image/jpeg"
            hidden
          />
          <button @click="setPopup('Cover')">
            <span class="material-icons-outlined">wallpaper</span>
            <span> Cover </span>
          </button>
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
import avatar from "vue-avatar";
export default {
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
      type: null,
      isPopupShow: false,
    };
  },
  watch: {
    "$route.params.cardId": {
      immediate: true,
      async handler() {
        try {
          this.card = await this.$store.dispatch({
            type: "getCardById",
            cardId: this.cardId,
            groupId: this.groupId,
            boardId: this.boardId,
          });
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
      this.$refs.comment.$refs.element.addEventListener(
        "focusout",
        this.checkCommentEmpty
      );
    }, 1);
  },
  methods: {
    closeCardDetails() {
      this.$router.push(`/b/${this.boardId}`);
    },
    setPopup(value) {
      this.isPopupShow = true;
      this.type = value;
    },
    async onUploadImg(ev) {
      try {
        this.isLoading = true;
        const res = await uploadImg(ev);
        this.card.attachments.push({ url: res.url, creatAt: Date.now() });
        this.saveCard();
      } catch (err) {
        console.log("cannot save card", err);
        throw err;
      } finally {
        this.isLoading = false;
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
    async removeCard(){
       try {
        await this.$store.dispatch({
          type: "removeCard",
          card: this.card,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        this.closeCardDetails();
      } catch (err) {
        console.log("cannot remove card", err);
        throw err;
      }
    },

    async addComment() {
      await this.$store.dispatch({
        type: "addComment",
        commentTxt: this.commentTxt,
        cardId: this.cardId,
        groupId: this.groupId,
        boardId: this.boardId,
      });
      this.commentTxt = "";
      this.iscommentOpen = false;
    },
    checkCommentEmpty() {
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
        console.log("yes");
        this.titleActivityBtn = "Hide Details";
      } else this.titleActivityBtn = "Show Details";
    },
  },
  computed: {
    classToComment() {
      return { isOpen: this.iscommentOpen };
    },
  },
  components: {
    avatar,
  },
};
</script>