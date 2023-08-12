import Template from "../models/template";
const request = require("request");
const cheerio = require("cheerio");
const cron = require("node-cron");

cron.schedule("0 */2 * * *", async () => {
  let Usage_detail = "";
  try {
    const template = await Template.find();
    for (let i = 0; i < template.length; i++) {
      const url1 = `https://www.capcut.com/watch/${template[i].Template_ID}`;
      request(url1, async function (error, response, html) {
        if (!error && response.statusCode == 200) {
          const $ = cheerio.load(html);
          var usage_detail = $(".video-detail .actions-detail").text();
          // Split the string by comma and trim the parts
          var parts = usage_detail.split(",");
          // Extract uses and likes
          var uses = parts[1].trim();
          var likes = parts[2].trim();
          Usage_detail = uses + ", " + likes + ",";
          const templates = await Template.findByIdAndUpdate(
            template[i]._id,
            { Usage_detail: Usage_detail },
            {
              new: true,
            }
          );
          console.log("Ok");
        } else {
          console.log("Error");
        }
      });
    }
  } catch (error) {
    console.log("Error");
  }
});
let Template_Name = "";
let Usage_detail = "";
let Creater_name = "";
let Creater_desc = "";
let Tags = "";
let Clips = "";
export const Fetch = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.json({
        error: "Please Add ID",
        status: false,
      });
    }
    let Template_ID = id;
    const url2 = `https://www.capcut.com/template-detail/${id}`;
    request(url2, function (error, response, html) {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        Template_Name = $(".video-detail .template-title").text();
        Tags = $(".video-detail .desc-detail").text();
        var usage_detail = $(".video-detail .actions-detail").text();
        // Split the string by comma and trim the parts
        var parts = usage_detail.split(",");
        // Extract uses and likes
        var uses = parts[1].trim();
        var likes = parts[2].trim();
        Usage_detail = uses + ", " + likes + ",";
        Creater_name = $(".video-detail .author-name").text();
        Creater_desc = $(".video-detail .author-desc").text();
        var numberOfClips = $(
          ".video-detail .detail-extra > div:nth-child(1)"
        ).text();
        Clips = numberOfClips.match(/\d+/)[0];
        return res.json({
          Template_Name,
          Template_ID,
          Usage_detail,
          Creater_desc,
          Creater_name,
          Tags,
          Clips,
          status: true,
        });
      } else {
        return res.json({
          error: error,
          status: false,
        });
      }
    });
  } catch (error) {
    return res.json({
      error: "Fetch Template Failed",
      status: false,
    });
  }
};
export const create = async (req, res) => {
  try {
    const { values } = req.body;
    const temp = await Template.findOne({ Template_ID: values.Template_ID });
    if (temp) {
      return res.json({
        error: "Template Already Exist",
        status: false,
      });
    }
    if (!values.Template_Name) {
      return res.json({
        error: "Please Add Template Name",
        status: false,
      });
    }
    if (!values.Creater_name) {
      return res.json({
        error: "Please Add Creater Name",
        status: false,
      });
    }
    if (!values.Usage_detail) {
      return res.json({
        error: "Please Add Usage Detail",
        status: false,
      });
    }
    if (!values.Template_ID) {
      return res.json({
        error: "Please Add Template Id",
        status: false,
      });
    }
    if (!values.video_link) {
      return res.json({
        error: "Please Add Video Link",
        status: false,
      });
    }
    if (!values.Clips) {
      return res.json({
        error: "Please Add Clips",
        status: false,
      });
    }
    if (!values.poster_link) {
      return res.json({
        error: "Please Add Poster Link",
        status: false,
      });
    }
    if (!values.Tags) {
      return res.json({
        error: "Please Add Tags",
        status: false,
      });
    }

    const template = await new Template(values).save();
    return res.json({ template, status: true });
  } catch (error) {
    return res.json({
      error: "Template Create Failed",
      status: false,
    });
  }
};
export const update = async (req, res) => {
  try {
    const { values } = req.body;
    const templates = await Template.findByIdAndUpdate(req.params._id, values, {
      new: true,
    });
    return res.json({
      templates,
      status: true,
    });
  } catch (error) {
    return res.json({
      error: "Template update Failed",
      status: false,
    });
  }
};
export const deletetemplate = async (req, res) => {
  try {
    await Template.findOneAndDelete({ _id: req.params._id });
    return res.json({
      status: true,
    });
  } catch (error) {
    return res.json({
      error: "Delete Failed",
      status: false,
    });
  }
};

export const AllTemplates = async (req, res) => {
  try {
    const templates = await Template.find()
      .sort({ createdAt: -1 })
      .populate("category", "_id name");
    return res.json({
      templates,
      status: true,
    });
  } catch (error) {
    res.json({
      error: "Fetch Templates Failed",
      status: false,
    });
  }
};
export const SingleTemplate = async (req, res) => {
  try {
    const template = await Template.findOne({ _id: req.params._id }).populate(
      "category",
      "_id name"
    );
    if (template) {
      return res.json({ template, status: true });
    } else {
      return res.json({
        error: "Not Found",
        status: false,
      });
    }
  } catch (error) {
    res.json({
      error: "Fetch Single template Failed",
      status: false,
    });
  }
};
