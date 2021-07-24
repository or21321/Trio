<template>
  <section class="side-menu-popup">
    <div class="card-edit-header">
      <transition name="slide-right">
        <span
          @click="setDeeperOption('')"
          v-if="deeperOption !== ''"
          class="material-icons-outlined back"
          >arrow_back_ios</span
        >
      </transition>
      <span v-if="deeperOption === 'photos'"
        >{{ title }}
        <span class="unsplash" @click="openNewWindowUnsplash"
          >unsplash</span
        ></span
      >
      <span v-else>{{ title }} </span>
      <span @click.stop="close" class="close-popup-btn material-icons"
        >close</span
      >
    </div>

    <div v-if="deeperOption === ''" class="card-edit-main popup-layout-1">
      <ul class="first-option">
        <li class="clickable" @click="setDeeperOption('changeBackground')">
          <span :style="background" class="background icon"></span>
          <span class="option">Change background</span>
        </li>
        <li class="clickable" @click="setDeeperOption('searchCards')">
          <span class="material-icons-outlined icon">search</span>
          <span class="option">Search cards</span>
        </li>
        <li class="clickable">
          <span class="material-icons-outlined icon">delete_outline</span>
          <span class="option" @click="remove">Delete Board</span>
        </li>
      </ul>

      <ul class="first-option">
        <li class="activity">
          <span class="material-icons-outlined icon">format_list_bulleted</span>
          <span class="option">Activity</span>
        </li>
        <li v-for="activity in activities" :key="activity.id" class="activity">
          <avatar
            :size="32"
            :username="activity.byMember.fullname"
            :src="activity.byMember.imgUrl"
            backgroundColor="#DFE1E6"
            color="#172b4d"
          />
          <div class="info">
            <p class="option">
              <span class="activity-user"
                >{{ activity.byMember.fullname }}
              </span>
              <span class="activity-txt">{{ activity.txt }}</span>
            </p>
            <span class="activity-time">{{
              activity.createdAt | moment("from", "now")
            }}</span>
          </div>
        </li>
      </ul>
    </div>

    <transition name="slide-from-right">
      <div
        v-if="deeperOption === 'changeBackground'"
        class="popup-layout-1 change-background"
      >
        <ul>
          <div @click="setDeeperOption('photos')">
            <img
              src="https://a.trellocdn.com/prgb/dist/images/photos-thumbnail@3x.8f9c1323c9c16601a9a4.jpg"
              alt=""
            />
            <p>Photos</p>
          </div>
          <div @click="setDeeperOption('colors')">
            <img
              src="https://a.trellocdn.com/prgb/dist/images/colors@2x.ec32a2ed8dd8198b8ef0.jpg"
              alt=""
            />
            <p>Colors</p>
          </div>
        </ul>
      </div>
    </transition>

    <transition name="slide-from-right">
      <div v-if="deeperOption === 'colors'" class="colors">
        <ul>
          <li
            v-for="color in colors"
            :key="color"
            :style="{ backgroundColor: color }"
            class="color"
            @click="changeBackground(color, '')"
          ></li>
        </ul>
      </div>
    </transition>

    <transition name="slide-from-right">
      <div v-if="deeperOption === 'photos'" class="photos">
        <input
          type="text"
          v-model="photosFilterBy"
          @input="getPhotos"
          placeholder="Photos"
        />
        <ul v-if="photosUrls.length">
          <li
            v-for="photoUrl in photosUrls"
            :key="photoUrl"
            class="photo"
            @click="changeBackground('', photoUrl)"
            :style="{ backgroundImage: `url(${photoUrl})` }"
          ></li>
        </ul>
          <img
              class="loading-gif"
              src="@/assets/loading.gif"
              v-if="isLoading"
              alt=""
            />
      </div>
    </transition>

    <transition name="slide-from-right">
      <div v-if="deeperOption === 'searchCards'" class="search-cards">
        <input
          type="text"
          v-model="cardsFilterBy.txt"
          @input="searchCards"
          placeholder="Search"
        />

        <ul v-if="boardLabels.length">
          <li
            v-for="label in boardLabels"
            :key="label.id"
            class="label-preview"
            @click="filterCardsByLabel(label.id)"
          >
            <div class="label-container">
              <span
                class="label-clr"
                :style="{ backgroundColor: label.color }"
              ></span>
              <span>{{ label.title }}</span>
            </div>
            <span
              v-if="label.isFilterBy"
              class="material-icons-outlined check-label-icon"
              >check</span
            >
          </li>
        </ul>

        <ul class="members" v-if="boardMembers.length">
          <li
            class="card-member-preview"
            v-for="member in boardMembers"
            :key="member.id"
            @click="filterCardsByMember(member._id)"
          >
            <div class="member-name">
              <avatar
                :size="32"
                :username="member.fullname"
                :src="member.imgUrl"
                color="#172b4d"
                backgroundColor="#dfe1e6"
              />
              <span>{{ member.fullname }} ({{ member.username }})</span>
            </div>
            <span
              v-if="member.isFilterBy"
              class="material-icons-outlined check-member-icon"
              >check</span
            >
          </li>
        </ul>

        <ul class="due-date">
          <li
            v-for="dateOption in dateFilterOptions"
            :key="dateOption.txt"
            class="date-preview"
            @click="filterCardsByDueDate(dateOption.timeLeft)"
          >
            <span>{{ dateOption.txt }}</span>
            <span
              v-if="dateOption.isFilterBy"
              class="material-icons-outlined check-due-date-icon"
              >check</span
            >
          </li>
        </ul>
      </div>
    </transition>
  </section>
