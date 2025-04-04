# Our Romantic Space

A cute and minimalistic romantic-themed website built with Next.js, featuring a secure image gallery that displays photos from Azure Blob Storage.

## Features

- **Cute, Romantic Design**: Soft pastel colors, rounded corners, and cozy aesthetics
- **Password Protected**: Access limited to two authorized users
- **Azure Blob Storage Integration**: Securely fetch and display images
- **Responsive Layout**: Works beautifully on all devices
- **Built with Modern Stack**:
  - Next.js 14 with App Router
  - TypeScript
  - Tailwind CSS
  - Shadcn UI components

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- An Azure account with Blob Storage set up
- A container in your Azure Storage account for storing images

### Setup Instructions

1. Clone this repository
   ```bash
   git clone <repository-url>
   cd vibecode-rom
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   - Copy `.env.local` to your own `.env.local` file and update with your credentials:
   ```
   NEXTAUTH_SECRET=your-unique-secret-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Azure Storage
   AZURE_STORAGE_CONNECTION_STRING=your-azure-connection-string
   AZURE_STORAGE_CONTAINER_NAME=your-container-name
   
   # Auth credentials (for demo purposes - replace with more secure method)
   AUTH_USERNAME_1=user1
   AUTH_PASSWORD_1=password1
   AUTH_USERNAME_2=user2
   AUTH_PASSWORD_2=password2
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This website can be easily deployed to Vercel or Azure App Services.

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Import the project to Vercel
3. Set up the environment variables in the Vercel dashboard
4. Deploy!

### Deploying to Azure App Services

1. Create an Azure Web App
2. Set up GitHub Actions for continuous deployment
3. Configure environment variables in Azure App Service Configuration
4. Deploy!

## Adding Images

To add images to your gallery:

1. Upload images to your Azure Blob Storage container
2. Make sure the images are set with the correct permissions
3. Refresh the gallery to see your new images

## Customization

- Edit `app/globals.css` to change colors and design elements
- Update components in the `components` directory to modify UI elements
- Adjust authentication logic in `app/api/auth` if needed

## Security Notes

- The current authentication system is simple and uses environment variables for credentials
- For production, consider using a more robust authentication system
- Ensure your Azure Storage has proper CORS settings configured
