import express from "express";
import mongoose from "mongoose";
import path from "path";
import multer from "multer";
import { User } from "./Models/User.js";
import { v2 as cloudinary } from "cloudinary";




    // Configuration
    cloudinary.config({ 
        cloud_name: 'dprt6hqyf', 
        api_key: '112376392369375', 
        api_secret: 'CpfxfJ8B775P-f15tFI5TmIYzHM' // Click 'View Credentials' below to copy your API secret
    });
    const app = express();
    const port = 8429;
 

    app.use(express.urlencoded({ extended: true }));
    
    const storage = multer.diskStorage({
      destination: "./public/uploads",
      filename: function (req, file, cb) {
        cb(
          null,
          file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
      },
    });
    
    const upload = multer({ storage: storage });
    
    // show register page
    app.get("/register", (req, res) => {
      res.render("register.ejs");
    });
    
    // create user
    app.post("/register", upload.single("file"), async (req, res) => {
      const file = req.file.path;
      const { name, email, password } = req.body;
    
      try {
        const cloudinaryRes = await cloudinary.uploader.upload(file, {
          folder: "NodeJs_Authentication_App",
        });
    
        let user = await User.create({
          profileImg: cloudinaryRes.secure_url,
          name,
          email,
          password,
        });
    
        res.redirect("/");
    
        console.log(cloudinaryRes, name, email, password);
      } catch (error) {
        res.send("Error Accure");
      }
    });
    
    // login User
    app.post("/login", async (req, res) => {
      const { email, password } = req.body;
      try {
        let user = await User.findOne({ email });
        console.log("getting user ", user);
        if (!user) res.render("login.ejs", { msg: "User not found" });
        else if (user.password != password) {
          res.render("login.ejs", { msg: "Invalid password" });
        } else {
          res.render("profile.ejs", { user });
        }
      } catch (error) {
        res.send("Error Accure");
      }
    });
    
    // all users
    app.get("/users", async (req, res) => {
      let users = await User.find().sort({createdAt:-1});
      res.render("users.ejs",{users})
    });
    
    // show login page
    app.get("/", (req, res) => {
      res.render("login.ejs");
    });
    

mongoose.connect("mongodb+srv://manishkp842:4Qp6F0oDHLZugRkG@shortner.jafa43c.mongodb.net",{
  "dbName":"AuthSystem"
}
).then(() => console.log("MongoDb Connected"))
.catch((error) => console.log(error));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});




