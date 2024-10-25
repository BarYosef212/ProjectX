const Branch = require("../models/Branch");

exports.AddBranch = async (
  branchName,
  bussinessHours,
  branchAddress,
  branchPhone,
  coordinate_x,
  coordinate_y
) => {
  const branch = new Branch({
    branchName,
    bussinessHours,
    branchAddress,
    branchPhone,
    location: {
      coordinate_x,
      coordinate_y,
    },
  });
  if (branch) {
    await branch.save();
    console.log("Branch added");
    return branch;
  } else {
    return null;
  }
};

exports.deleteBranch = async (id) => {
  const result = await Branch.deleteOne({ _id: id });
  console.log(result);
  if (result.deletedCount === 1) {
    console.log("Branch deleted");
    return result.deletedCount;
  } else {
    return null;
  }
};

exports.updateBranch = async (updatedData, branchId) => {
  const branch = await Branch.findById(branchId);
  if (updatedData.location) {
    if (
      updatedData.location.coordinate_x &&
      !updatedData.location.coordinate_y
    ) {
      updatedData.location.coordinate_y = branch.location.coordinate_y;
    } else if (
      updatedData.location.coordinate_y &&
      !updatedData.location.coordinate_x
    ) {
      console.log("2");

      updatedData.location.coordinate_x = branch.location.coordinate_x;
    }
  }
  const updatedBranch = await Branch.findByIdAndUpdate(branchId, updatedData, {
    new: true,
  });

  if (updatedBranch) return updatedBranch;
  else return null;
};

// Fetch all branches
exports.getAllBranches = async () => {
  const branches = await Branch.find().sort({ _id: -1 });

  if (branches) {
    return branches;
  } else {
    return null;
  }
};

// Fetch branches by name (case-insensitive search)
exports.findBranches = async (name) => {
  const branches = await Branch.find({
    branchName: { $regex: name, $options: "i" },
  });
  if (branches) {
    return branches;
  } else {
    return null;
  }
};
