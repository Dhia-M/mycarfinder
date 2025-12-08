# Database Migration Instructions

## ⚠️ IMPORTANT: You must run this migration for the new features to work!

The new features require database schema changes. Follow these steps:

### Step 1: Stop the Backend Server

In the backend terminal where `npm run dev` is running, press `Ctrl+C` to stop the server.

### Step 2: Run the Migration

Open a terminal in the backend directory and run:

```bash
cd "c:\Users\mstee\Desktop\ahmed dhia mankai\5edma\ecomm vehicle\backend"
npx prisma migrate dev --name add_mechanic_cert_and_messages
```

This will:
- Add `mechanicCertified` column to the Vehicle table
- Create the Message table for the messaging system
- Update all relationships

### Step 3: Generate Prisma Client

After the migration completes, run:

```bash
npx prisma generate
```

This updates the Prisma Client with the new schema.

### Step 4: Restart the Backend Server

```bash
npm run dev
```

### Step 5: Verify

Check that the backend starts without errors. You should see:
```
🚀 Server running on port 5000
```

## What's New?

After running the migration, you can:

1. **Add images** when creating vehicles
2. **Add timeline events** to document vehicle history
3. **Mark vehicles as mechanic certified**
4. **Send messages** to sellers via the Contact Seller button
5. **Make offers** using the messaging system
6. **Share vehicles** using the share button
7. **Visit /about** page for information about the platform
8. **View messages** at /messages

All prices now display in **TND (Tunisian Dinar)** instead of USD.

## Troubleshooting

### If migration fails with "operation not permitted"
The dev server may still be locking files. Make sure the backend is fully stopped, wait a few seconds, and try again.

### If you see Prisma errors after migration
Run `npx prisma generate` to update the client.

### If the frontend shows errors
Make sure both frontend and backend servers are running:
- Frontend: Should be running on http://localhost:5173
- Backend: Should be running on http://localhost:5000
