# E-Commerce Application Backend

## Project Overview

The E-Commerce Application is designed to provide a comprehensive online shopping experience for users, vendors, and administrators. It serves as a platform where users can browse and purchase products, vendors can manage their shops and inventories, and administrators can oversee and regulate the entire platform. This backend repository focuses on creating a scalable and high-performance system using modern web technologies.

## Live URL

- Backend: [Backend Deployment URL](#)
- Frontend: [Frontend Deployment URL](#)

## Technology Stack & Packages

- **Node.js**: Server environment
- **Express.js**: Web application framework
- **PostgreSQL**: Database system
- **Prisma**: ORM for PostgreSQL
- **JWT**: For authentication
- **Cloudinary**: For image uploads
- **Stripe**: For payment processing
- **Nodemailer**: For email sending functionalities
- **Bcrypt.js**: For hashing passwords

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone [repository URL]
   cd [repository name]
   ```

## Setup Instructions

### Install Dependencies

````bash
npm install



### Set Up Environment Variables
Create a `.env` file in the root directory and update the following:

```plaintext
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
CLOUDINARY_URL="your_cloudinary_url"
STRIPE_SECRET_KEY="your_stripe_secret_key"


### Run the Application

```bash
npm start


### Access the API


The API will be available at http://localhost:3000.


## Key Features & Functionality

- **Authentication**: Secure JWT-based authentication system.
- **Product Management**: Vendors can add, edit, and delete products.
- **Order Management**: Track and manage customer orders.
- **User Management**: Admins can manage user accounts and permissions.
- **Payment Integration**: Supports Stripe for transactions.
- **Image Uploads**: Integrated with Cloudinary for storing product images.
- **Email Notifications**: Automated email notifications using Nodemailer.
````
