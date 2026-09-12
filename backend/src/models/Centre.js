import mongoose from 'mongoose';

const centreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Centre name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Centre code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: '',
    },
    location: {
      latitude: { type: Number, default: 29.6857 },
      longitude: { type: Number, default: 76.9905 },
    },
    dailyCapacityQuintals: {
      type: Number,
      default: 1000,
    },
    operatingHours: {
      openTime: { type: String, default: '08:00' },
      closeTime: { type: String, default: '17:00' },
    },
    supportedCrops: [
      {
        type: String,
        enum: ['Wheat', 'Paddy', 'Pulses', 'Mustard', 'Chana', 'Maize', 'Cotton', 'Soyabean'],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Centre = mongoose.models.Centre || mongoose.model('Centre', centreSchema);
