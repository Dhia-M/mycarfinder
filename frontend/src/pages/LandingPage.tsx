import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car, Search, TrendingUp, Shield } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-32">
                <div className="container relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                            Find Your Perfect Vehicle
                            <span className="block text-primary mt-2">With Complete History</span>
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Buy and sell vehicles with confidence. View detailed maintenance records,
                            modifications, and complete ownership history.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/vehicles">
                                <Button size="lg" className="w-full sm:w-auto">
                                    <Search className="mr-2 h-5 w-5" />
                                    Browse Vehicles
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                    <Car className="mr-2 h-5 w-5" />
                                    Sell Your Vehicle
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-muted/30">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose VehicleMarket?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <Shield className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Complete History</h3>
                            <p className="text-muted-foreground">
                                Every vehicle comes with detailed maintenance records and modification history.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <TrendingUp className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Market Insights</h3>
                            <p className="text-muted-foreground">
                                Make informed decisions with real-time market data and pricing trends.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                <Car className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Verified Sellers</h3>
                            <p className="text-muted-foreground">
                                All sellers are verified to ensure a safe and secure transaction.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20">
                <div className="container">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                            <p className="text-muted-foreground">Vehicles Listed</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
                            <p className="text-muted-foreground">Happy Customers</p>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">99%</div>
                            <p className="text-muted-foreground">Satisfaction Rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                    <p className="text-xl mb-8 opacity-90">
                        Join thousands of buyers and sellers on VehicleMarket today.
                    </p>
                    <Link to="/register">
                        <Button size="lg" variant="secondary">
                            Create Free Account
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
