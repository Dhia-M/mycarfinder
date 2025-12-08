import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vehicleAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, formatMileage, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
    Car,
    MapPin,
    Gauge,
    Calendar,
    Fuel,
    Settings,
    User,
    Phone,
    Mail,
    Share2,
    ChevronLeft,
    ChevronRight,
    Shield,
    Check,
} from 'lucide-react';
import VehicleTimeline from '@/components/timeline/VehicleTimeline';
import MessagingModal from '@/components/messaging/MessagingModal';

export default function VehicleDetailPage() {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isMessagingOpen, setIsMessagingOpen] = useState(false);
    const [isOfferMode, setIsOfferMode] = useState(false);

    useEffect(() => {
        if (id) {
            fetchVehicle(id);
        }
    }, [id]);

    const fetchVehicle = async (vehicleId: string) => {
        setLoading(true);
        try {
            const { data } = await vehicleAPI.getById(vehicleId);
            setVehicle(data);
        } catch (error) {
            console.error('Error fetching vehicle:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading vehicle details...</p>
                </div>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="container py-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
                <Link to="/vehicles">
                    <Button>Back to Listings</Button>
                </Link>
            </div>
        );
    }

    const conditionColors = {
        NEW: 'bg-green-100 text-green-800',
        USED: 'bg-blue-100 text-blue-800',
        CERTIFIED_PRE_OWNED: 'bg-purple-100 text-purple-800',
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % vehicle.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + vehicle.images.length) % vehicle.images.length);
    };

    const handleContactSeller = () => {
        setIsOfferMode(false);
        setIsMessagingOpen(true);
    };

    const handleMakeOffer = () => {
        setIsOfferMode(true);
        setIsMessagingOpen(true);
    };

    const handleShare = async () => {
        const url = window.location.href;
        const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
        const text = `Check out this ${title} on VehicleMarket!`;

        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch (error) {
                console.log('Share cancelled or failed');
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
            } catch (error) {
                alert('Failed to copy link');
            }
        }
    };

    return (
        <div className="container py-8">
            {/* Back Button */}
            <Link to="/vehicles">
                <Button variant="ghost" className="mb-4">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Listings
                </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - 70% */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Gallery */}
                    <Card className="overflow-hidden">
                        <div className="relative h-96 bg-muted">
                            {vehicle.images && vehicle.images.length > 0 ? (
                                <>
                                    <img
                                        src={vehicle.images[currentImageIndex]}
                                        alt={`${vehicle.make} ${vehicle.model}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {vehicle.images.length > 1 && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute left-4 top-1/2 -translate-y-1/2"
                                                onClick={prevImage}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="icon"
                                                className="absolute right-4 top-1/2 -translate-y-1/2"
                                                onClick={nextImage}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Car className="h-16 w-16 text-muted-foreground" />
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        {vehicle.images && vehicle.images.length > 1 && (
                            <div className="flex gap-2 p-4 overflow-x-auto">
                                {vehicle.images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${idx === currentImageIndex ? 'border-primary' : 'border-transparent'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Key Specs Banner */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold">
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </h1>
                                    {vehicle.mechanicCertified && (
                                        <div className="flex items-center gap-2 mt-2 text-green-600">
                                            <Shield className="h-5 w-5" />
                                            <span className="flex items-center gap-1 text-sm font-semibold">
                                                <Check className="h-4 w-4" />
                                                Mechanic Certified
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <span className={`px-3 py-1 rounded text-sm ${conditionColors[vehicle.condition as keyof typeof conditionColors]}`}>
                                    {vehicle.condition.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-2">
                                    <Gauge className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Mileage</p>
                                        <p className="font-semibold">{formatMileage(vehicle.currentMileage)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Year</p>
                                        <p className="font-semibold">{vehicle.year}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Fuel className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Fuel Type</p>
                                        <p className="font-semibold">{vehicle.fuelType || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Transmission</p>
                                        <p className="font-semibold">{vehicle.transmission || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Description</h2>
                            <p className="text-muted-foreground whitespace-pre-line">{vehicle.description}</p>
                        </CardContent>
                    </Card>

                    {/* Features */}
                    {vehicle.features && vehicle.features.length > 0 && (
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Features</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {vehicle.features.map((feature: string, idx: number) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Interactive Timeline - THE MOST IMPORTANT COMPONENT */}
                    <Card>
                        <CardContent className="p-6">
                            <h2 className="text-2xl font-semibold mb-6">Vehicle History Timeline</h2>
                            <VehicleTimeline events={vehicle.timelineEvents || []} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - 30% */}
                <div className="space-y-6">
                    {/* Price Card */}
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-muted-foreground mb-2">Price</p>
                            <p className="text-4xl font-bold text-primary mb-4">
                                {formatPrice(Number(vehicle.price))}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <MapPin className="h-4 w-4" />
                                {vehicle.location}
                            </div>
                            <Button className="w-full" size="lg" onClick={handleContactSeller}>
                                Contact Seller
                            </Button>
                            <Button className="w-full mt-2" variant="outline" onClick={handleMakeOffer}>
                                Make an Offer
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Seller Card */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4">Seller Information</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold">
                                        {vehicle.user?.firstName} {vehicle.user?.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Member since {new Date(vehicle.user?.createdAt).getFullYear()}
                                    </p>
                                </div>
                            </div>
                            {vehicle.user?.phone && (
                                <div className="flex items-center gap-2 text-sm mb-2">
                                    <Phone className="h-4 w-4" />
                                    {vehicle.user.phone}
                                </div>
                            )}
                            {vehicle.user?.email && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4" />
                                    {vehicle.user.email}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Share Card */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4">Share This Vehicle</h3>
                            <Button variant="outline" className="w-full" onClick={handleShare}>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Vehicle Details */}
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold mb-4">Vehicle Details</h3>
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">VIN</dt>
                                    <dd className="font-medium">{vehicle.vin}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Color</dt>
                                    <dd className="font-medium">{vehicle.color || 'N/A'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Engine</dt>
                                    <dd className="font-medium">{vehicle.engine || 'N/A'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Status</dt>
                                    <dd className="font-medium capitalize">{vehicle.status.toLowerCase()}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-muted-foreground">Listed</dt>
                                    <dd className="font-medium">{formatDate(vehicle.createdAt)}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Messaging Modal */}
            <MessagingModal
                isOpen={isMessagingOpen}
                onClose={() => setIsMessagingOpen(false)}
                receiverId={vehicle.user?.id || ''}
                receiverName={`${vehicle.user?.firstName} ${vehicle.user?.lastName}`}
                vehicleId={vehicle.id}
                vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                isOffer={isOfferMode}
            />
        </div>
    );
}
