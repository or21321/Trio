<script>
import { Bar } from 'vue-chartjs'
import {utilService} from '../services/util.service.js'
// Chart.defaults.global.legend.display = false;
// Chart.defaults.global.defaultFontSize=10;
export default {
  extends: Bar,
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
            display: false
         },
         scales: {
            yAxes: [{
               ticks: {
                  beginAtZero: true
               }
            }]
         }
      },
       colors:[]
    }
  },
  mounted() {
     const cardsByGroup = this.getGroupCardsMap;
      this.setColors();
      this.renderChart({
        labels: Object.keys(cardsByGroup),
        datasets: [
           {
            backgroundColor: this.colors,
            data: Object.values(cardsByGroup),
            hoverBorderWidth:2,
            hoverBorderColor:'gray',
          },
        ],
      },
      this.options
      );
  },
  methods: {
      setColors(){
         for(var i = 0; i < this.board.groups.length; i++){
            this.colors.push(utilService.getRandomColor())
         }
      }
  },
  computed:{
      getGroupCardsMap(){
         return this.board.groups.reduce((acc, group) => {
            acc[group.title] = 0;
            group.cards.reduce((acc1) =>{
               acc[group.title] = acc1;
               return ++acc1
            },0)
            return acc;
         }, {});
      },

   },
   destroyed() {
    this.colors = [];
  },
};
</script>