<template>
  <section class="card-details" @click="closeCardDetails">
    <section class="card-container" @click.stop v-if="card">
      <section
        class="cover"
        v-if="card.cover.color"
        :style="{ backgroundColor: card.cover.color }"
      ></section>
      <header class="header" :class="isCoverClass">
        <span class="icon-title material-icons-outlined icon"
          >movie_creation</span
        >
        <section class="titles">
          <input v-model="card.title" class="main-title" @input="saveCard" />
          <h4 class="sub-title">in list {{ groupName }}</h4>
        </section>
        <span class="close material-icons" @click="closeCardDetails">
          close
        </span>
      </header>
      <main class="main" :class="isCoverClass">
        <section class="info-section">
          <div class="members grid-details" v-if="card.members.length">
            <span></span>
            <h1 class="title-members">Members</h1>
            <div class="list-members">
              <avatar
                v-for="member in card.members"
                :key="member.id"
                :src="member.imgUrl"
                :username="member.fullname"
                :size="32"
                backgroundColor="#DFE1E6"
                color="#172b4d"
              />
              <span
                class="item-add-btn"
                @click="setCurrAction($event, actions[0])"
              >
                <span class="material-icons-outlined icon">add</span>
              </span>
            </div>
          </div>
          <div
            class="labels grid-details"
            v-if="cardLabels && cardLabels.length"
          >
            <span></span>
            <h1 class="title-labels">Labels</h1>
            <div class="list-labels">
              <span
                v-for="label in cardLabels"
                :key="label.id"
                :style="{ backgroundColor: label.color }"
                class="preview-label"
                @click="setCurrAction($event, actions[1])"
              >
                <span>{{ label.title }}</span>
              </span>
              <span
                class="item-add-btn"
                @click="setCurrAction($event, actions[1])"
              >
                <span class="material-icons-outlined icon">add</span>
              </span>
            </div>
          </div>
          <div class="date grid-details" v-if="card.dueDate.time">
            <span></span>
            <h1 class="title-date">DUE DATE</h1>
            <section class="date-main" @click="openDate">
              <el-checkbox
                ref="dueDate"
                v-model="card.dueDate.isDone"
              ></el-checkbox>
              <p>{{ card.dueDate.time | moment(" MMM Do") }}</p>
              <p class="complete" v-if="card.dueDate.isDone">COMPLETE</p>
            </section>
          </div>
        </section>

        <section class="description grid-details">
          <span class="material-icons-outlined icon">subject</span>
          <h1 class="title-description title">Description</h1>
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
          v-if="card.attachments.length || isLoading"
        >
          <span class="attachments-icon material-icons-outlined icon"
            >attachments</span
          >
          <h1 class="title-attachments title">Attachments</h1>
          <div class="imgs-container">
            <article
              class="img-container"
              v-for="(img, idx) in card.attachments"
              :key="idx"
            >
              <span
                class="material-icons-outlined delete-img"
                @click="deleteImg(img)"
                >delete</span
              >
              <img :src="img.url" />
              <p>{{ img.creatAt | moment("dddd, MMM Do YYYY") }}</p>
            </article>
            <img
              class="loading-gif"
              src="@/assets/loading.gif"
              v-if="isLoading"
              alt=""
            />
          </div>
        </section>
        <section v-if="card.checklists.length">
          <section
            class="checklist grid-details"
            v-for="checklist in card.checklists"
            :key="checklist.id"
          >
            <span class="material-icons-outlined icon">check_box</span>
            <div class="header-checklist">
              <h1 class="title-checklist title">{{ checklist.title }}</h1>
              <button
                class="delete btn-details"
                @click="removeChecklist(checklist.id)"
              >
                Delete
              </button>
            </div>
            <section class="checklists-list">
              <section class="checklist-preview">
                <section class="main-checklist">
                  <section class="scroll-container">
                    <span class="percent">{{ getPercent(checklist) }}%</span>
                    <div class="scroll">
                      <div
                        class="scroll-done"
                        :class="{ 'all-done': getPercent(checklist) === 100 }"
                        :style="{ width: getPercent(checklist) + '%' }"
                      ></div>
                    </div>
                  </section>

                  <article
                    class="checkbox-preview"
                    v-for="checkbox in checklist.todos"
                    :key="checkbox.id"
                  >
                    <el-checkbox
                      class="checkbox-input"
                      v-model="checkbox.isDone"
                      @change="addCheckboxActivityAndSave(checkbox)"
                    ></el-checkbox>
                    <input
                      class="info"
                      :class="{ 'is-done': checkbox.isDone }"
                      v-model="checkbox.title"
                      ref="infoCheckbox"
                      @focusout="saveCheckbox"
                      @keypress.enter="saveCheckbox"
                    />
                    <span
                      class="delete material-icons-outlined icon"
                      @click="deleteCheckbox(checkbox.id, checklist.id)"
                      >delete</span
                    >
                  </article>
                  <section class="all-item-container">
                    <button
                      class="open-input btn-details"
                      @click="openChanges(checklist.id)"
                      v-if="currChecklist !== checklist.id"
                    >
                      Add an item
                    </button>

                    <div class="main-changes" v-else>
                      <input
                        type="text"
                        class="add-item"
                        v-model="checkboxTitle"
                        placeholder="Add an item"
                        ref="addCheckbox"
                      />

                      <div class="buttons">
                        <el-button
                          type="primary"
                          :disabled="!checkboxTitle"
                          class="add"
                          @click="addCheckbox"
                          >Add</el-button
                        >
                        <span
                          class="material-icons-outlined close"
                          @click="closeChanges"
                          >close</span
                        >
                      </div>
                    </div>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
        <section class="activity grid-details">
          <span class="material-icons-outlined icon">format_list_bulleted</span>
          <div class="header-activity">
            <h1 class="title-activity title">Activity</h1>
            <button
              class="toggle-details-activity btn-details"
              @click="setShowComments"
            >
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
                backgroundColor="#DFE1E6"
                color="#172b4d"
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
            <div class="comment-list">
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
                  backgroundColor="#DFE1E6"
                  color="#172b4d"
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
            <activity
              v-if="titleActivityBtn === 'Hide Details'"
              :activities="activitiesToShow"
              :hasHeader="false"
            />
          </section>
        </section>
      </main>
      <nav class="details-actions" :class="isCoverClass">
        <section
          class="suggested-nav"
          v-if="userNotInclude && userIsMemberShip"
        >
          <h4 class="title">SUGGESTED</h4>
          <label @click="addUserToCard">
            <span class="material-icons-outlined icon">person_add</span>
            <span class="txt"> Join </span>
          </label>
        </section>

        <section class="add-to-card">
          <h4 class="title">ADD TO CARD</h4>
          <label
            class="nav-action"
            v-for="action in actions"
            :key="action.name"
            @click="setCurrAction($event, action)"
          >
            <span class="material-icons-outlined icon">{{ action.icon }}</span>
            <span class="txt"> {{ action.name }} </span>
          </label>
          <label v-if="this.card.dueDate.time" @click="removeDate">
            <span class="material-icons-outlined">history</span>
            <span class="txt"> Remove date </span>
          </label>
          <label for="input-file">
            <span class="attachments-icon material-icons-outlined"
              >attachments</span
            >
            <span class="txt"> Attachment </span>
          </label>
          <input
            id="input-file"
            type="file"
            @change="onUploadImg"
            accept="image/png, image/gif, image/jpeg"
            hidden
          />
          <!-- v-if="currAction" -->
          <component
            v-clickoutside="closeEditPopup"
            class="popup dynamic-component"
            v-if="isPopupShow"
            :is="currAction.type"
            :card="card"
            :action="currAction"
            @close="closeEditPopup"
            @updateCard="saveCard"
          />
        </section>

        <section class="action-nav">
          <h4 class="title">ACTIONS</h4>
          <label @click="copyCard">
            <span class="material-icons-outlined icon">copy</span>
            <span class="txt"> Copy</span>
          </label>
          <label @click="removeCard">
            <span class="material-icons-outlined icon">delete</span>
            <span class="txt"> Delete card </span>
          </label>
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
import activity from "@/cmps/activity";
import { eventBus } from "@/services/event-bus-service";
import avatar from "vue-avatar";
export default {
  components: {
    cardMembersEdit,
    cardLabelsEdit,
    cardChecklistEdit,
    cardDatesEdit,
    cardCoverEdit,
    avatar,
    activity,
  },
  props: {
    loggedinUser: {
      type: Object,
    },
  },
  data() {
    return {
      cardLabels: null,
      card: null,
      boardId: this.$route.params.boardId,
      groupId: this.$route.params.groupId,
      cardId: this.$route.params.cardId,
      description: null,
      groupName: null,
      checkboxTitle: "",
      currChecklist: null,
      titleActivityBtn: "Hide Details",
      commentTxt: "",
      iscommentOpen: false,
      isLoading: false,
      isLoadingCard: false,
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
          type: "cardCoverEdit",
          icon: "wallpaper",
          name: "Cover",
        },
        {
          type: "cardDatesEdit",
          icon: "watch_later",
          name: "Dates",
        },
      ],
      currAction: null,
      isPopupShow: false,
    };
  },
  watch: {
    "$route.params.cardId": {
      immediate: true,
      async handler() {
        try {
          this.isLoadingCard = true;
          await this.loadCard();

          const group = await this.$store.dispatch({
            type: "getGroupById",
            groupId: this.groupId,
            boardId: this.boardId,
          });
          this.groupName = group.title;
          this.description = this.card.description;
          await this.clearUserNotifications();
          this.filterCardLabels();
          this.isLoadingCard = false;
        } catch (err) {
          console.log("cannot get card", err);
          throw err;
        }
      },
    },
    "currBoard.labels": {
      handler() {
        this.filterCardLabels();
      },
    },
    "card.dueDate": {
      deep: true,
      handler() {
        if (this.isLoadingCard) {
          console.log("NOPE");
          return;
        }
        this.saveCard();
      },
    },
  },
  mounted() {
    if (this.card) {
      setTimeout(() => {
        this.$refs.comment.$el.addEventListener(
          "focusout",
          this.checkCommentEmpty
        );
      }, 500);
    }
  },
  methods: {
    async clearUserNotifications() {
      try {
        const loggedinUser = JSON.parse(JSON.stringify(this.loggedinUser));
        const clearedMentions = loggedinUser.mentions.filter((mention) => {
          return mention.cardId !== this.card.id;
        });
        loggedinUser.mentions = clearedMentions;
        await this.$store.dispatch({ type: "updateUser", user: loggedinUser });
      } catch (err) {
        console.log("Had a problem clearing user notifications", err);
      }
    },
    filterCardLabels() {
      if (!this.card) return;
      if (!this.card.labelIds.length) return (this.cardLabels = []);
      console.log("filterCardLabels", this.card.labelIds.length);
      this.cardLabels = [];
      this.card.labelIds.forEach((cardLabelId) => {
        const label = this.currBoard.labels.find((label) => {
          return label.id == cardLabelId;
        });
        if (label) this.cardLabels.push(label);
      });
    },
    async loadCard() {
      try {
        this.card = await this.$store.dispatch({
          type: "getCardById",
          cardId: this.cardId,
          groupId: this.groupId,
          boardId: this.boardId,
        });
      } catch (err) {
        console.log("Had problem loading card", err);
      }
    },
    async saveCard(savedCard, isDaynamicComponent = false) {
      savedCard = isDaynamicComponent ? savedCard : this.card;
      if (!savedCard) return;
      try {
        this.card = await this.$store.dispatch({
          type: "saveCard",
          card: savedCard,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        console.log("AFTER SAVECARD", this.card);
        this.filterCardLabels()
        this.socketUpdateBoard();
      } catch (err) {
        console.log("cannot save card", err);
        throw err;
      }
    },
    async removeCard() {
      var msg = {};
      try {
        const activity = {
          txt: `deleted ${this.card.title} from ${this.groupName}`,
          card: { id: this.card.id, title: this.card.title },
        };
        await this.$store.dispatch({
          type: "removeCard",
          cardId: this.cardId,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        await this.socketUpdateBoard();
        await this.closeCardDetails();
        await eventBus.$emit("addActivity", activity);
        msg = {
          txt: "Card was successfully removed",
          type: "success",
        };
      } catch (err) {
        msg = {
          txt: "Fail remove card, try again later",
          type: "error",
        };
      } finally {
        await this.$store.dispatch({ type: "showMsg", msg });
      }
    },
    socketUpdateBoard() {
      if (!this.card) return;
      console.log("EMITTING SOCKET");
      this.$emit("socketUpdateBoard");
    },
    closeCardDetails() {
      this.$router.push(`/b/${this.boardId}`);
    },
    //POPUP-COMPONENTS
    closeEditPopup() {
      this.isPopupShow = false;
      this.currAction = null;
    },
    setCurrAction(event, action) {
      // Preparation for positioning dynamic cmps.
      this.currAction = action;
      this.isPopupShow = true;
    },
    //ATTACHMENT
    async onUploadImg(ev) {
      try {
        this.isLoading = true;
        const res = await uploadImg(ev);
        this.card.attachments.push({ url: res.url, creatAt: Date.now() });
        const activity = {
          txt: `added an attachment to ${this.card.title}`,
          card: { id: this.card.id, title: this.card.title },
        };
        this.saveCard();
        eventBus.$emit("addActivity", activity);
      } catch (err) {
        console.log("cannot upload image", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    deleteImg(img) {
      const imgIdx = this.card.attachments.findIndex(
        (att) => att.url === img.url
      );
      this.card.attachments.splice(imgIdx, 1);
      const activity = {
        txt: `deleted an attachment from ${this.card.title}`,
        card: { id: this.card.id, title: this.card.title },
      };
      this.saveCard();
      eventBus.$emit("addActivity", activity);
    },
    //Checklist
    openChanges(checklistId) {
      this.checkboxTitle = "";
      this.currChecklist = checklistId;
    },
    async removeChecklist(checklistId) {
      try {
        var msg = {};
        await this.$store.dispatch({
          type: "removeChecklist",
          checklistId: checklistId,
          card: this.card,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        msg = {
          txt: "Checklist was successfully removed",
          type: "success",
        };
        this.socketUpdateBoard();
      } catch (err) {
        msg = {
          txt: "Fail to remove checklist, try again later",
          type: "error",
        };
      } finally {
        await this.$store.dispatch({ type: "showMsg", msg });
      }
    },
    async deleteCheckbox(checkboxId, checklistId) {
      try {
        await this.$store.dispatch({
          type: "removeCheckbox",
          checkboxId: checkboxId,
          checklistId: checklistId,
          card: this.card,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        this.socketUpdateBoard();
      } catch (err) {
        console.log("ERROR: cannot remove checkbox", checkboxId, ",", err);
      }
    },
    async addCheckbox() {
      try {
        this.$store.dispatch({
          type: "addCheckbox",
          title: this.checkboxTitle,
          checklistId: this.currChecklist,
          card: this.card,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        this.closeChanges();
        this.socketUpdateBoard();
      } catch (err) {
        console.log("ERROR: cannot add checkbox");
      }
    },
    closeChanges() {
      this.checkboxTitle = "";
      this.currChecklist = null;
    },
    saveCheckbox(ev) {
      this.saveCard();
      this.socketUpdateBoard();
      ev.target.blur();
    },
    //  DATE
    openDate(ev) {
      if (ev.target.tagName === "P") this.setCurrAction(ev, this.actions[4]);
    },
    removeDate() {
      this.card.dueDate = {};
      this.saveCard();
    },
    //COMMENTS
    async addComment() {
      await this.$store.dispatch({
        type: "addComment",
        commentTxt: this.commentTxt,
        card: this.card,
        groupId: this.groupId,
        boardId: this.boardId,
      });
      this.isMention();
      const activity = {
        txt: `added a comment on ${this.card.title}`,
        card: { id: this.card.id, title: this.card.title },
      };
      eventBus.$emit("addActivity", activity);
      this.commentTxt = "";
      this.iscommentOpen = false;
    },
    isMention() {
      if (!this.commentTxt.includes("@")) return;
      const comment = this.commentTxt;
      const userMentioned = comment.split("@")[1].split(" ")[0];
      this.$store.dispatch({
        type: "addMention",
        username: userMentioned,
        cardId: this.card.id,
      });
    },
    checkCommentEmpty() {
      if (!this.commentTxt) this.iscommentOpen = false;
      else this.iscommentOpen = true;
      this.socketUpdateBoard();
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
      const activity = {
        txt: `deleted a comment from ${this.card.title}`,
        card: { id: this.card.id, title: this.card.title },
      };
      eventBus.$emit("addActivity", activity);
      this.socketUpdateBoard();
    },
    setShowComments() {
      if (this.titleActivityBtn === "Show Details") {
        this.titleActivityBtn = "Hide Details";
      } else this.titleActivityBtn = "Show Details";
    },
    getPercent(checklist) {
      const all = checklist.todos.length;
      if (all === 0) return 0;
      const acc = checklist.todos.reduce((acc, todo) => {
        if (todo.isDone) acc++;
        return acc;
      }, 0);
      return Math.floor((acc * 100) / all);
    },
    addUserToCard() {
      const user = this.$store.getters.getMyMiniUser;
      this.card.members.push(user);
      this.saveCard();
      const activity = {
        txt: `joined ${this.card.title}`,
        card: { id: this.card.id, title: this.card.title },
      };
      eventBus.$emit("addActivity", activity);
    },
    async copyCard() {
      try {
        var msg = {};
        await this.$store.dispatch({
          type: "copyCard",
          card: this.card,
          groupId: this.groupId,
          boardId: this.boardId,
        });
        //   this.saveCard();
        const activity = {
          txt: `copied ${this.card.title} from ${this.card.title} in list ${this.groupName}`,
          card: { id: this.card.id, title: this.card.title },
        };
        eventBus.$emit("addActivity", activity);
        this.socketUpdateBoard();
        msg = {
          txt: "Card was successfully copied",
          type: "success",
        };
      } catch (err) {
        msg = {
          txt: "Fail copied card, try again later",
          type: "error",
        };
      } finally {
        await this.$store.dispatch({ type: "showMsg", msg });
      }
    },
    async addCheckboxActivityAndSave(checkbox) {
      var activity = {};
      if (checkbox.isDone)
        activity = {
          txt: `completed ${checkbox.title} on card ${this.card.title}`,
        };
      else
        activity = {
          txt: `removed completed mark from ${checkbox.title} on card ${this.card.title}`,
        };
      activity.card = { id: this.card.id, title: this.card.title };
      this.saveCard();
      eventBus.$emit("addActivity", activity);
    },
    markDueDateActivity() {
      var activity = {};
      if (this.card.dueDate.isDone)
        activity = {
          txt: `marked the due date on ${this.card.title} complete`,
        };
      else
        activity = {
          txt: `marked the due date on ${this.card.title} incomplete`,
        };
      activity.card = { id: this.card.id, title: this.card.title };
      eventBus.$emit("addActivity", activity);
    },
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
    classToComment() {
      return { isOpen: this.iscommentOpen };
    },
    getLoggedinUser() {
      return this.$store.getters.loggedinUser;
    },
    isCoverClass() {
      return { "is-cover": this.card.cover.color };
    },
    userNotInclude() {
      const user = this.$store.getters.loggedinUser;
      const isUserMemberIdx = this.card.members.findIndex((member) => {
        return member._id === user._id;
      });
      return isUserMemberIdx === -1 ? true : false;
    },
    userIsMemberShip() {
      const user = this.$store.getters.loggedinUser;
      return this.currBoard.members.some((member) => {
        return member._id === user._id;
      });
    },
    activitiesToShow() {
      const cardActivities = this.$store.getters.currBoard.activities.filter(
        (activity) => {
          if (activity.card) return activity.card.id === this.card.id;
          return false;
        }
      );
      return JSON.parse(JSON.stringify(cardActivities)).reverse();
    },
  },
};
</script>