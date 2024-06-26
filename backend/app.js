const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./database/db.js');
const User = require('./models/Users.js');
const Referral = require('./models/Referrals.js');
const Problem = require('./models/Problems.js')
const Topic = require('./models/Topics.js')

dotenv.config({
    path: './.env'
});

const app = express();
const port = 2999;

// Connect to the database
connectDB();

const corsOptions = {
    origin: 'http://localhost:5173', 
    credentials: true, 
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('tiny'));

app.get("/", (req, res) => {
    res.send("Welcome");
});

// Regex patterns for validation
const usernameRegex = /^[a-zA-Z0-9]{3,30}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum eight characters, at least one letter and one number

app.post("/register/:referralCode?", async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
    const { referralCode } = req.params;

    try {
        if (!(username && password && email && firstName && lastName)) {
            return res.status(400).send("Please fill all the fields");
        }
        if (!usernameRegex.test(username)) {
            return res.status(400).send("Invalid username. Must be 3-30 characters long, containing only letters and numbers.");
        }

        if (!emailRegex.test(email)) {
            return res.status(400).send("Invalid email format.");
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).send("Password must be at least 8 characters long and contain at least one letter and one number.");
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).send("Username or email already exists.");
        }

        let referralBy = null;
        let coins = 0;

        if (referralCode) {
            // Check if the referral code is valid
            const existingReferral = await Referral.findOne({ referralCode });

            if (!existingReferral) {
                return res.status(400).send("Invalid referral code");
            }

            // If valid, set the referralBy to the referrer's userId
            referralBy = existingReferral.userId;

            // Increment the referral count for the referrer
            existingReferral.referralCount += 1;
            await existingReferral.save();

            // Award 30 coins for successful referral
            coins = 30;

            // Increment coins for the referrer
            const referrer = await User.findById(existingReferral.userId);
            if (referrer) {
                referrer.coins += coins;
                await referrer.save();
            }
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = new User({
            username,
            password: hashedPassword,
            email,
            firstName,
            lastName,
            coins,
            joined: new Date(),
            lastUpdate: new Date()
        });

        await user.save();

        // Create a referral for the new user
        const newReferral = new Referral({
            userId: user._id,
            referralCode: generateReferralCode(),
            referralBy,
            referralCount: 0
        });

        await newReferral.save();

        // Generate JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store the token in a cookie
        res.cookie('token', token, { httpOnly: true });

        res.status(201).json({ token: token, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

// Generate a unique referral code (simple implementation)
function generateReferralCode() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!(username && password)) {
            return res.status(400).send("Please fill all the fields");
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send("Invalid username or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid username or password");
        }

        // Generate JWT token for the user
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store the token in a cookie
        res.cookie('token', token, { httpOnly: true });

        res.status(201).json({ token: token, message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

// Check if username exists
app.post('/check-username', async (req, res) => {
    const { username } = req.body;
    try {
      const user = await User.findOne({ username });
      res.json({ exists: !!user });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while checking the username' });
    }
  });
  
  // Check if email exists
  app.post('/check-email', async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      res.json({ exists: !!user });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while checking the email' });
    }
  });

// Middleware to authenticate user using JWT
function authenticateToken(req, res, next) {
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        console.log("Access denied. No token provided.");
        return res.status(401).send("Access denied. No token provided.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Invalid token", error);
        res.status(400).send("Invalid token");
    }
}

// Update profile endpoint
app.post("/updateprofile", authenticateToken, async (req, res) => {
    const { username, firstName, lastName } = req.body;
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (firstName) {
            user.firstName = firstName;
        }
        if (lastName) {
            user.lastName = lastName;
        }

        if (username) {
            if (!usernameRegex.test(username)) {
                return res.status(400).send("Invalid username format.");
            }

            // Check if username already exists
            const existingUser = await User.findOne({ username });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(400).send("Username already in use.");
            }

            user.username = username;
        }

        user.lastUpdate = new Date();
        await user.save();

        // Generate a new JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Clear the existing token and send the new token in the response
        res.clearCookie('token');
        res.cookie('token', token, { httpOnly: true });

        res.status(200).send({ message: "Profile updated successfully", token: token });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});


// Change password endpoint
app.post("/changepassword", authenticateToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    try {
        if (!(currentPassword && newPassword)) {
            return res.status(400).send("Please fill all the fields");
        }

        if (!passwordRegex.test(newPassword)) {
            return res.status(400).send("Password must be at least 8 characters long and contain at least one letter and one number.");
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send("User not found");
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).send("Current password is incorrect");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.lastUpdate = new Date();

        await user.save();

        // Generate a new JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Store the new token in a cookie
        res.cookie('token', token, { httpOnly: true });

        res.status(200).send("Password changed successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

app.get("/userdetails", authenticateToken, async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).send("User not found");
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});
// Delete profile endpoint
app.delete("/deleteprofile", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { password } = req.body;
  
    try {
      if (!password) {
        return res.status(400).send("Please provide your password for verification");
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send("Password verification failed. Please provide the correct password.");
      }
  
      // Delete the user from the database
      await User.findByIdAndDelete(userId);
  
      // Clear the token
      res.clearCookie('token');
  
      res.status(200).send("Profile deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred");
    }
  });


app.post('/add', async (req, res) => {
    try {
      const { title, problem_statement, input_description, output_description, sample_cases, constraints, hints, topics, locked_test_cases, admin_solution } = req.body;
  
      // Process topics
      const topicIds = await Promise.all(topics.map(async (topicName) => {
        let topic = await Topic.findOne({ topic: topicName });
        if (!topic) {
          topic = new Topic({ topic: topicName, description: `Description for ${topicName}`, created_at: new Date(), updated_at: new Date() });
          await topic.save();
        }
        return topic._id;
      }));
  
      const newProblem = new Problem({
        title,
        problem_statement,
        input_description,
        output_description,
        sample_cases,
        constraints,
        hints,
        topics: topicIds,
        locked_test_cases,
        admin_solution,
        created_at: new Date(),
        updated_at: new Date()
      });
  
      const savedProblem = await newProblem.save();
      res.status(201).json(savedProblem);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
