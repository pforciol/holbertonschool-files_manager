import { createHash } from 'crypto';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    const users = await dbClient.database.collection('users');

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Already exist' });

    const hashedPwd = createHash('sha1').update(password).digest('hex');
    const newUserData = { email, password: hashedPwd };
    const result = await users.insertOne(newUserData);

    return res.status(201).json({ id: result.insertedId, email });
  }

  static async getMe(req, res) {
    const users = await dbClient.database.collection('users');
    const key = `auth_${req.get('X-Token')}`;

    const userId = await redisClient.get(key);
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    return res.json({ id: user._id, email: user.email });
  }
}

export default UsersController;
