import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { getDb } from '../db/init';
import { config } from '../config/env';
import { User } from '../types/user';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const {email, password, displayName} = req.body;

        if (!email || !password || !displayName) {
            return res.status(400).json({error: 'Missing required fields'});
        }

        const db = getDb();
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return res.status(409).json({error: 'Email already exists'});
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = db.prepare(`
            INSERT INTO users (email, password_hash, display_name)
            VALUES (?, ?, ?)
        `).run(email, passwordHash, displayName);

        res.status(201).json({
            id: result.lastInsertRowid,
            email,
            displayName
        });

        console.log('User registered:', {
            id: result.lastInsertRowid,
            email: email,
            displayName: displayName
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: 'Missing required fields'});
        }

        const db = getDb();
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;

        if (!user) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        const options: SignOptions = {
            expiresIn: config.JWT_EXPIRES_IN
        };

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            config.JWT_SECRET,
            options
        );

        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                displayName: user.display_name,
                avatarUrl: user.avatar_url
            }
        });

        console.log('User logged in:', { id: user.id, email: user.email });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

export default router;