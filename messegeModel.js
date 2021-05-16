import mongoose from 'mongoose'

const messegeSchema = mongoose.Schema({
    username: String,
    message: String,
    timestamp: String
})

export default mongoose.model('messege', messegeSchema)