import authUtils from '../utils/auth';

class FilesController {
  static async postUpload(req, res) {
    const result = await authUtils.authCheck(req);

    if (result.status === 400) {
      return res.status(result.status).json(result.payload);
    }

    const { name, type, parentId, isPublic, data } = req.body;
    const files = await dbClient.database.collection('files');

    if (!name) return res.status(400).json({ error: 'Missing name' });

    if (!type || ['folder', 'file', 'image'].includes(type))
      return res.status(400).json({ error: 'Missing type' });

    if (!data && type != 'folder')
      return res.status(400).json({ error: 'Missing data' });

    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Already exist' });

    const hashedPwd = createHash('sha1').update(password).digest('hex');
    const newUserData = { email, password: hashedPwd };
    const result = await users.insertOne(newUserData);

    return res.status(201).json({ id: result.insertedId, email });
  }
}

export default FilesController;
