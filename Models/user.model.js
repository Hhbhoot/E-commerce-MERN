import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
    },
    role: {
      type: String,
      enum: ['Customer', 'Seller'],
      default: 'Customer',
    },
    addresses: [
      {
        fullName: String,
        phone: String,
        address: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
