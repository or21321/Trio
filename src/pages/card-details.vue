<template>
  <section class="card-details" @click="closeCardDetails">
    <main class="card-container" @click.stop="" v-if="card">
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
      <section class="main">
        <section class="description grid-details">
          <span class="material-icons-outlined">subject</span>
          <h1 class="title-description">Description</h1>
          <contenteditable
            class="description-text"
            tag="div"
            :contenteditable="isEditable"
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
      </section>

      <!-- <cardEditPopup v-if="currAction" @updateTask="updateTask">
        <h2 slot="header">{{currAction.name}}</h2>
        <component :is="action.type" :card="card" :action="action"/>
      </cardEditPopup> -->

      <nav class="details-actions">
        <h3 class="title">Add to card</h3>
        <label
          v-for="action in actions"
          :key="action.name"
          @click="setCurrAction(action)"
        >
          <span class="material-icons-outlined">{{ action.icon }}</span>
          <span> {{ action.name }} </span>
        </label>
        <component
          class="popup"
          v-if="currAction"
          :is="currAction.type"
          :card="card"
          :action="currAction"
          @updateTask="updateTask()"
        />
      </nav>

      <!-- <nav class="nav">
        <h3 class="title">Add to card</h3>
        <button @click="setCurrAction(actions[0])">
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
      </nav> -->
    </main>
  </section>
</template>

<script>
import { uploadImg } from "../services/img-upload.service.js";
import cardMembersEdit from "@/cmps/dynamic/card-members-edit";
import cardLabelsEdit from "@/cmps/dynamic/card-labels-edit";
import cardChecklistEdit from "@/cmps/dynamic/card-checklist-edit";
import cardDatesEdit from "@/cmps/dynamic/card-dates-edit";
import cardAttachmentEdit from "@/cmps/dynamic/card-attachment-edit";
import cardCoverEdit from "@/cmps/dynamic/card-cover-edit";

export default {
  components: {
    cardMembersEdit,
    cardLabelsEdit,
    cardChecklistEdit,
    cardDatesEdit,
    cardAttachmentEdit,
    cardCoverEdit,
  },
  data() {
    return {
      card: null,
      boardId: this.$route.params.boardId,
      groupId: this.$route.params.groupId,
      cardId: this.$route.params.cardId,
      groupName: null,
      isEditable: true,
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
          type: "cardAttachmentEdit",
          icon: "attachment",
          name: "Attachment",
        },
        {
          type: "cardCoverEdit",
          icon: "wallpaper",
          name: "cover",
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
          this.card = await this.$store.dispatch({
            type: "getCardById",
            cardId: this.cardId,
            groupId: this.groupId,
            boardId: this.boardId,
          });
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
  methods: {
    updateTask(card) {
      console.log("from card details, card", card);
    },
    setCurrAction(action) {
      this.currAction = action;
    },
    enterPressed() {
      console.log("yes!");
    },
    closeCardDetails() {
      this.$router.push(`/b/${this.boardId}`);
    },
    setPopup() {},
    async onUploadImg(ev) {
      try {
        this.isLoading = true;
        const res = await uploadImg(ev);
        this.card.attachments.push({ url: res.url, creatAt: Date.now() });
        this.card = await this.$store.dispatch({
          type: "saveCard",
          card: this.card,
          groupId: this.groupId,
          boardId: this.boardId,
        });
      } catch (err) {
        console.log("cannot save card", err);
        throw err;
      } finally {
        this.isLoading = false;
      }
      console.log("this.card", this.card);
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
    setDescription(ev) {
      console.log("ev.data", ev.data);
      if (ev.data) this.card.description += ev.data;
      else {
        this.card.description = this.card.description.substring(
          0,
          this.card.description.length - 1
        );
      }
      //   console.log('description', this.card.description)
    },
  },
  computed: {},
};
</script>

<style>
</style>