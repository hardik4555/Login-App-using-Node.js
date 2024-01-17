//This will server as API:
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

mongoose.connect("mongodb://localhost:27017/", {

});

const Schema = mongoose.Schema;
const saltRounds = 10;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profileImage: {
    type: String 
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'], 
    default: 'user' 
  }
});

const User = mongoose.model("User", userSchema);

app.post('/post', async (req, res) => {
  const { email, phoneNumber, name, profileImage, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newData = {
    email: email,
    phoneNumber: phoneNumber,
    name: name,
    profileImage: profileImage,
    password: hashedPassword,
    role: role

  }
  const createdPost = await User.create(newData);
  res.status(200).json(createdPost);
})

app.post('/login', async (req, res) => {
  try {
    const { emailPhone, password, role } = req.body;
    console.log(emailPhone, password, role);
    const user = await User.findOne({ email: emailPhone, role: role });
    if (user) {

      const payLoad={
        email: user.email,
        phoneNumber: user.phoneNumber,
        name: user.name,
        profileImage: user.profileImage,
        password: user.password,
        role: user.role


      }
      const secretKey="yourSecretKey";
      const passwordMatch =bcrypt.compare(password, user.password);
      if (passwordMatch) {

        console.log(secretKey);
        const token= jwt.sign({payLoad}, secretKey);
        console.log("token",token);
        res.status(200).json({ message: "Login successful", user: user , token: token});
      }
      else {
        res.status(401).json({ message: 'invalid credentials' });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }


})

app.delete('/delete', async (req, res) => {

  try {
    const { emailPhone } = req.body;
    const deletedUser = await User.findOneAndDelete({ email: emailPhone });
    if (deletedUser) {
      res.status(200).json({ message: "User deleted Succesfully", user: deletedUser });

    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }


})

app.put('/update', async (req, res) => {
  const { emailPhone, name, password, profileImage } = req.body;

  try {
    const user = await User.findOne({ email: emailPhone });

    if (!user) {
      return res.status(404).json({ message: 'User not found' , user: user});
    }
    const hashedPassword=await bcrypt.hash(password,saltRounds);
    user.name = name || user.name;
    user.password = hashedPassword || user.password;
    user.profileImage = profileImage || user.profileImage;
    
    const updatedUser = await user.save();

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error during update:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/deleteAll', async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.error('Error deleting all users:', error);
    res.status(500).json({ message: 'Not able to delete' });
  }
});

function authenticateToken(req,res,next)
{
  const token=req.cookies.token;
  if(!token) return res.sendStatus(401);
  jwt.verify(token, 'yourSecretKey', (err,user)=>
  {
    if(err) return res.sendStatus(403);
    req.user=user;
    next();
  })
}

//when a user logs in and is authenticated then the server send a token to the browser as a cookie.

