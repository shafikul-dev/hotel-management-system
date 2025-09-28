import mongoose from 'mongoose';

export interface IApartment {
  _id?: string;
  title: string;
  location: string;
  distance?: string;
  dates?: string;
  price: number;
  rating: number;
  images: string[];
  isGuestFavorite: boolean;
  city: string;
  country: string;
  description?: string;
  amenities?: string[];
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const ApartmentSchema = new mongoose.Schema<IApartment>({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    default: '',
  },
  dates: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  images: [{
    type: String,
    required: true,
  }],
  isGuestFavorite: {
    type: Boolean,
    default: false,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  amenities: [{
    type: String,
  }],
  maxGuests: {
    type: Number,
    default: 2,
  },
  bedrooms: {
    type: Number,
    default: 1,
  },
  bathrooms: {
    type: Number,
    default: 1,
  },
}, {
  timestamps: true,
});

// Prevent re-compilation during development
const Apartment = mongoose.models.Apartment || mongoose.model<IApartment>('Apartment', ApartmentSchema, 'airbnb');

export default Apartment;


