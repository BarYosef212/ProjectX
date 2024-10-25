const Branch = require('../models/Branch');
const branchServices = require('../services/branch')

exports.AddBranch = async (req, res) => {
  try {
    const {Store_Name, Buissnes_hour, Store_adress, Store_Phone_number,coordinate_x,coordinate_y} = req.body;
    await branchServices.AddBranch(
      Store_Name,
      Buissnes_hour,
      Store_adress,
      Store_Phone_number,
      coordinate_x,
      coordinate_y,
    );
    res.redirect("/");

  } catch (error) {
    console.log("error");
    res.render("AddBranch", { error: error.message });
  }
};


exports.deleteBranch = async (req, res) => {
  try {
    const {Store_Name} = req.body
    // console.log(branch)
    await branchServices.deleteBranch(Store_Name)
    res.redirect("/");

  } catch (error) {
    console.log("Thee",error);
    res.render("DeleteBranch", {error: error.message});
  }
};


exports.updateBranch = async (req, res) => {
  try {
      const { Store_Name, Store_adress, Store_Phone_number, Buissnes_hour } = req.body;
      const updates = {};

      // Check which fields are provided and create an updates object
      if (Store_adress) updates.Store_adress = Store_adress;
      if (Store_Phone_number) updates.Store_Phone_number = Store_Phone_number;
      if (Buissnes_hour) updates.Buissnes_hour = Buissnes_hour;

      // Find the branch by name and update it
      const branch = await Branch.findOneAndUpdate(
          { Store_Name },
          updates,
          { new: true, runValidators: true } // Return the updated document and validate
      );

      if (!branch) {
          throw new Error("Branch not found");
      }

      console.log("Updated branch:", branch);
      res.redirect("/"); // Redirect after successful update

  } catch (error) {
      console.error("Error updating branch:", error);
      res.render("UpdateBranch", { error: error.message });
  }
};

exports.getBranchList = async (req, res) => {
  try {
    const searchQuery = req.query.name || ''; // Get the search query from the request

    let branches;
    if (searchQuery) {
      // If there's a search query, filter by branch name (case-insensitive)
      branches = await branchServices.getBranchesByName(searchQuery);
    } else {
      // Otherwise, retrieve all branches
      branches = await branchServices.getAllBranches();
    }
// If no branches found, set error message
if (!branches || branches.length === 0) {
  return res.render('BranchList', { branches: [], error: "No branches found." });
}
    res.render('BranchList', { branches }); // Render the BranchList.ejs page with the branches data
  } catch (error) {
    console.error("Error fetching branches:", error.message);
    res.render('BranchList', { branches: [], error: error.message });
  }
};






