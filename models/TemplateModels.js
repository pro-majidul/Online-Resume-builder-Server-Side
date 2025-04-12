const mongoose= require('mongoose')

const TemplateSchema= mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Template name is required'],
        trim: true,
      },
      layout: {
        type: String,
        required: [true, 'HTML layout is required']
      },
      previewImage: {
        type: String,
        default: 'default-preview.png'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
   
   }, {Timestamp : true})
   
   const Template = mongoose.model("Template", TemplateSchema);
   
   module.exports = Template;