</template>

<script>
import avatar from "vue-avatar";
import { unsplashService } from "@/services/unsplash.service";
import { debounce } from "@/services/util.service";

export default {
  props: {
    board: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      deeperOption: "",
      cardsFilterBy: {
        txt: "",
        labelIds: [],
        memberIds: [],
        timeLeft: Infinity,
      },
      boardMembers: [],
      boardLabels: [],
      photosFilterBy: "",
      dateFilterOptions: [
        {
          txt: "Due in the next day",
          timeLeft: 1000 * 60 * 60 * 24,
          isFilterBy: false,
        },
        {
          txt: "Due in the next week",
          timeLeft: 1000 * 60 * 60 * 24 * 7,
          isFilterBy: false,
        },
        {
          txt: "Due in the next month",
          timeLeft: 1000 * 60 * 60 * 24 * 7 * 4,
          isFilterBy: false,
        },
        // {
        //   txt: 'Has no due date',
        //   timeLeft: null
        // isFilterBy: false
        // },
        // {
        //   txt: 'Due date marked as complete',
        //   timeLeft: 1000 * 60 * 60 * 24
        // isFilterBy: false
        // },
      ],
      photosUrls: [
        "https://images.unsplash.com/photo-1485356824219-4bc17c2a2ea7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
        "https://images.unsplash.com/photo-1490079027102-cd08f2308c73?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
        "https://images.unsplash.com/photo-1611421964761-452bcf2a4a24?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=665&q=80",
        "https://images.unsplash.com/photo-1490643056814-058241121f45?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fHRyZWxsb3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=753&q=80",
        "https://images.unsplash.com/photo-1439923274069-a6f070db0c99?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YmFja2dyb3VuZHN8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
        "https://images.unsplash.com/photo-1524169113253-c6ba17f68498?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGJhY2tncm91bmRzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
        "https://images.unsplash.com/photo-1554034483-04fda0d3507b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mjd8fGJhY2tncm91bmRzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60",
        "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzN8fGJhY2tncm91bmRzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
        "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OTd8fGJhY2tncm91bmRzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=60",
      ],
      colors: [
        "#0079bf",
        "#d29034",
        "#519839",
        "#b04632",
        "#89609e",
        "#cd5a91",
        "#4bbf6b",
        "#00aecc",
        "#838c91",
      ],
      photos: null,
    };
  },
  created() {
    this.getPhotos = debounce(this.getPhotos, 500);
    this.searchCards = debounce(this.searchCards, 500);
    this.boardLabels = [];
    this.boardLabels = JSON.parse(JSON.stringify(this.board.labels));
    this.boardMembers = [];
    this.boardMembers = JSON.parse(JSON.stringify(this.board.members));
  },
  destroyed() {
    this.cardsFilterBy = {
      txt: "",
      labelIds: [],
      memberIds: [],
    };
    this.searchCards();
  },
  computed: {
    background() {
      if (this.board.style["background-color"])
        return { "background-color": this.board.style["background-color"] };
      else return { "background-image": this.board.style["background-image"] };
    },
    activities() {
      return this.board.activities;
    },
    title() {
      var title = "";
      switch (this.deeperOption) {
        case "changeBackground":
          title = "Change background";
          break;
        case "searchCards":
          title = "Search cards";
          break;
        case "colors":
          title = "Colors";
          break;
        case "photos":
          title = "Photos by";
          break;
        case "":
          title = "Menu";
          break;
      }
      return title;
    },
  },
  methods: {
    async getPhotos() {
      try {
        this.isLoading = true
        this.photosUrls = []
        const photos = await unsplashService.query(
          this.photosFilterBy.toLowerCase()
        );
        this.photosUrls = photos.map((photo) => photo.urls.regular);
      } catch (err) {
        console.log("Had a problem getting photos", err);
      } finally { 
        this.isLoading = false
      }
    },
    setDeeperOption(option) {
      this.deeperOption = option;
    },
    close() {
      this.$emit("close");
    },
    remove() {
      this.close();
      this.$emit("removeBoard", this.board._id);
    },
    changeBackground(color, photoUrl) {
      const style = {
        "background-color": color,
        "background-image": `url(${photoUrl}}&fit=scale&w=${window.screen.width-300}&h=${window.screen.height-300})`,
      };
      this.$emit("setBackground", style);
    },
    openNewWindowUnsplash() {
      window.open("https://unsplash.com/");
    },
    searchCards() {
      this.$store.commit({ type: "setFilterBy", filterBy: this.cardsFilterBy });
    },
    filterCardsByLabel(labelId) {
      const isFilteredByIdx = this.cardsFilterBy.labelIds.findIndex(
        (lId) => lId === labelId
      );
      if (isFilteredByIdx !== -1) {
        this.cardsFilterBy.labelIds.splice(isFilteredByIdx, 1);
        this.filterIsLabelFilterActive();
        return this.searchCards();
      }

      this.cardsFilterBy.labelIds.push(labelId);
      this.filterIsLabelFilterActive();
      this.searchCards();
    },
    filterIsLabelFilterActive() {
      if (!this.boardLabels.length || this.deeperOption !== "searchCards")
        return;
      const boardLabels = this.boardLabels.map((bLabel) => {
        bLabel.isFilterBy = this.cardsFilterBy.labelIds.some(
          (cfLabelId) => cfLabelId === bLabel.id
        )
          ? true
          : false;
        return bLabel;
      });
      this.boardLabels = boardLabels;
    },
    filterCardsByMember(memberId) {
      const isFilteredByIdx = this.cardsFilterBy.memberIds.findIndex(
        (mId) => mId === memberId
      );
      if (isFilteredByIdx !== -1) {
        this.cardsFilterBy.memberIds.splice(isFilteredByIdx, 1);
        this.filterIsMemberFilterActive();
        return this.searchCards();
      }

      this.cardsFilterBy.memberIds.push(memberId);
      console.log("this.cardsFilterBy.memberIds", this.cardsFilterBy.memberIds);
      this.filterIsMemberFilterActive();
      this.searchCards();
    },
    filterIsMemberFilterActive() {
      if (!this.boardLabels.length || this.deeperOption !== "searchCards")
        return;
      const boardMembers = this.boardMembers.map((bMember) => {
        bMember.isFilterBy = this.cardsFilterBy.memberIds.some(
          (cfMemberId) => cfMemberId === bMember._id
        )
          ? true
          : false;
        return bMember;
      });
      this.boardMembers = boardMembers;
    },
    filterCardsByDueDate(timeLeft) {
      console.log("filterCardsByDueDate, timeLeft", timeLeft);
      const isFilteredBy =
        timeLeft === this.cardsFilterBy.timeLeft ? true : false;
      console.log("isFilteredByIdx", isFilteredBy);

      if (isFilteredBy) {
        this.cardsFilterBy.timeLeft = 0;
        this.filterIsDueDateFilterActive(timeLeft);
        return this.searchCards();
      }

      this.cardsFilterBy.timeLeft = timeLeft;
      this.filterIsDueDateFilterActive(timeLeft);
      this.searchCards();
    },
    filterIsDueDateFilterActive(timeLeft) {
      console.log("filterIsDeDateFilterActive()");
      if (this.deeperOption !== "searchCards") return;

      const dateFilterOptions = this.dateFilterOptions.map((dueDateOption) => {
        if (dueDateOption.isFilterBy) {
          dueDateOption.isFilterBy = false;
          return dueDateOption;
        } else {
          dueDateOption.isFilterBy =
            dueDateOption.timeLeft === timeLeft ? true : false;
          console.log(dueDateOption);
          return dueDateOption;
        }
      });
      console.log("dateFilterOptions", dateFilterOptions);
      this.dateFilterOptions = dateFilterOptions;
    },
  },
  components: {
    avatar,
  },
};
</script>
