import db from "../db.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

const register = async (req, res) => {
  try {
    const { username, email, password, contact } = req.body;
    const profile_image = req.file? `/uploads/${req.file.filename}` : null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }
    if(!emailRegex.test(email)){
      return res.status(400).json({
          message:"Invalid email format"
      });
    }
    const [existingUserName] = await db.query("select * from users where username = ?",[username]);
    if (existingUserName.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }
    const [existingUserEmail] = await db.query("select * from users where email = ?",[email]);
    if (existingUserEmail.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql ="insert into users (username, email, password, contact, profile_image) values(?,?,?,?,?)";
    const [result] = await db.query(sql, [username, email, hashedPassword, contact || null, profile_image]);
    generateToken(result.insertId, res);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({message: "Server Error"})
  }
};

const login = async (req,res) => {  
  try {
    const {username, password} = req.body;
    const [users] = await db.query("select * from users where username = ? or email = ?", [username, username]);
    if(users.length === 0){
      return res.status(400).json({message: "User not found"})
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
      return res.status(400).json({message: "Invalid password"})
    }
    generateToken(user.id, res);
    res.status(200).json({message: "Login successful"})
  } catch (error) {
    console.log(error)
    res.status(500).json({message: "server error"})
  }
};

const logout = async (req,res) => {
  try {
    res.cookie("token", "" , {
            httpOnly: true,
            secure: true,        
            sameSite: "None",    
            path: "/",
            expires: new Date(0)
        })
        res.status(200).json({message : "Logout Successfully"})
  } catch (error) {
    res.status(500).json({message: "server error"})
  }
}

const getCurrentUser = async (req,res) => {
  try {
    const user_id = req.user.id;
    const [users] = await db.query("select id,username,email,contact,profile_image from users where id = ?", [user_id]);
    if(users.length === 0){
      return res.status(404).json({message: "User not found"})
    }
    res.status(200).json(users[0]);
   } catch (error) {
    res.status(500).json({message: "server error"});
  }
};

const uploadProfileImage = async (req,res) => {
  try {
    const user_id = req.user.id;
    const profile_image = req.file? `/uploads/${req.file.filename}` : null;
    await db.query("update users set profile_image = ? where id = ?", [profile_image,user_id]);
    res.status(201).json({ message: "Profile Image updated successfully" });
  } catch (error) {
    res.status(500).json({message: "server error"});
  }
};

export { register,login,getCurrentUser,uploadProfileImage,logout };
