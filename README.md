# Airbnb Clone - Property Search Platform

A modern, responsive Airbnb clone built with Next.js 15, TypeScript, and MongoDB Atlas. This platform provides comprehensive property search and filtering capabilities with a clean, professional interface.

## 🚀 Features

- **Advanced Search**: Location-based search with comprehensive filtering options
- **Property Listings**: Detailed property information with high-quality images
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Filtering**: Price range, amenities, guest capacity, and more
- **Modern UI**: Clean, professional interface with smooth animations
- **Cloud Database**: MongoDB Atlas integration for scalable data storage

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB Atlas
- **ORM**: Mongoose
- **Icons**: Heroicons
- **Deployment**: Vercel-ready

## 📦 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mynul-airbnb
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Create .env file
DB_URI=your_mongodb_atlas_connection_string
```

4. Run the development server
```bash
npm run dev
```

## 🔧 API Endpoints

### Properties
- `GET /api/apartments` - Get all properties with filtering
- `GET /api/search` - Advanced search with multiple criteria

### Query Parameters
- `city` - Filter by city
- `country` - Filter by country  
- `minPrice` / `maxPrice` - Price range filtering
- `maxGuests` - Guest capacity
- `bedrooms` / `bathrooms` - Property specifications
- `amenities` - Comma-separated amenities list

## 🌐 Deployment

The application is ready for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add your MongoDB Atlas connection string to environment variables
3. Deploy with one click

## 📱 Features Overview

- **Search Interface**: Intuitive search bar with location autocomplete
- **Filter System**: Advanced filtering by price, amenities, property type
- **Property Cards**: Rich property information with image galleries
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Performance**: Fast loading with optimized images and lazy loading

## 🔒 Environment Setup

Create a `.env` file in the root directory:

```env
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

## 📄 License

This project is proprietary software developed for client use.

---

Built with ❤️ using Next.js and modern web technologies.
