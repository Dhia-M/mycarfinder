import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice, formatMileage, formatDate } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Eye, Trash2 } from 'lucide-react';

export default function AdminVehicles() {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });

    useEffect(() => {
        fetchVehicles();
    }, [pagination.page]);

    const fetchVehicles = async () => {
        try {
            const { data } = await adminAPI.getAllVehicles({ page: pagination.page, limit: 20 });
            setVehicles(data.vehicles);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this vehicle?')) return;

        try {
            await adminAPI.deleteVehicle(id);
            fetchVehicles();
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
            <h1 className="text-3xl font-bold mb-8">Manage Vehicles</h1>

            <Card>
                <CardHeader>
                    <CardTitle>All Vehicles ({pagination.total})</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-4">ID</th>
                                        <th className="text-left p-4">Vehicle</th>
                                        <th className="text-left p-4">Seller</th>
                                        <th className="text-left p-4">Price</th>
                                        <th className="text-left p-4">Status</th>
                                        <th className="text-left p-4">Listed</th>
                                        <th className="text-right p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vehicles.map((vehicle) => (
                                        <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {vehicle.id.slice(0, 8)}...
                                            </td>
                                            <td className="p-4">
                                                <div>
                                                    <p className="font-semibold">
                                                        {vehicle.year} {vehicle.make} {vehicle.model}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatMileage(vehicle.currentMileage)}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm">
                                                    {vehicle.user?.firstName} {vehicle.user?.lastName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{vehicle.user?.email}</p>
                                            </td>
                                            <td className="p-4">{formatPrice(Number(vehicle.price))}</td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(vehicle.status)}`}>
                                                    {vehicle.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm">{formatDate(vehicle.createdAt)}</td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/vehicles/${vehicle.id}`}>
                                                        <Button size="sm" variant="ghost">
                                                            <Eye className="h-4 w-4" />
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
