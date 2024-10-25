const Branch = require('../models/Branch');

//register function that saves the new branch to the db
async function AddBranch(Store_Name, Buissnes_hour, Store_adress, Store_Phone_number,coordinate_x,coordinate_y){
    console.log("addBranch function")
    const store_name = await Branch.findOne({Store_Name:Store_Name});
    console.log("log:",store_name)
    const store_adress = await Branch.findOne({Store_adress:Store_adress})
    console.log(Store_Name,Buissnes_hour,Store_adress,Store_Phone_number)
    if(store_name){
      throw new Error("Branch with this name already registered")
    }  
  
    if(store_adress){
      throw new Error("Branch with this address already registered");
    }
  
    if (!(/^\d+$/.test(Store_Phone_number))){
      throw new Error(`Phone number must contain digits only`)
    }
    const branch = new Branch({
      Store_Name,
      Buissnes_hour,
      Store_adress,
      Store_Phone_number,
      location: {
        coordinate_x, 
        coordinate_y  
      }
    });
    console.log("new object branch: ", branch)
    await branch.save()
    console.log("Branch added")
  }

  async function deleteBranch(Store_Name){
    console.log("deleteBranch function", Store_Name)
    const branch = await Branch.findOne({Store_Name});
    console.log("log:",branch)
    
    if(!branch){
      throw new Error("Branch with this name does not Exist")
    }  
    console.log("delete object branch: ", branch)
    await branch.deleteOne()
    console.log("Branch delete")
  }

  async function updateBranch(Store_Name){
    console.log("Update Branch function", Store_Name)
    const branch = await Branch.findOne({Store_Name});
    console.log("log:",branch)
    
    if(!branch){
      throw new Error("Branch with this name does not Exist")
    }  
    console.log("delete object branch: ", branch)
    await branch.deleteOne()
    console.log("Branch delete")
  }


// Fetch all branches
async function getAllBranches() {
    return await Branch.find();
}

// Fetch branches by name (case-insensitive search)
async function getBranchesByName(name) {
    return await Branch.find({ Store_Name: { $regex: name, $options: 'i' } });
}
module.exports = { AddBranch, deleteBranch,updateBranch,getAllBranches, getBranchesByName};
