<script>
import { Pie } from 'vue-chartjs'
import {utilService} from '../services/util.service.js'
export default {
  extends: Pie,
   props:{
      board:{
        type:Object,
        required:true
      }
   },
  data() {
    return {
       options: {
             legend: {
                labels: {
                   fontSize: 11
                }
            }
      },
      colors:[]
    };
  },
  mounted() {
     const cardByMemberMap = this.getCardByMemberMap;
      this.setColors();
      this.renderChart({
        labels: Object.keys(cardByMemberMap),
        datasets: [
          {
            backgroundColor: this.colors,
            data: Object.values(cardByMemberMap),
          },
        ],
      },
      this.options
      );
  },
  methods: {
      setColors(){
         for(var i = 0; i < this.board.members.length; i++){
            this.colors.push(utilService.getRandomColor())
         }
      }
  },
  computed:{
      getCardByMemberMap(){
         return this.board.members.reduce((acc, member) => {
            acc[member.username] = 0;
             this.board.groups.forEach(group => {

            group.cards.forEach(card =>{
               const idxMember = card.members.findIndex(m => m._id === member._id)
              if(idxMember !== -1){  
                 console.log(member.username, group.title,idxMember);
                  acc[member.username]++;
               }
            })
         })
            return acc;
         }, {});
      },
   },
   destroyed() {
    this.colors = [];
  },
};
</script>