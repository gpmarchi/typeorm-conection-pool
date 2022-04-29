import 'dotenv/config';

export default {
  jwt: {
    secret: process.env.APP_SECRET || 'default',
    expiresIn: '1d',
    privateKey: process.env.JWT_PRIVATE_KEY || 'default',
    publicKey: process.env.JWT_PUBLIC_KEY || 'default',
  },
};
