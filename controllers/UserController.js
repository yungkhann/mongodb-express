import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

import { validationResult } from 'express-validator';

const getMe = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      _id: req.body.id,
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    res.status(404).json({
      message: 'User not found',
    });
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      return res.status(404).json({
        message: 'Wrong email or password',
      });
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!isValidPass) {
      return res.status(404).json({
        message: 'Wrong email or password',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      '1017gang',
      {
        expiresIn: '30d',
      }
    );

    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to login',
    });
    console.log(error);
  }
};

const register = async (req, res) => {
  try {
    

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      '1017gang',
      {
        expiresIn: '30d',
      }
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({ ...userData, token });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to register',
    });
    console.log(error);
  }
};

const getOne = async (req, res) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    res.status(404).json({
      message: 'User not found',
    });
    console.log(error);
  }
};

const getAll = async (req, res) => {
  try {
    const users = await UserModel.find();
    const resUsers = [];
    if (!users) {
      return res.status(404).json({
        message: 'No users',
      });
    }

    users.forEach(user => {
      const { passwordHash, ...userData } = user._doc;
      resUsers.push(userData);
    });

    res.json(resUsers);
  } catch (error) {
    res.status(404).json({
      message: 'No users',
    });
    console.log(error);
  }
};

const deleteOne = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json(userData);
  } catch (error) {
    res.status(404).json({
      message: 'User not found',
    });
    console.log(error);
  }
};

export { getMe, register, login, getOne, getAll, deleteOne };
