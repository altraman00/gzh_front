 <template>
     <div class="msg-main">
         <p>选择活动模板</p>
         <el-select v-model="template">
             <el-option v-for="item in list" :key="item.id" :label="item.templateName" :value="item.id"></el-option>
         </el-select>
     </div>
 </template>
 <script>
 export default {
     props: {
         list: Array
     },
     data () {
         return {

         template: null
         }
     },
     created(){
         console.log('list', this.list)
     }
 }
 </script>