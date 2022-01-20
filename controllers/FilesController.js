import authUtils from '../utils/auth';

class FilesController {
  static async postUpload(req, res) {
    const result = await authUtils.authCheck(req);

    if (result.status === 400) {
      return res.status(result.status).json(result.payload);
    }

    return res.json('Youpi');
  }
}

export default FilesController;
