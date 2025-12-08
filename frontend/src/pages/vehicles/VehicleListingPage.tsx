import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vehicleAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, formatMileage } from '@/lib/utils';
import { Search, Filter, Grid3x3, List, ChevronLeft, ChevronRight } from 'lucide-react';

export default function VehicleListingPage() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });

    // Filters
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        make: '',
        model: '',
        minYear: '',
        maxYear: '',
        minPrice: '',
        maxPrice: '',
        condition: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchVehicles();
    }, [pagination.page, filters]);

    const fetchVehicles = async () => {
        setLoading(true);
        try {
            const { data } = await vehicleAPI.getAll({
                page: pagination.page,
                limit: 12,
                search,
                ...filters,
            });
            setVehicles(data.vehicles);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPagination({ ...pagination, page: 1 });
        fetchVehicles();
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters({ ...filters, [key]: value });
        setPagination({ ...pagination, page: 1 });
    };

    return (
        <div className="container py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Browse Vehicles</h1>
                    <p className="text-muted-foreground mt-1">
                        {pagination.total} vehicles available
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="mb-6 space-y-4">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by make, model..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            className="pl-10"
                        />
                    </div>
                    <Button onClick={handleSearch}>Search</Button>
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                    </Button>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-sm font-medium">Make</label>
                                    <Input
                                        placeholder="Toyota, BMW..."
                                        value={filters.make}
                                        onChange={(e) => handleFilterChange('make', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Model</label>
                                    <Input
                                        placeholder="Camry, M3..."
                                        value={filters.model}
                                        onChange={(e) => handleFilterChange('model', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Min Year</label>
                                    <Input
                                        type="number"
                                        placeholder="2010"
                                        value={filters.minYear}
                                        onChange={(e) => handleFilterChange('minYear', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Max Year</label>
                                    <Input
                                        type="number"
                                        placeholder="2024"
                                        value={filters.maxYear}
                                        onChange={(e) => handleFilterChange('maxYear', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Min Price</label>
                                    <Input
                                        type="number"
                                        placeholder="10000"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Max Price</label>
                                    <Input
                                        type="number"
                                        placeholder="50000"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Condition</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3"
                                        value={filters.condition}
                                        onChange={(e) => handleFilterChange('condition', e.target.value)}
                                    >
                                        <option value="">All</option>
                                        <option value="NEW">New</option>
                                        <option value="USED">Used</option>
                                        <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">Sort By</label>
                                    <select
                                        className="w-full h-10 rounded-md border border-input bg-background px-3"
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    >
                                        <option value="createdAt">Date Listed</option>
                                        <option value="price">Price</option>
                                        <option value="year">Year</option>
                                        <option value="currentMileage">Mileage</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setFilters({
                                            make: '',
                                            model: '',
                                            minYear: '',
                                            maxYear: '',
                                            minPrice: '',
                                            maxPrice: '',
                                            condition: '',
                                            sortBy: 'createdAt',
                                            sortOrder: 'desc',
                                        });
                                        setSearch('');
                                    }}
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Vehicle Grid/List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Loading vehicles...</p>
                </div>
            ) : vehicles.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No vehicles found matching your criteria.</p>
                </div>
            ) : (
                <>
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={pagination.page === 1}
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm">
                                Page {pagination.page} of {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={pagination.page === pagination.totalPages}
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function VehicleCard({ vehicle, viewMode }: { vehicle: any; viewMode: 'grid' | 'list' }) {
    const conditionColors = {
        NEW: 'bg-green-100 text-green-800',
        USED: 'bg-blue-100 text-blue-800',
        CERTIFIED_PRE_OWNED: 'bg-purple-100 text-purple-800',
    };

    if (viewMode === 'list') {
        return (
            <Card className="hover:shadow-lg transition-shadow">
                <div className="flex">
                    <div className="w-64 h-48 bg-muted flex-shrink-0">
                        {vehicle.images?.[0] ? (
                            <img
                                src={vehicle.images[0]}
                                alt={`${vehicle.make} ${vehicle.model}`}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-muted-foreground">No Image</span>
                            </div>
                        )}
                    </div>
                    <CardContent className="flex-1 p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-xl font-semibold">
                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                    </h3>
                                    <span className={`text-xs px-2 py-1 rounded ${conditionColors[vehicle.condition as keyof typeof conditionColors]}`}>
                                        {vehicle.condition.replace('_', ' ')}
                                    </span>
                                </div>
                                <p className="text-muted-foreground mb-4">{vehicle.location}</p>
                                <p className="text-sm line-clamp-2">{vehicle.description}</p>
                                <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                                    <span>{formatMileage(vehicle.currentMileage)}</span>
                                    <span>•</span>
                                    <span>{vehicle.fuelType}</span>
                                    <span>•</span>
                                    <span>{vehicle.transmission}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-primary">{formatPrice(Number(vehicle.price))}</p>
                                <Link to={`/vehicles/${vehicle.id}`}>
                                    <Button className="mt-4">View Details</Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </Card>
        );
    }

    return (
        <Link to={`/vehicles/${vehicle.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="relative h-48 bg-muted">
                    {vehicle.images?.[0] ? (
                        <img
                            src={vehicle.images[0]}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                        </div>
                    )}
                    <div className="absolute top-2 right-2">
                        <span className={`text-xs px-2 py-1 rounded ${conditionColors[vehicle.condition as keyof typeof conditionColors]}`}>
                            {vehicle.condition.replace('_', ' ')}
                        </span>
                    </div>
                </div>
                <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{vehicle.location}</p>
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            {formatMileage(vehicle.currentMileage)}
                        </div>
                        <div className="text-xl font-bold text-primary">
                            {formatPrice(Number(vehicle.price))}
                        </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                        View Details
                    </Button>
                </CardContent>
            </Card>
        </Link>
    );
}
