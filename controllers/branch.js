const Branch = require("../models/Branch");
const branchServices = require("../services/branch");
const errorMessage = "An error occured, please try again later";

exports.addBranch = async (req, res) => {
  try {
    const {
      branchName,
      branchHours,
      branchPhone,
      brachAddress,
      coordinate_x,
      coordinate_y,
    } = req.body;
    
    // Check if branch with the same name exists
    let branchValid = await Branch.findOne({ branchName: branchName });
    if (branchValid) {
      return res
        .status(403)
        .json({ message: "Branch with this name already exists" });
    }

    // Check if branch with the same coordinates exists
    branchValid = await Branch.findOne({
      "location.coordinate_x": coordinate_x,
      "location.coordinate_y": coordinate_y,
    });
    if (branchValid) {
      return res
        .status(403)
        .json({ message: "Branch with these coordinates already exists" });
    }

    // Add new branch
    const branch = await branchServices.AddBranch(
      branchName,
      branchHours,
      branchPhone,
      brachAddress,
      coordinate_x,
      coordinate_y,
    );

    if (branch) {
      return res.json({ branch, message: "Branch added successfully" });
    } else {
      return res.status(403).json({ message: "Couldn't add branch" });
    }
  } catch (error) {
    console.error("Error in addBranch():", error);
    return res.status(500).json({ message: errorMessage });
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const { branchId } = req.body;

    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const result = await branchServices.deleteBranch(branchId);

    if (result === 1) {
      return res.json({ message: "Branch deleted successfully" });
    } else {
      return res.status(500).json({ message: errorMessage });
    }
  } catch (error) {
    console.error("Error in deleteBranch():", error);
    return res.status(500).json({ message: errorMessage });
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const {updatedData, branchId} = req.body;
    const result = await branchServices.updateBranch(updatedData, branchId)
    if(result){
      res.json({
        message:"Branch updated successfully",
        branch:result,
      })
    }
    else{
      res.status(403).json({
        message:errorMessage
      })
    }
  }
  catch(error){
    res.status(403).json({
      message:errorMessage
    })
  }
};

exports.getAllBranches = async (req, res) => {
  try {
    const branches = await branchServices.getAllBranches();
    if (branches.length > 0) {
      res.json({
        branches: branches,
      });
    } else {
      res.status(404).json({
        message: "Branches not found",
      });
    }
  } catch (error) {
    console.error("Error in getAllBranches", error);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.findBranches = async (req, res) => {
  try {
    const { search } = req.body;
    const branches = await branchServices.findBranches(search);
    if (branches.length > 0) {
      res.json({
        message: `${branches.length} Branches found`,
        branches: branches,
      });
    } else {
      res.status(404).json({
        message: "No branches found",
      });
    }
  } catch (error) {
    console.log("Error in findBranch(): ", error);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

