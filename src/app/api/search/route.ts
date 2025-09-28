import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Apartment from '@/models/Apartment';
import { Types } from 'mongoose';

interface SearchCriteria {
  destination: string;
  totalGuests: number;
  minPrice: number;
  maxPrice: number;
}

interface ApartmentDocument {
  _id: Types.ObjectId;
  title: string;
  location: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  amenities: string[];
  instantBook?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    
    // Extract search parameters
    const destination = searchParams.get('destination') || '';
    const checkIn = searchParams.get('checkIn');
    const checkOut = searchParams.get('checkOut');
    const adults = parseInt(searchParams.get('adults') || '0');
    const children = parseInt(searchParams.get('children') || '0');
    const infants = parseInt(searchParams.get('infants') || '0');
    const pets = parseInt(searchParams.get('pets') || '0');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '10000');
    const bedrooms = parseInt(searchParams.get('bedrooms') || '0');
    const bathrooms = parseInt(searchParams.get('bathrooms') || '0');
    const propertyType = searchParams.get('propertyType') || '';
    const amenities = searchParams.get('amenities')?.split(',') || [];
    const instantBook = searchParams.get('instantBook') === 'true';

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    // Location filter
    if (destination) {
      query.$or = [
        { location: { $regex: destination, $options: 'i' } },
        { title: { $regex: destination, $options: 'i' } },
        { description: { $regex: destination, $options: 'i' } }
      ];
    }

    // Guest capacity filter
    const totalGuests = adults + children;
    if (totalGuests > 0) {
      query.maxGuests = { $gte: totalGuests };
    }

    // Price filter
    if (minPrice > 0 || maxPrice < 10000) {
      query.price = {};
      if (minPrice > 0) query.price.$gte = minPrice;
      if (maxPrice < 10000) query.price.$lte = maxPrice;
    }

    // Bedrooms filter
    if (bedrooms > 0) {
      query.bedrooms = { $gte: bedrooms };
    }

    // Bathrooms filter
    if (bathrooms > 0) {
      query.bathrooms = { $gte: bathrooms };
    }

    // Property type filter
    if (propertyType) {
      query.type = { $regex: propertyType, $options: 'i' };
    }

    // Amenities filter
    if (amenities.length > 0) {
      query.amenities = { $in: amenities };
    }

    // Instant book filter
    if (instantBook) {
      query.instantBook = true;
    }

    // Pets filter
    if (pets > 0) {
      query.$or = query.$or || [];
      query.$or.push({ amenities: { $in: ['Pet-friendly', 'Pets allowed'] } });
    }

    // Date availability filter (simplified - in real app you'd check booking calendar)
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      
      // For now, we'll just ensure the dates are valid and in the future
      if (checkInDate >= new Date() && checkOutDate > checkInDate) {
        // In a real app, you'd check against a bookings collection
        // query.bookings = { $not: { $elemMatch: { 
        //   $or: [
        //     { checkIn: { $lt: checkOutDate }, checkOut: { $gt: checkInDate } }
        //   ]
        // }}};
      }
    }


    const apartments = await Apartment.find(query)
      .limit(50) // Limit results for performance
      .lean();

    // Calculate distance and sort by relevance (simplified)
    const results = apartments.map((apartment) => {
      const aptData = apartment as unknown as ApartmentDocument;
      return {
        ...apartment,
        _id: (apartment._id as Types.ObjectId).toString(),
        relevanceScore: calculateRelevanceScore(aptData, {
          destination,
          totalGuests,
          minPrice,
          maxPrice
        })
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
      searchParams: {
        destination,
        checkIn,
        checkOut,
        guests: { adults, children, infants, pets },
        priceRange: { min: minPrice, max: maxPrice },
        bedrooms,
        bathrooms,
        propertyType,
        amenities,
        instantBook
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search apartments' },
      { status: 500 }
    );
  }
}

function calculateRelevanceScore(apartment: ApartmentDocument, searchCriteria: SearchCriteria) {
  let score = 0;
  
  // Location relevance
  if (searchCriteria.destination) {
    if (apartment.location.toLowerCase().includes(searchCriteria.destination.toLowerCase())) {
      score += 10;
    }
    if (apartment.title.toLowerCase().includes(searchCriteria.destination.toLowerCase())) {
      score += 5;
    }
  }
  
  // Guest capacity match
  if (searchCriteria.totalGuests > 0) {
    if (apartment.maxGuests >= searchCriteria.totalGuests) {
      score += 5;
      // Bonus for exact match
      if (apartment.maxGuests === searchCriteria.totalGuests) {
        score += 3;
      }
    }
  }
  
  // Price range preference
  if (apartment.price >= searchCriteria.minPrice && apartment.price <= searchCriteria.maxPrice) {
    score += 3;
  }
  
  // Rating boost
  if (apartment.rating >= 4.5) {
    score += 2;
  }
  
  // Review count boost (popularity)
  if (apartment.reviews > 50) {
    score += 1;
  }
  
  return score;
}

// Helper function to get unique filter options
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { type } = body;
    
    let result = {};
    
    switch (type) {
      case 'destinations':
        const destinations = await Apartment.distinct('location');
        result = { destinations: destinations.slice(0, 20) };
        break;
        
      case 'propertyTypes':
        const types = await Apartment.distinct('type');
        result = { propertyTypes: types };
        break;
        
      case 'amenities':
        const allAmenities = await Apartment.find({}, 'amenities').lean();
        const amenitiesSet = new Set();
        allAmenities.forEach(apt => {
          apt.amenities.forEach((amenity: string) => amenitiesSet.add(amenity));
        });
        result = { amenities: Array.from(amenitiesSet).slice(0, 30) };
        break;
        
      case 'priceRange':
        const priceRange = await Apartment.aggregate([
          {
            $group: {
              _id: null,
              minPrice: { $min: '$price' },
              maxPrice: { $max: '$price' },
              avgPrice: { $avg: '$price' }
            }
          }
        ]);
        result = { priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000, avgPrice: 100 } };
        break;
        
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid filter type' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Filter options error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get filter options' },
      { status: 500 }
    );
  }
}