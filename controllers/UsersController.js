import { createHash } from 'crypto';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    const users = dbClient.database.collection('users');

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Already exist' });

    const hashedPwd = createHash('sha1').update(password).digest('hex');
    const newUserData = { email, password: hashedPwd };
    const result = await users.insertOne(newUserData);

    return res.status(201).json({ _id: result.insertedId, email });
  }
}

export default UsersController;