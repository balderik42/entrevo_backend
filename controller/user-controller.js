import User from '../model/user-schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const usersignup = async (request, response) => {
  try {
    const exist = await User.findOne({ email: request.body.email });
    if (exist) {
      console.log('User already exists:', request.body.email);
      return response.status(409).json({ message: 'E-mail already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(request.body.password, saltRounds);
    console.log('Hashed password created successfully');

    // Save user
    const user = { ...request.body, password: hashedPassword };
    const newUser = new User(user);
    await newUser.save();

    response.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user signup:', error.message); // Log error message
    response.status(500).json({ message: 'Server error', error: error.message });
  }
};


export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' }); // 401 Unauthorized
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' }); // 401 Unauthorized
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, 'yourSecretKey', { expiresIn: '1h' });

    // Send success response with token and user details
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,             // User ID
        username: user.firstName,   // User's username (make sure this field exists in your User model)
        email: user.email         // User's email (optional)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
