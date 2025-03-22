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
      "id": 6,
      "name": "Creative Two Column Resume",
      "layout": `
        <div class="flex justify-center bg-green-100 py-8">
          <div class="bg-white shadow-lg p-8 w-full max-w-[800px] flex flex-wrap">
            <div class="w-full lg:w-1/2 pr-4 mb-4 lg:mb-0">
              <h1 class="text-3xl font-semibold text-gray-800">Sophia Adams</h1>
              <p class="text-sm text-gray-600">UX/UI Designer</p>
              
              <h2 class="text-lg font-bold mt-6 text-green-600">PROFILE</h2>
              <p class="text-sm text-gray-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis orci eget dolor tincidunt, vitae fermentum erat convallis. Integer nec orci magna.</p>
              
              <h2 class="text-lg font-bold mt-6 text-green-600">EXPERIENCE</h2>
              <p class="font-semibold text-sm">Lead Designer - 2021-Present</p>
              <p class="text-sm text-gray-600">Company Name | Location</p>
            </div>
            <div class="w-full lg:w-1/2 pl-4">
              <h2 class="text-lg font-bold text-green-600">EDUCATION</h2>
              <p class="text-sm text-gray-600">Bachelor of Arts in Design - 2017-2021</p>
              
              <h2 class="text-lg font-bold mt-6 text-green-600">SKILLS</h2>
              <ul class="list-disc pl-5 text-sm text-gray-600">
                <li>Figma</li>
                <li>Wireframing</li>
                <li>UI/UX Prototyping</li>
              </ul>
              
              <h2 class="text-lg font-bold mt-6 text-green-600">CONTACT</h2>
              <p class="text-sm text-gray-600">📞 +000 333 444 5556</p>
              <p class="text-sm text-gray-600">📧 sophia.adams@example.com</p>
            </div>
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
  