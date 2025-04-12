const Template =require('../models/TemplateModels')

const getTemplate = async (req, res) => {
    try {
      const template = await Template.find();
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };
 
const postTemplate= async (req, res)=>{
    const data = 
    {
      "name": "Modern Blue Tailwind",
      "layout": `
        <div class="min-h-screen bg-gray-50 p-8">
          <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            
            <!-- Header Section -->
            <div class="bg-blue-900 text-white px-8 py-6">
              <h1 class="text-4xl font-bold mb-2">{{name}}</h1>
              <p class="text-xl text-blue-200">{{job_title}}</p>
            </div>
    
            <!-- Contact Info -->
            <div class="flex flex-wrap gap-4 p-6 border-b">
              <div class="flex items-center gap-2 text-gray-600">
                <svg class="w-5 h-5"><!-- Location Icon --></svg>
                <span>{{address}}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600">
                <svg class="w-5 h-5"><!-- Email Icon --></svg>
                <span>{{email}}</span>
              </div>
              <div class="flex items-center gap-2 text-gray-600">
                <svg class="w-5 h-5"><!-- Phone Icon --></svg>
                <span>{{phone}}</span>
              </div>
            </div>
    
            <!-- Main Content -->
            <div class="grid md:grid-cols-3 gap-8 p-8">
              <!-- Left Sidebar -->
              <div class="md:col-span-1 space-y-6">
                <!-- Skills -->
                <div>
                  <h2 class="text-2xl font-bold text-blue-900 mb-4">Skills</h2>
                  <div class="flex flex-wrap gap-2">
                    {{#each skills}}
                    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{{this}}</span>
                    {{/each}}
                  </div>
                </div>
    
                <!-- Education -->
                <div>
                  <h2 class="text-2xl font-bold text-blue-900 mb-4">Education</h2>
                  {{#each education}}
                  <div class="mb-4">
                    <h3 class="font-semibold text-gray-800">{{degree}}</h3>
                    <p class="text-gray-600 text-sm">{{university}}</p>
                    <p class="text-gray-500 text-xs">{{duration}}</p>
                  </div>
                  {{/each}}
                </div>
              </div>
    
              <!-- Right Main Content -->
              <div class="md:col-span-2 space-y-8">
                <!-- Experience -->
                <div>
                  <h2 class="text-2xl font-bold text-blue-900 mb-6">Experience</h2>
                  {{#each experience}}
                  <div class="mb-6">
                    <div class="flex justify-between items-start mb-2">
                      <h3 class="text-xl font-semibold text-gray-800">{{position}}</h3>
                      <span class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{{duration}}</span>
                    </div>
                    <p class="text-gray-600 mb-3">{{company}}</p>
                    <ul class="list-disc pl-6 space-y-2">
                      {{#each points}}
                      <li class="text-gray-700">{{this}}</li>
                      {{/each}}
                    </ul>
                  </div>
                  {{/each}}
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
      "css": "",
      "preview": "https://cdn.example.com/previews/modern-blue-tailwind.jpg",
    }
    
      

      try{
        const template= new Template({name: data.name,layout:data.layout})
        await template.save()
        res.status(201).json({ message: "Template added  successfully" });
      } catch (error) {
        res.status(500).json({ message: "Server Error", error });
      }
}

const singleTemplate =async (req, res)=>{
  // const id = req.params.id
  console.log(req.params.id)
  try{
    const temp = await Template.findById(req.params.id);
    console.log(temp)
    if (!temp) return res.status(404).json({ message: "Template not found" });

    res.json(temp);
  }catch (error) {
    res.status(500).json({ message: "Server Error" });
  }

}
  module.exports = {
   getTemplate,
   postTemplate,
   singleTemplate
  };
  