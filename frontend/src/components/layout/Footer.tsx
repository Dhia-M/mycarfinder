import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t bg-muted/50">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Car className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">VehicleMarket</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Your trusted marketplace for buying and selling vehicles with complete history tracking.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/vehicles" className="text-muted-foreground hover:text-foreground">
                                    Browse Vehicles
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
                                    Sell Your Vehicle
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-muted-foreground hover:text-foreground">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    Terms of Service
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                support@vehiclemarket.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                +1 (555) 123-4567
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                123 Market St, CA
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} VehicleMarket. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
