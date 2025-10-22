
import {User} from '../models/user.model.js';
import {hashPassword, verifyPassword, signToken} from '../utils/auth.js';

export async function register(req, res, next) {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({error: 'missing fields'});
        }
        if (password.length < 6) {
            return res.status(400).json({error: 'password too short'});
        }
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(409).json({error: "email already in use"});
        }
        const passwordHash = await hashPassword(password);
        const user = await User.create({ name, email, passwordHash });

        const token = signToken({sub: user._id, email: user.email});

        res.status(201).json({user: {id: user._id, name: user.name, email: user.email, token}});
    } catch (err) {
      next(err);
  }
}

export async function login(req, res, next) {
    const {email, password} = req.body;
    try{
        if(!email || !password) {
            return res.status(400).json({error: 'missing fields'});
        }
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user) {
            return res.status(401).json({error: 'invalid credentials'});
        }
        const ok = await verifyPassword(password, user.passwordHash);
        if (!ok) {
            return res.status(401).json({error: 'invalid credentials'});
        }
        const token = signToken({sub: user._id, email: user.email});
        res.status(200).json({user: {id: user._id, name: user.name, email: user.email, token}});
    } catch (err) {
      next(err);
    }
}