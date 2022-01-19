import { createHash } from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(req, res) {
    const users = await dbClient.database.collection('users');
    const [email, password] = Buffer.from(
      req.get('authorization').trim().split(' ')[1],
      'base64',
    )
      .toString('ascii')
      .split(':');

    const hashedPwd = createHash('sha1').update(password).digest('hex');
    const existingUser = await users.findOne({ email, password: hashedPwd });
    if (!existingUser) return res.status(401).json({ error: 'Unauthorized' });

    const token = uuidv4();
    await redisClient.set(`auth_${token}`, existingUser._id, 24 * 60 * 60);

    return res.status(200).json({ token });
  }

  static async getDisconnect(req, res) {
    const key = `auth_${req.get('X-Token')}`;
    const users = await dbClient.database.collection('users');

    const userId = await redisClient.get(key);
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    await redisClient.del(key);
    return res.status(200).json();
  }
}

export default AuthController;
