const userService = require("../services/user");
const User = require("../models/user");
const errorMessage = "An error occured, please try again later";
const { google } = require("googleapis");

// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "http://localhost:3035/auth/google/callback" // Make sure this matches Google Cloud Console
);

const googleLoginUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["profile", "email"],
  prompt: "select_account",
});

// Function to handle Google login initiation
exports.initiateGoogleLogin = (req, res) => {
  res.redirect(googleLoginUrl);
};

exports.loginViaGoogle = async (req, res) => {
  try {

    if(req.query.error){
      res.redirect("/login")
      return;
    }
    const { tokens } = await oauth2Client.getToken(req.query.code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    const { email, given_name, family_name, id } = userInfo.data;

    //check if the user already exist
    const user = await User.findOne({ email: email });

    if (!user) {
      await userService.register(
        given_name,
        family_name,
        email,
        "0",
        false,
        id
      );
    }
    const userGoogle = await User.findOne({email:email})
    if (userGoogle) {
      req.session.userId = userGoogle._id;
      req.session.fullName = `${userGoogle.firstName} ${userGoogle.lastName}`;
      req.session.admin = userGoogle.admin;
      res.redirect("/")
    } 
  } catch (error) {
    console.error("Error during Google login:", error);
    res.redirect("/error"); // Redirect to an error page if there’s an issue
  }
};

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, passwordCompare, marketing } =
      req.body;
    const userEmail = await User.findOne({ email: email });
    if (userEmail) {
      res.status(409).json({
        message: "User with this email already registered",
      });
    } else {
      const googleId = "0";
      await userService.register(
        firstName,
        lastName,
        email,
        password,
        marketing,
        googleId
      );
      const user = await userService.login(email, password);
      req.session.userId = user._id;
      req.session.fullName = `${user.firstName} ${user.lastName}`;
      req.session.admin = user.admin;
      res.json({
        message: "User registered successfully",
      });
    }
  } catch (error) {
    console.log("Error in register: ", error);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userService.login(email, password);
    if (user) {
      req.session.userId = user._id;
      req.session.fullName = `${user.firstName} ${user.lastName}`;
      req.session.admin = user.admin;
      res.json({
        message: "Login successful",
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    console.log("errorLogin", error);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (userEmail === "") {
      const users = await userService.getAllUsers();
      res.json({
        user: users,
        array: true,
      });
    } else {
      const user = await userService.findUser(userEmail);
      if (user) {
        res.json({
          user: user,
          array: false,
        });
      } else {
        res.status(404).json({
          message: "User not found",
        });
      }
    }
  } catch (error) {
    console.log("Error in findUser: ", error.message);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (users.length > 0) {
      res.json({
        users: users,
      });
    } else {
      return res.status(404).json({
        message: "No users found",
      });
    }
  } catch (error) {
    console.log("Error in getAllUsers: ", error);
    res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userEmail } = req.body;
    const deleteCount = await userService.deleteUser(userEmail);

    if (deleteCount === 1) {
      res.json({
        message: "User deleted successfully",
      });
    } else if (deleteCount === 0) {
      res.status(403).json({
        message: "1 Admin left, cannot delete last admin",
      });
    } else {
      return res.status(404).json({
        message: "User not found or already deleted.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: errorMessage,
    });
  }
};

exports.logOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session: ", err);
      return res.redirect("/");
    }
    res.redirect("/login");
  });
};

exports.updateUser = async (req, res) => {
  const { email, updatedData } = req.body;
  if (updatedData.email) {
    const userToCheck = await User.findOne({ email: updatedData.email });
    if (userToCheck) {
      return res.status(409).json({
        message: "User with this email already exist",
      });
    }
  }

  if (updatedData.admin === false) {
    const adminsCount = await userService.countAdmins();
    if (adminsCount === 1) {
      return res.status(403).json({
        message: "1 Admin left, cannot change role",
      });
    }
  }

  const user = await userService.updateUser(email, updatedData);

  if (user) {
    let fullName = "";
    if (user._id.toString() === req.session.userId) {
      req.session.fullName = `${user.firstName} ${user.lastName}`;
      req.session.admin = user.admin;
      fullName = `${user.firstName} ${user.lastName}`;
    }
    return res.json({
      message: "User updated successfully",
      user: user,
      fullName: fullName,
    });
  } else {
    return res.status(403).json({
      message: errorMessage,
    });
  }
};

exports.getMarketingData = async (req, res) => {
  const data = await User.aggregate([
    {
      $group: {
        _id: "$marketing",
        count: { $sum: 1 },
      },
    },
  ]);

  const result = data.map((item) => ({
    marketing: item._id,
    count: item.count,
  }));

  if (result) {
    return res.json({
      result: result,
    });
  } else {
    return res.status(500).json({
      message: errorMessage,
    });
  }
};
