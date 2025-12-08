import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { vehicleAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice, formatMileage } from '@/lib/utils';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyVehicles();
    }, []);

    const fetchMyVehicles = async () => {
        try {
            const { data } = await vehicleAPI.getMyVehicles();
            setVehicles(data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;

        try {
            await vehicleAPI.delete(id);
            setVehicles(vehicles.filter((v) => v.id !== id));
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            alert('Failed to delete vehicle');
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            DRAFT: 'bg-gray-100 text-gray-800',
            PUBLISHED: 'bg-green-100 text-green-800',
            SOLD: 'bg-blue-100 text-blue-800',
            ARCHIVED: 'bg-red-100 text-red-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user?.firstName}! Manage your vehicle listings here.
                </p>
            </div>

            {/* Profile Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Name:</span>{' '}
                                <span className="font-medium">
                                    {user?.firstName} {user?.lastName}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Email:</span>{' '}
                                <span className="font-medium">{user?.email}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Role:</span>{' '}
                                <span className="font-medium capitalize">{user?.role.toLowerCase()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-muted-foreground">Total Vehicles:</span>{' '}
                                <span className="font-medium">{vehicles.length}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Published:</span>{' '}
                                <span className="font-medium">
                                    {vehicles.filter((v) => v.status === 'PUBLISHED').length}
                                </span>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Unique Viewers:</span>{' '}
                                <span className="font-medium">
                                    {vehicles.reduce((sum, v) => sum + (v.uniqueViewers || 0), 0)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Link to="/dashboard/vehicles/new">
                            <Button className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Vehicle
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            {/* My Vehicles Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>My Vehicles</CardTitle>
                        <Link to="/dashboard/vehicles/new">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Vehicle
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        </div>
                    ) : vehicles.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>You haven't listed any vehicles yet.</p>
                            <Link to="/dashboard/vehicles/new">
                                <Button className="mt-4">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Vehicle
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4">Vehicle</th>
                                        <th className="text-left p-4">Price</th>
                                        <th className="text-left p-4">Mileage</th>
                                        <th className="text-left p-4">Status</th>
                                        <th className="text-left p-4">Views</th>
                                        <th className="text-right p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map((vehicle) => (
                                        <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {vehicle.images?.[0] && (
                                                        <img
                                                            src={vehicle.images[0]}
                                                            alt={`${vehicle.make} ${vehicle.model}`}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    )}
                                                    <div>
                                                        <p className="font-semibold">
                                                            {vehicle.year} {vehicle.make} {vehicle.model}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">{vehicle.location}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">{formatPrice(Number(vehicle.price))}</td>
                                            <td className="p-4">{formatMileage(vehicle.currentMileage)}</td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(vehicle.status)}`}>
                                                    {vehicle.status}
                                                </span>
                                            </td>
                                            <td className="p-4">{vehicle.uniqueViewers || 0}</td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/vehicles/${vehicle.id}`}>
                                                        <Button size="sm" variant="ghost">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link to={`/dashboard/vehicles/edit/${vehicle.id}`}>
                                                        <Button size="sm" variant="ghost">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(vehicle.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
