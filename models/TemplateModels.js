const mongoose= require('mongoose')

const TemplateSchema= mongoose.Schema({
    name:{
           type : String,
           require :[true ,' category is required'],
           trim : true
       },
       layout:{
           type : String,
           require :[true ,' layout is required'],
           trim : true
       },
   
   }, {Timestamp : true})
   
   const Template = mongoose.model("Template", TemplateSchema);
   
   module.exports = Template;