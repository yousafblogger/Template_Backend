import Template from "../models/template";
const request = require("request");
const cheerio = require("cheerio");
const cron = require("node-cron");
import csv from "node-xlsx";
cron.schedule("0 */2 * * *", async () => {
  let Usage_detail = "";
  try {
    const template = await Template.find();
    for (let i = 0; i < template.length; i++) {
      const url1 = `https://www.capcut.com/template-detail/${template[i].Template_ID}`;
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
          console.log("Ok", "------", template[i].Template_ID);
        } else {
          console.log(" Temp Error", "------", template[i].Template_ID);
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
        if (!usage_detail) {
          return res.json({
            error: "Template Fetch Failed",
            status: false,
          });
        }
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
          error: "Template Fetch Failed",
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
export const DeleteAllTemplate = async (req, res) => {
  try {
    const { ids } = req.body;
    for (let i = 0; i < ids.length; i++) {
      await Template.findOneAndDelete({ _id: ids[i] });
    }
    return res.json({
      message: "Successfully Deleted",
      status: true,
    });
  } catch (error) {
    return res.json({
      error: "Delete Failed",
      message: "Delete Failed",
      status: false,
    });
  }
};
export const UpdateTrendingTemplate = async (req, res) => {
  try {
    const { ids, reset } = req.body;
    if (reset) {
      for (let i = 0; i < ids.length; i++) {
        await Template.findOneAndUpdate(
          { _id: ids[i] },
          {
            sequence: "",
          },
          { new: true }
        );
      }
    } else {
      for (let i = 0; i < ids.length; i++) {
        await Template.findOneAndUpdate(
          { _id: ids[i] },
          {
            sequence: 0,
          },
          { new: true }
        );
      }
    }

    return res.json({
      message: "Trending Templates Updated",
      status: true,
    });
  } catch (error) {
    return res.json({
      error: "Trending Templates Update Failed",
      message: "Trending Templates Update Failed",
      status: false,
    });
  }
};
export const AllTemplates = async (req, res) => {
  const { offset, limit } = req.query;
  try {
    const totalsize = await Template.countDocuments();
    const currentpage = offset;
    const perpageLimit = limit;
    const template = await Template.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order and sequence in ascending order
      .populate("category", "_id name");
    const templatesWithSequenceZero = [];
    const templatesWithoutSequenceZero = [];
    template.forEach((template) => {
      if (template.sequence === 0) {
        templatesWithSequenceZero.push(template);
      } else {
        templatesWithoutSequenceZero.push(template);
      }
    });
    // Concatenate the two arrays to get the desired order
    const Alltemplates = templatesWithSequenceZero.concat(
      templatesWithoutSequenceZero
    );
    // Calculate the starting and ending indexes for the current page
    const startIndex = ((currentpage - 1 )* perpageLimit);
    const endIndex =Math.round(startIndex)+Math.round(limit);
    console.log(startIndex,"_____",endIndex)
    // Use slice to extract the templates for the current page
    const templates =offset?Alltemplates.slice(startIndex, endIndex):Alltemplates;
    return res.json({
      totalsize,
      templates,
      offset,
      limit,
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
export const CategoryTemplate = async (req, res) => {
  try {
    const template = await Template.find({ category: req.params.id })
      .populate("category", "_id name")
      .sort({ createdAt: -1 });
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
      error: "Fetch Category template Failed",
      status: false,
    });
  }
};
export const SequenceTemplate = async (req, res) => {
  try {
    const template = await Template.find({ sequence: 0 })
      .populate("category", "_id name")
      .sort({ createdAt: -1 });
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
      error: "Fetch Sequence template Failed",
      status: false,
    });
  }
};
export const BulkTemplate = async (req, res) => {
  try {
    const { file } = req.files;
    // Check File
    if (!file) {
      return res.json({ error: "No file uploaded", status: false });
    }
    // Check File Type
    if (file.type !== "text/csv" && file.type !== "application/vnd.ms-excel") {
      return res.json({ error: "Please Upload CSV File Only", status: false });
    }
    // Parse CSV FILE
    const fileData = csv.parse(file.path, {
      header: true,
    });
    //Check FIle header
    const sheetData = fileData[0].data;
    const headerRow = sheetData[0];
    const requiredColumns = ["Template_ID", "poster_link", "video_link"];
    function doesHeaderContainValues(headerRow, targetValues) {
      const headerKeys = Object.keys(headerRow);
      return targetValues.every((value) => headerKeys.includes(value));
    }
    const headerContainsRequiredColumns = doesHeaderContainValues(
      headerRow,
      requiredColumns
    );
    if (!headerContainsRequiredColumns) {
      return res.json({
        error:
          "Please Check Your Column Header. It should be like this: Template_ID,category,video_link ,poster_link",
        status: false,
      });
    }
    // Function to validate a row
    function validateRow(row) {
      return (
        row.hasOwnProperty("Template_ID") &&
        row.hasOwnProperty("poster_link") &&
        row.hasOwnProperty("video_link")
      );
    }

    // Iterate through each row and validate
    for (let i = 0; i < sheetData.length; i++) {
      const row = sheetData[i];
      const isValid = validateRow(row);

      if (!isValid) {
        return res.json({
          error: "Bulk Upload template Failed.Please Fill Data in every Row",
          status: false,
        });
      }
    }
    let Template_ID = "";
    let Template_Name = "";
    let Usage_detail = "";
    let Creater_name = "";
    let Creater_desc = "";
    let Tags = "";
    let Clips = "";
    let poster_link = "";
    let video_link = "";
    let category = "";
    // Now check template exist if not then save in DB
    for (let i = 0; i < sheetData.length; i++) {
      const temp = await Template.findOne({
        Template_ID: sheetData[i].Template_ID,
      });
      if (temp) {
        console.log("Template Already Exist:", temp.Template_ID);
      } else {
        const url = `https://www.capcut.com/template-detail/${sheetData[i].Template_ID}`;
        request(url, async function (error, response, html) {
          if (!error && response.statusCode == 200) {
            const $ = cheerio.load(html);
            var usage_detail = $(".video-detail .actions-detail").text();
            if (!usage_detail) {
              console.log("Fetch Template Failed", sheetData[i].Template_ID);
            } else {
              Template_ID = sheetData[i].Template_ID;
              category = sheetData[i].category;
              poster_link = sheetData[i].poster_link;
              video_link = sheetData[i].video_link;
              Template_Name = $(".video-detail .template-title").text();
              Tags = $(".video-detail .desc-detail").text();
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
              //Save Data in Database
              let values = {
                Template_ID: Template_ID,
                Template_Name: Template_Name,
                Usage_detail: Usage_detail,
                Creater_name: Creater_name,
                Creater_desc: Creater_desc,
                Tags: Tags,
                Clips: Clips,
                poster_link: poster_link,
                video_link: video_link,
                category: category,
              };
              if (
                Template_ID &&
                Template_Name &&
                Usage_detail &&
                Creater_name &&
                Tags &&
                Clips &&
                poster_link &&
                video_link
              ) {
                const template = await new Template(values).save();
              }
            }
          }
        });
      }
    }
    //Send response
    return res.json({
      message: "Templates Added Successfully",
      status: true,
    });
  } catch (error) {
    res.json({
      error: "Bulk Upload template Failed",
      status: false,
    });
  }
};
