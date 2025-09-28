import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Apartment from '@/models/Apartment';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Extract all possible query parameters
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const maxGuests = searchParams.get('maxGuests');
    const bedrooms = searchParams.get('bedrooms');
    const bathrooms = searchParams.get('bathrooms');
    const isGuestFavorite = searchParams.get('isGuestFavorite');
    const amenities = searchParams.get('amenities');
    const limit = searchParams.get('limit');
    const skip = searchParams.get('skip');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const getAll = searchParams.get('getAll') === 'true';

    // Build query object
    let query: any = {};

    // City filter
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Country filter
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Guest capacity filter
    if (maxGuests) {
      query.maxGuests = { $gte: parseInt(maxGuests) };
    }

    // Bedrooms filter
    if (bedrooms) {
      query.bedrooms = { $gte: parseInt(bedrooms) };
    }

    // Bathrooms filter
    if (bathrooms) {
      query.bathrooms = { $gte: parseInt(bathrooms) };
    }

    // Guest favorite filter
    if (isGuestFavorite !== null) {
      query.isGuestFavorite = isGuestFavorite === 'true';
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = amenities.split(',').map(a => a.trim());
      query.amenities = { $in: amenitiesArray };
    }

    // Build sort object
    const sortObj: any = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    let apartments;
    let totalCount;

    if (getAll) {
      // Get ALL data without pagination
      apartments = await Apartment.find(query).sort(sortObj);
      totalCount = apartments.length;
    } else {
      // Get paginated data
      const limitNum = limit ? parseInt(limit) : 20;
      const skipNum = skip ? parseInt(skip) : 0;

      apartments = await Apartment.find(query)
        .sort(sortObj)
        .limit(limitNum)
        .skip(skipNum);

      // Get total count for pagination info
      totalCount = await Apartment.countDocuments(query);
    }

    // Calculate pagination info
    const currentPage = skip ? Math.floor(parseInt(skip) / (limit ? parseInt(limit) : 20)) + 1 : 1;
    const totalPages = Math.ceil(totalCount / (limit ? parseInt(limit) : 20));

    return NextResponse.json({
      success: true,
      data: apartments,
      count: apartments.length,
      totalCount,
      pagination: {
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        limit: limit ? parseInt(limit) : 20,
        skip: skip ? parseInt(skip) : 0
      },
      filters: {
        city,
        country,
        priceRange: { min: minPrice, max: maxPrice },
        minRating,
        maxGuests,
        bedrooms,
        bathrooms,
        isGuestFavorite,
        amenities: amenities ? amenities.split(',').map(a => a.trim()) : null
      }
    });

  } catch (error) {
    console.error('Error fetching apartments:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch apartments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}