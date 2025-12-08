import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDate, formatPrice, formatMileage } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Car,
    Wrench,
    Zap,
    AlertTriangle,
    Settings,
    Package,
    Calendar,
    DollarSign,
} from 'lucide-react';

interface TimelineEvent {
    id: string;
    date: string;
    mileage: number;
    eventType: 'PURCHASE' | 'MAINTENANCE' | 'UPGRADE' | 'ACCIDENT' | 'REPAIR' | 'PARTS_REPLACED';
    title: string;
    description: string;
    cost?: number;
    imageUrl?: string;
}

interface VehicleTimelineProps {
    events: TimelineEvent[];
}

export default function VehicleTimeline({ events }: VehicleTimelineProps) {
    const [filter, setFilter] = useState<string>('ALL');

    const filteredEvents = events.filter((event) => {
        if (filter === 'ALL') return true;
        return event.eventType === filter;
    });

    const sortedEvents = [...filteredEvents].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const getEventColor = (type: string) => {
        const colors = {
            PURCHASE: 'border-green-500 bg-green-50',
            UPGRADE: 'border-green-500 bg-green-50',
            MAINTENANCE: 'border-yellow-500 bg-yellow-50',
            ACCIDENT: 'border-red-500 bg-red-50',
            REPAIR: 'border-red-500 bg-red-50',
            PARTS_REPLACED: 'border-blue-500 bg-blue-50',
        };
        return colors[type as keyof typeof colors] || 'border-gray-500 bg-gray-50';
    };

    const getEventIcon = (type: string) => {
        const icons = {
            PURCHASE: Car,
            UPGRADE: Zap,
            MAINTENANCE: Wrench,
            ACCIDENT: AlertTriangle,
            REPAIR: Settings,
            PARTS_REPLACED: Package,
        };
        const Icon = icons[type as keyof typeof icons] || Car;
        return <Icon className="h-5 w-5" />;
    };

    const getEventIconColor = (type: string) => {
        const colors = {
            PURCHASE: 'text-green-600',
            UPGRADE: 'text-green-600',
            MAINTENANCE: 'text-yellow-600',
            ACCIDENT: 'text-red-600',
            REPAIR: 'text-red-600',
            PARTS_REPLACED: 'text-blue-600',
        };
        return colors[type as keyof typeof colors] || 'text-gray-600';
    };

    if (events.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                <p>No timeline events available for this vehicle.</p>
            </div>
        );
    }

    return (
        <div>
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-8">
                <Button
                    size="sm"
                    variant={filter === 'ALL' ? 'default' : 'outline'}
                    onClick={() => setFilter('ALL')}
                >
                    All ({events.length})
                </Button>
                <Button
                    size="sm"
                    variant={filter === 'MAINTENANCE' ? 'default' : 'outline'}
                    onClick={() => setFilter('MAINTENANCE')}
                >
                    Maintenance ({events.filter((e) => e.eventType === 'MAINTENANCE').length})
                </Button>
                <Button
                    size="sm"
                    variant={filter === 'UPGRADE' ? 'default' : 'outline'}
                    onClick={() => setFilter('UPGRADE')}
                >
                    Upgrades ({events.filter((e) => e.eventType === 'UPGRADE').length})
                </Button>
                <Button
                    size="sm"
                    variant={filter === 'ACCIDENT' ? 'default' : 'outline'}
                    onClick={() => setFilter('ACCIDENT')}
                >
                    Accidents ({events.filter((e) => e.eventType === 'ACCIDENT').length})
                </Button>
                <Button
                    size="sm"
                    variant={filter === 'REPAIR' ? 'default' : 'outline'}
                    onClick={() => setFilter('REPAIR')}
                >
                    Repairs ({events.filter((e) => e.eventType === 'REPAIR').length})
                </Button>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                {/* Events */}
                <div className="space-y-6">
                    {sortedEvents.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="relative pl-20"
                        >
                            {/* Icon */}
                            <div
                                className={`absolute left-0 w-16 h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center ${getEventIconColor(
                                    event.eventType
                                )}`}
                            >
                                {getEventIcon(event.eventType)}
                            </div>

                            {/* Event Card */}
                            <div
                                className={`rounded-lg border-l-4 p-5 shadow-sm ${getEventColor(
                                    event.eventType
                                )}`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-lg">{event.title}</h3>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {formatDate(event.date)}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-semibold text-primary">
                                                    {formatMileage(event.mileage)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {event.cost && (
                                        <div className="flex items-center gap-1 text-lg font-bold">
                                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                                            {formatPrice(Number(event.cost))}
                                        </div>
                                    )}
                                </div>

                                <p className="text-muted-foreground mt-3">{event.description}</p>

                                {event.imageUrl && (
                                    <div className="mt-4">
                                        <img
                                            src={event.imageUrl}
                                            alt={event.title}
                                            className="rounded-md max-h-48 object-cover"
                                        />
                                    </div>
                                )}

                                <div className="mt-3">
                                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-background border">
                                        {event.eventType.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Summary */}
                <div className="mt-8 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Timeline Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Total Events:</span>{' '}
                            <span className="font-semibold">{events.length}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Total Cost:</span>{' '}
                            <span className="font-semibold">
                                {formatPrice(events.reduce((sum, e) => sum + Number(e.cost || 0), 0))}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
