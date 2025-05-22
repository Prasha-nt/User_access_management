const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AppDataSource } = require("../config/ormconfig");
const User = require('../entities/User');

const SALT_ROUNDS = 10;
const VALID_ROLES = ['Employee', 'Manager', 'Admin'];





module.exports = {
  register: async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
      if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing fields' });
      }

      if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      const userRepo = AppDataSource.getRepository('User');

      const existingUser = await userRepo.findOneBy({ username });
      if (existingUser) {
        return res.status(409).json({ message: 'Username already exists' });
      }

      const existingEmail = await userRepo.findOneBy({ email });
      if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const newUser = userRepo.create({
        username,
        email,
        password: hashedPassword,
        role, // use the role provided by client
      });

      await userRepo.save(newUser);

      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },


  login: async (req, res) => {
    const { username, password } = req.body;
    try {
      if (!username || !password) {
        return res.status(400).json({ message: 'Missing fields' });
      }

      const userRepo = AppDataSource.getRepository('User');

      const user = await userRepo.findOneBy({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const payload = { userId: user.id, role: user.role };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      return res.json({
        token,
        role: user.role,
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

};
