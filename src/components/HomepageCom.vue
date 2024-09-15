<template>
    <v-layout>
      <v-navigation-drawer v-model="drawer" location="right" temporary :width="500" persistent>
        <div>
          <v-form v-model="validForm" ref="formref" @submit.prevent="submitForm">

          <div class="py-3 d-flex align-center" @click="drawer = false"
            style="position: sticky;top: 0;background: cadetblue;color: white;z-index: 999;cursor: pointer;">
            <span><v-icon size="24">mdi-menu-left</v-icon></span>
            <span class="ms-2">Saving Segment</span>
          </div>
          <div class="p-3">

              <div class="row justify-center"> 
                <div class="col-md-12">
                  <p>Enter the Name of the segment</p>
                  <v-text-field v-model="segmentName" label="Name of the Segment" 
                  required variant="outlined"></v-text-field>
                </div>
              </div>
              
              <div>
                <p>To Save your segment, you need to add the schemas to build the query</p>
              </div>
            
              <div class="row">
                <div class="col-md-12">
                  <div v-if="filteredSelectedSchemas.length > 0" class="my-2" style="border: 5px solid skyblue;padding: 12px;">
                    <div class="d-flex" v-for="(selectSchema, index) in filteredSelectedSchemas" :key="index">
                    <!-- {{ console.log(selectSchema,'selectedSchemaselectedSchema') }} -->

                      <v-select v-model="selectSchema.label" :items="[]" :label="selectSchema.label" item-value="value" item-title="label" required variant="outlined"></v-select>

                      <v-btn class="ms-4" @click="unselectBtn(selectSchema,index)" color="danger"><span class="text-light">Unselect</span></v-btn>
                    </div>
                  </div>
                  
                  <v-select v-model="schema" :items="schemaList" label="Add Schema to segment" required variant="outlined" item-value="value" item-title="label">
                    <template v-slot:item="{ props, item}">
                      <v-list-item class="f-size-14 fw-500" v-bind="props" :subtitle="item.label"></v-list-item>
                    </template>
                  </v-select>

                  <p v-if="schemaError" class="text-danger" type="error">Please select a schema and add schema</p>

                  <a href="#" @click.prevent="addnewSchema()">+ Add New Schema</a>
         
                </div>
              </div>
            
  
          </div>

          <div class="m-4">
                <v-btn class="mr-4" type="submit" color="success" width="200px">
                  <span v-if="!proLoader">Save Segment</span>
                  <v-progress-circular v-if="proLoader" indeterminate ></v-progress-circular>
                </v-btn>
              </div>
        </v-form>

        </div>

        <v-dialog v-model="showmsg" max-width="400" persistent>
          <v-card>
            <v-card-text class="text-center">
              Schema Details Sended Successfully!!!
            </v-card-text>
            <v-btn @click="doneMsg()">Done</v-btn>
          </v-card>
        </v-dialog>

      </v-navigation-drawer>
      <v-main style="height: 250px">
        <div class="d-flex justify-center align-center h-100">
          <v-btn
            color="primary"
            @click.stop="drawer = !drawer"
          >
          Save Segment
          </v-btn>
        </div>
      </v-main>
    </v-layout>
</template>

<script>
  import axios from 'axios';

export default {
  name:"HomepageCom",
  data () {
      return {
        drawer: null,
        proLoader:false,
        showmsg:false,

        validForm:false,
        segmentName:"",
        addschemas:null,
        schema:null,

        nameRules: [
          v => !!v || 'Segment name is required',
          v => (v && v.length <= 10) || 'Name must be 10 characters or less',
        ],

        schemaRules: [
          (v) => !!v || "Please select a schema",
        ],

        schemaList:[
          { label: "First Name", value: "first_name" },
          { label: "Last Name", value: "last_name" },
          { label: "Gender", value: "gender" },
          { label: "Age", value: "age" },
          { label: "Account Name", value: "account_name" },
          { label: "City", value: "city" },
          { label: "State", value: "state" },
        ],

        selectedSchema:[],
        schemaError : false,
      }
    },

    methods:{
      addnewSchema(){
        this.schemaError = false;
        if (!this.schema) {
          this.schemaError = true;
          this.proLoader =  false;
          return;
        }
        const selectedSchemaObj = this.schemaList.find(s => s.value === this.schema);
        if (selectedSchemaObj) {
          console.log(selectedSchemaObj,'schemaschema',this.schema);
          this.selectedSchema.push({ value: selectedSchemaObj.value, label: selectedSchemaObj.label });
          this.schemaList = this.schemaList.filter(s => s.value !== selectedSchemaObj.value);
          this.schema = null;
        }
      },

      unselectBtn(removedItem,index){
        const [removedSchema] = this.selectedSchema.splice(index, 1);
        console.log(removedSchema,'dasdasdasdas');
        this.schemaList.push({value: removedSchema.value, label: removedSchema.label});
      },
      
      async submitForm(){
        this.schemaError = false;

        this.proLoader = true;

        if (!this.selectedSchema.length > 0) {
          this.schemaError = true;
          this.proLoader = false;
          return;
        }
        
        let objData = {
          segment_name : "last_10_days_blog_visits",
          schema :[]
        }

        console.log(this.schemaList,'schemaListschemaListschemaList...0');

        this.selectedSchema.forEach(v => {
          console.log(v.value,'asdasdasdasd')

          let schemaItem = {};
          schemaItem[v.value] = v.label;

          objData.schema.push(schemaItem)
        });

        // let getObjData = JSON.stringify(objData)
        let queryString = new URLSearchParams(JSON.stringify(objData)).toString();
        console.log(queryString,'getObjDatagetObjData')
        

      await axios.get(`https://webhook.site/3ae9c04e-6544-41e9-aa52-004e8481dc96?${queryString}`,{
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response) {
            console.log(response, "responseresponse...")  
            setTimeout(()=>{
              this.proLoader = false;
              this.showmsg = true;
              // this.$refs.formref.reset()
            },3000)         
          }
        })
        .catch((error) => {
          console.log(error, "errorerror");
          setTimeout(()=>{
              this.proLoader = false;
              this.showmsg = true;
              // this.$refs.formref.reset()
            },3000)
        });
      },

      doneMsg(){
        this.showmsg = false;
        setTimeout(()=>{
          location.reload();  
        },500)
      }
    },
    computed: {
    filteredSchemaList() {
      return this.schemaList.filter(
        (schema) =>
          !this.selectedSchema.some(
            (selected) => selected.value === schema.value
          )
      );
    },

    
    filteredSelectedSchemas() {
      if (!this.segmentName) {
        return this.selectedSchema;
      }
      const searchQuery = this.segmentName.toLowerCase();
      return this.selectedSchema.filter((schema) =>
        schema.label.toLowerCase().includes(searchQuery)
      );
    },
  }
}
</script>

