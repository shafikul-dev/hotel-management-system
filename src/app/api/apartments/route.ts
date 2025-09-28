import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Apartment, { IApartment } from '@/models/Apartment';
import type { FilterQuery, SortOrder } from 'mongoose';

// Helper filter types to avoid using `any`
type NumberRangeFilter = { $gte?: number; $lte?: number };
type NumberGteFilter = { $gte: number };
type StringInFilter = { $in: string[] };

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
    const query: FilterQuery<IApartment> = {};

    // City filter
    if (city) {
      // Regex text search (case-insensitive)
      query.city = { $regex: city, $options: 'i' } as unknown as FilterQuery<IApartment>['city'];
    }

    // Country filter
    if (country) {
      query.country = { $regex: country, $options: 'i' } as unknown as FilterQuery<IApartment>['country'];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      const priceFilter: NumberRangeFilter = {};
      if (minPrice) priceFilter.$gte = parseFloat(minPrice);
      if (maxPrice) priceFilter.$lte = parseFloat(maxPrice);
      query.price = priceFilter as unknown as FilterQuery<IApartment>['price'];
    }

    // Rating filter
    if (minRating) {
      const ratingFilter: NumberGteFilter = { $gte: parseFloat(minRating) };
      query.rating = ratingFilter as unknown as FilterQuery<IApartment>['rating'];
    }

    // Guest capacity filter
    if (maxGuests) {
      const guestsFilter: NumberGteFilter = { $gte: parseInt(maxGuests) };
      query.maxGuests = guestsFilter as unknown as FilterQuery<IApartment>['maxGuests'];
    }

    // Bedrooms filter
    if (bedrooms) {
      const bedroomsFilter: NumberGteFilter = { $gte: parseInt(bedrooms) };
      query.bedrooms = bedroomsFilter as unknown as FilterQuery<IApartment>['bedrooms'];
    }

    // Bathrooms filter
    if (bathrooms) {
      const bathroomsFilter: NumberGteFilter = { $gte: parseInt(bathrooms) };
      query.bathrooms = bathroomsFilter as unknown as FilterQuery<IApartment>['bathrooms'];
    }

    // Guest favorite filter
    if (isGuestFavorite !== null) {
      query.isGuestFavorite = isGuestFavorite === 'true';
    }

    // Amenities filter
    if (amenities) {
      const amenitiesArray = amenities.split(',').map(a => a.trim());
      const amenitiesFilter: StringInFilter = { $in: amenitiesArray };
      query.amenities = amenitiesFilter as unknown as FilterQuery<IApartment>['amenities'];
    }

    // Build sort object
    const sortObj: Record<string, SortOrder> = {};
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