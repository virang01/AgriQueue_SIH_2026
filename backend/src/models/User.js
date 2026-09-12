import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const farmerDetailsSchema = new mongoose.Schema(
  {
    village: { type: String, default: '' },
    district: { type: String, default: '' },
    state: { type: String, default: 'Haryana' },
    landAreaAcres: { type: Number, default: 0 },
    aadhaarNumber: { type: String, default: '' },
    farmerIdNumber: { type: String, default: '' },
    linkedCrops: [{ type: String }],
    bankDetails: {
      accountName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      bankName: { type: String, default: '' },
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['farmer', 'staff', 'manager', 'admin', 'govt_admin'],
      default: 'farmer',
    },
    preferredLanguage: {
      type: String,
      enum: ['en', 'hi', 'gu', 'mr', 'pa'],
      default: 'hi',
    },
    centreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Centre',
      default: null,
    },
    farmerDetails: {
      type: farmerDetailsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
