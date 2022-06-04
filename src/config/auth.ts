export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'supersecret',
    expiresIn: '1d'
  }
}
