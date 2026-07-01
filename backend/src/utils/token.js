import jwt from 'jsonwebtoken';

export const generateAccessToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  return token;
};

export const generateRefreshToken = (payload) => {
  const token = jwt.sign(payload, process.env.REFRESH_JWT_SECRET, {
    expiresIn: '7d',
  });
  return token;
};
