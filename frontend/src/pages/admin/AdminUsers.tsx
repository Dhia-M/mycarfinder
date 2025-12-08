import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await adminAPI.getAllUsers({ page: 1, limit: 50 });
            setUsers(data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        try {
            await adminAPI.updateUserRole(userId, newRole);
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update user role');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await adminAPI.deleteUser(id);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

            <Card>
                <CardHeader>
                    <CardTitle>All Users ({users.length})</CardTitle>
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
                                        <th className="text-left p-4">Name</th>
                                        <th className="text-left p-4">Email</th>
                                        <th className="text-left p-4">Role</th>
                                        <th className="text-left p-4">Vehicles</th>
                                        <th className="text-left p-4">Joined</th>
                                        <th className="text-right p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">
                                                <p className="font-semibold">
                                                    {user.firstName} {user.lastName}
                                                </p>
                                            </td>
                                            <td className="p-4 text-sm">{user.email}</td>
                                            <td className="p-4">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className="text-sm rounded px-2 py-1 border"
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                    <option value="SUPER_ADMIN">Super Admin</option>
                                                </select>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm font-medium">{user._count?.vehicles || 0}</span>
                                            </td>
                                            <td className="p-4 text-sm">{formatDate(user.createdAt)}</td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {user.role !== 'SUPER_ADMIN' && (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    )}
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
