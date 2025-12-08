import { Card, CardContent } from '@/components/ui/card';
import { Car, Shield, Users, TrendingUp, CheckCircle } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="container py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">About VehicleMarket</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                    Your trusted platform for buying and selling vehicles with complete transparency and
                    comprehensive history tracking.
                </p>
            </div>

            {/* Mission */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
                <Card>
                    <CardContent className="p-8">
                        <p className="text-lg text-center max-w-4xl mx-auto leading-relaxed">
                            We believe that buying and selling vehicles should be transparent, trustworthy, and straightforward.
                            VehicleMarket connects buyers and sellers while providing complete vehicle history tracking,
                            mechanic certifications, and direct communication tools to ensure every transaction is confident and secure.
                        </p>
                    </CardContent>
                </Card>
            </section>

            {/* How It Works */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Car className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">List Your Vehicle</h3>
                            <p className="text-muted-foreground">
                                Create a detailed listing with photos, specifications, and complete maintenance history.
                                Add timeline events to show the vehicle's full story.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Connect with Buyers</h3>
                            <p className="text-muted-foreground">
                                Receive inquiries and offers through our secure in-app messaging system.
                                Negotiate directly and answer questions in real-time.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Close the Deal</h3>
                            <p className="text-muted-foreground">
                                Complete your transaction with confidence, backed by transparent vehicle history and
                                optional mechanic certifications.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Trust & Safety */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">Trust & Safety</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Shield className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Mechanic Certifications</h3>
                                    <p className="text-muted-foreground">
                                        Sellers can have their vehicles professionally inspected and certified by mechanics,
                                        giving buyers added peace of mind about vehicle condition.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Complete Vehicle History</h3>
                                    <p className="text-muted-foreground">
                                        Our timeline feature lets sellers document every service, upgrade, and event,
                                        providing buyers with a transparent view of the vehicle's journey.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Secure Messaging</h3>
                                    <p className="text-muted-foreground">
                                        All communication happens through our secure in-app messaging system,
                                        keeping your contact information private until you're ready to share.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Car className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
                                    <p className="text-muted-foreground">
                                        All vehicle listings require detailed information including VIN, location, and photos,
                                        ensuring authenticity and reducing fraudulent listings.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">Why Choose VehicleMarket?</h2>
                <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">For Sellers</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Free to list your vehicles</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Showcase your vehicle's complete maintenance history</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Connect directly with serious buyers</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Build trust with mechanic certifications</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-4">For Buyers</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Access complete vehicle history timelines</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Filter by mechanic-certified vehicles</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Make offers and negotiate securely</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                        <span>Buy with confidence knowing the full story</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* CTA */}
            <section className="text-center">
                <Card>
                    <CardContent className="p-12">
                        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Join VehicleMarket today and experience the future of vehicle marketplace.
                            Whether you're buying or selling, we're here to help.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <a
                                href="/vehicles"
                                className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Browse Vehicles
                            </a>
                            <a
                                href="/register"
                                className="px-6 py-3 border border-input rounded-md font-semibold hover:bg-accent transition-colors"
                            >
                                Create Account
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
