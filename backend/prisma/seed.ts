import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@vehiclemarket.com' },
        update: {},
        create: {
            email: 'admin@vehiclemarket.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            isVerified: true,
        },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await prisma.user.upsert({
        where: { email: 'john.doe@example.com' },
        update: {},
        create: {
            email: 'john.doe@example.com',
            password: userPassword,
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1234567890',
            isVerified: true,
        },
    });
    console.log('✅ Created regular user:', user.email);

    // Create sample vehicles with timeline
    const vehicle1 = await prisma.vehicle.create({
        data: {
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            vin: 'JT2BF18K5X0123456',
            condition: 'USED',
            purchaseDate: new Date('2020-03-15'),
            initialMileage: 0,
            currentMileage: 45000,
            price: 22500,
            description: 'Well-maintained Toyota Camry in excellent condition. Single owner, all service records available. Features include leather seats, sunroof, navigation system, and advanced safety features.',
            images: [
                'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
                'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800',
            ],
            features: ['Leather Seats', 'Sunroof', 'Navigation', 'Backup Camera', 'Bluetooth', 'Cruise Control'],
            fuelType: 'Gasoline',
            transmission: 'Automatic',
            engine: '2.5L 4-Cylinder',
            color: 'Silver',
            location: 'Los Angeles, CA',
            status: 'PUBLISHED',
            userId: user.id,
            timelineEvents: {
                create: [
                    {
                        date: new Date('2020-03-15'),
                        mileage: 0,
                        eventType: 'PURCHASE',
                        title: 'Vehicle Purchased',
                        description: 'Purchased from Toyota dealership. First owner.',
                        cost: 28000,
                    },
                    {
                        date: new Date('2020-09-10'),
                        mileage: 5000,
                        eventType: 'MAINTENANCE',
                        title: 'First Oil Change',
                        description: 'Synthetic oil change and tire rotation at authorized service center.',
                        cost: 89.99,
                    },
                    {
                        date: new Date('2021-03-15'),
                        mileage: 15000,
                        eventType: 'MAINTENANCE',
                        title: 'Annual Service',
                        description: 'Complete inspection, oil change, brake fluid replacement, and filter changes.',
                        cost: 350,
                    },
                    {
                        date: new Date('2022-01-20'),
                        mileage: 28000,
                        eventType: 'UPGRADE',
                        title: 'New Tires Installed',
                        description: 'Replaced all four tires with Michelin Primacy all-season tires.',
                        cost: 680,
                    },
                    {
                        date: new Date('2023-06-10'),
                        mileage: 42000,
                        eventType: 'PARTS_REPLACED',
                        title: 'Battery Replacement',
                        description: 'Original battery replaced with new OEM battery.',
                        cost: 180,
                    },
                ],
            },
        },
    });
    console.log('✅ Created vehicle:', vehicle1.make, vehicle1.model);

    const vehicle2 = await prisma.vehicle.create({
        data: {
            make: 'BMW',
            model: '3 Series',
            year: 2022,
            vin: 'WBA8E9C50HK123789',
            condition: 'CERTIFIED_PRE_OWNED',
            purchaseDate: new Date('2022-01-10'),
            initialMileage: 0,
            currentMileage: 18000,
            price: 38900,
            description: 'Certified Pre-Owned BMW 3 Series with extended warranty. Luxury package with premium features. Meticulously maintained with complete service history.',
            images: [
                'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
                'https://images.unsplash.com/photo-1617531653520-bd4f96900e86?w=800',
            ],
            features: ['Heated Seats', 'Premium Sound', 'Navigation', 'Adaptive Cruise', 'Parking Sensors', 'LED Headlights'],
            fuelType: 'Gasoline',
            transmission: 'Automatic',
            engine: '2.0L Turbo 4-Cylinder',
            color: 'Black',
            location: 'New York, NY',
            status: 'PUBLISHED',
            userId: user.id,
            timelineEvents: {
                create: [
                    {
                        date: new Date('2022-01-10'),
                        mileage: 0,
                        eventType: 'PURCHASE',
                        title: 'Vehicle Purchased',
                        description: 'Purchased brand new from BMW dealership.',
                        cost: 45000,
                    },
                    {
                        date: new Date('2022-07-15'),
                        mileage: 8000,
                        eventType: 'MAINTENANCE',
                        title: 'First Service',
                        description: 'First scheduled maintenance at BMW service center. Oil change and multi-point inspection.',
                        cost: 250,
                    },
                    {
                        date: new Date('2023-02-20'),
                        mileage: 16000,
                        eventType: 'MAINTENANCE',
                        title: 'Annual Service',
                        description: 'Complete annual service with brake inspection and fluid top-ups.',
                        title: 'Software Update',
                        description: 'Over-the-air software update with enhanced autopilot features.',
                        cost: 0,
                    },
                ],
            },
        },
    });
    console.log('✅ Created vehicle:', vehicle3.make, vehicle3.model);

    console.log('🎉 Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
