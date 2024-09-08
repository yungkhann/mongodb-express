import jwt from 'jsonwebtoken';

export default (req, res, nxt) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s/, '');
  if (token) {
    try {
      const decoded = jwt.verify(token, '1017gang');
      req.userId = decoded._id;
      nxt();
    } catch (error) {
      return res.status(403).json({
        message: 'Not authorized',
      });
    }
  } else
    return res.status(403).json({
      message: 'Not authorized',
    });
};
