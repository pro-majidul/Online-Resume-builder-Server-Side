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
      "id": 5,
      "name": "Modern One Column Resume",
      "layout": `
        <div class="flex justify-center bg-gray-100 py-8">
          <div class="bg-blue-50 shadow-lg p-8 w-full max-w-[800px] min-h-[900px]">
            <h1 class="text-3xl font-semibold text-gray-800">Alex Johnson</h1>
            <p class="text-sm text-gray-600">Web Developer | UI/UX Designer</p>
            
            <h2 class="text-lg font-bold mt-6 text-blue-600">PROFILE</h2>
            <p class="text-sm text-gray-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.</p>
            
            <h2 class="text-lg font-bold mt-6 text-blue-600">EXPERIENCE</h2>
            <p class="font-semibold text-sm">Senior Web Developer - 2022 - Present</p>
            <p class="text-sm text-gray-600">Company Name | Location</p>
            
            <h2 class="text-lg font-bold mt-6 text-blue-600">EDUCATION</h2>
            <p class="text-sm text-gray-600">Bachelor of Science in Computer Science - 2018-2022</p>
            
            <h2 class="text-lg font-bold mt-6 text-blue-600">SKILLS</h2>
            <ul class="list-disc pl-5 text-sm text-gray-600">
              <li>React.js</li>
              <li>Node.js</li>
              <li>HTML, CSS, JavaScript</li>
              <li>UI/UX Design</li>
            </ul>
            
            <h2 class="text-lg font-bold mt-6 text-blue-600">CONTACT</h2>
            <p class="text-sm text-gray-600">📞 +000 111 222 3334</p>
            <p class="text-sm text-gray-600">📧 alex.johnson@example.com</p>
          </div>
        </div>
      `
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
  