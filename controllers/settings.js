import Settings from "../models/settings";
export const createandupdate=async(req,res)=>{
 try{
      const {values}=req.body;
      const settings=await Settings.findByIdAndUpdate(req.params._id,values,{
        new:true,
      })
     return res.json({
        settings,
        status:true

     });
 }
 catch(error){
   return res.json({
    error:"Create and update Failed",
    status:false
   });
 }
}
export const SiteSettings = async (req, res) => {
    try {
      const getSetting = await Settings.find();
      const setting=getSetting[0];
      return res.json({
       setting,
       status:true
      });
    } catch (error) {
      res.json({
        error: "Get Settings Error",
        status:false
      });
    }
  };
  export const main = async (req, res) => {
    try {
      return res.json("Welcome to Capcut Template");
    } catch (error) {
      res.json({
        error: "Get Settings Error",
        status:false
      });
    }
  };