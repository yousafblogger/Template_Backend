import Category from "../models/category";
import Template from "../models/template"
import slugify from "slugify";
export const create = async (req, res) => {
  try {
    const { values } = req.body;
    if (!values.name) return res.json({ error: "Please Add Name",status:false });
    if (!values.sequence) return res.json({ error: "Please Add sequence",status:false });
    const slug = slugify(values.name);
    const category = await Category.findOne({ slug });
    if (category) return res.json({ error: "Category Already Exist",status:false });
    values.slug = slug;
    const categories = await new Category(values).save();
    return res.json({ categories, status: true });
  } catch (error) {
    return res.json({
      error: "Category Create Failed",
      status:false
    });
  }
};
export const update = async (req, res) => {
  try {
    const { values } = req.body;
    const slug = slugify(values.name);
    values.slug = slug;
    const category = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      values,
      {
        new: true,
      }
    );
    return res.json({
      status: true,
    });
  } catch (error) {
    res.json({
      error: "Update Category Failed",
      status:false
    });
  }
};
export const deletecategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete({ _id: req.params.id });
    return res.json({
      status: true,
    });
  } catch (error) {
    return res.json({
      error: "Delete Failed",
      status:false
    });
  }
};
export const AllCategories = async (req, res) => {
  try {
    
    const category = await Category.find().sort({ createdAt: -1 });
    const TotalSize= await Category.countDocuments();
    for (let i = 0; i < category.length; i++) {
      const templateCount = await Template.countDocuments({ category: category[i]._id });
      category[i].Template_Count = templateCount;
    }
    return res.json({
      category,
      TotalSize,
      status: true,
    });
    
  } catch (error) {
    res.json({
      error: "Fetch Category Failed",
      status:false
    });
  }
};
export const SingleCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (category) {
      return res.json({ category, status: true });
    } else {
      return res.json({
        error: "Not Found",
        status:false
      });
    }
  } catch (error) {
    res.json({
      error: "Create Category Failed",
      status:false
    });
  }
};
