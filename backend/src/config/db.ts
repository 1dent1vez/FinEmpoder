import mongoose from 'mongoose'

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Falta MONGODB_URI en .env')
  }

  await mongoose.connect(uri)
  console.log('[api] MongoDB conectado')
}
