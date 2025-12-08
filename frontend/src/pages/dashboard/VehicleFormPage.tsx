import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vehicleAPI, timelineAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, X, Plus, Shield } from 'lucide-react';

export default function VehicleFormPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get vehicle ID from URL for edit mode
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [timelineEvents, setTimelineEvents] = useState<any[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        condition: 'USED',
        purchaseDate: new Date().toISOString().split('T')[0],
        initialMileage: 0,
        currentMileage: 0,
        price: 0,
        description: '',
        location: '',
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        engine: '',
        color: '',
        status: 'DRAFT',
        mechanicCertified: false,
        images: [] as string[],
        features: [] as string[],
    });

    // Load existing vehicle data if editing
    useEffect(() => {
        if (id) {
            setIsEditMode(true);
            loadVehicleData(id);
        }
    }, [id]);

    const loadVehicleData = async (vehicleId: string) => {
        try {
            setLoading(true);
            const { data } = await vehicleAPI.getById(vehicleId);

            // Populate form with existing data
            setFormData({
                make: data.make || '',
                model: data.model || '',
                year: data.year || new Date().getFullYear(),
                vin: data.vin || '',
                condition: data.condition || 'USED',
                purchaseDate: data.purchaseDate ? new Date(data.purchaseDate).toISOString().split('T')[0] : '',
                initialMileage: data.initialMileage || 0,
                currentMileage: data.currentMileage || 0,
                price: Number(data.price) || 0,
                description: data.description || '',
                location: data.location || '',
                fuelType: data.fuelType || 'Gasoline',
                transmission: data.transmission || 'Automatic',
                engine: data.engine || '',
                color: data.color || '',
                status: data.status || 'DRAFT',
                mechanicCertified: data.mechanicCertified || false,
                images: data.images || [],
                features: data.features || [],
            });

            // Set existing images as previews
            if (data.images && data.images.length > 0) {
                setImagePreviews(data.images);
            }
        } catch (error) {
            console.error('Error loading vehicle:', error);
            alert('Failed to load vehicle data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFeatureToggle = (feature: string) => {
        setFormData({
            ...formData,
            features: formData.features.includes(feature)
                ? formData.features.filter((f) => f !== feature)
                : [...formData.features, feature],
        });
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setImageFiles((prev) => [...prev, ...files]);

        // Create previews
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddTimelineEvent = () => {
        setTimelineEvents([
            ...timelineEvents,
            {
                date: new Date().toISOString().split('T')[0],
                mileage: formData.currentMileage,
                eventType: 'MAINTENANCE',
                title: '',
                description: '',
                cost: 0,
            },
        ]);
    };

    const handleTimelineEventChange = (index: number, field: string, value: any) => {
        const updatedEvents = [...timelineEvents];
        updatedEvents[index] = { ...updatedEvents[index], [field]: value };
        setTimelineEvents(updatedEvents);
    };

    const removeTimelineEvent = (index: number) => {
        setTimelineEvents((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Upload new images if any
            let imageUrls: string[] = [...formData.images]; // Keep existing images
            if (imageFiles.length > 0) {
                setUploadingImages(true);
                const { data } = await vehicleAPI.uploadImages(imageFiles);
                imageUrls = [...imageUrls, ...data.imageUrls]; // Append new images
                setUploadingImages(false);
            }

            const vehicleData = {
                ...formData,
                year: parseInt(String(formData.year)),
                initialMileage: parseInt(String(formData.initialMileage)),
                currentMileage: parseInt(String(formData.currentMileage)),
                price: parseFloat(String(formData.price)),
                images: imageUrls,
            };

            if (isEditMode && id) {
                // Update existing vehicle
                await vehicleAPI.update(id, vehicleData);

                // Create new timeline events if any (for edit mode)
                if (timelineEvents.length > 0) {
                    await Promise.all(
                        timelineEvents.map((event) =>
                            timelineAPI.create(id, {
                                ...event,
                                date: new Date(event.date),
                                mileage: parseInt(String(event.mileage)),
                                cost: event.cost ? parseFloat(String(event.cost)) : null,
                            })
                        )
                    );
                }

                alert('Vehicle updated successfully!');
            } else {
                // Create new vehicle
                const vehicleResponse = await vehicleAPI.create(vehicleData);
                const vehicleId = vehicleResponse.data.id;

                // Create timeline events if any
                if (timelineEvents.length > 0) {
                    await Promise.all(
                        timelineEvents.map((event) =>
                            timelineAPI.create(vehicleId, {
                                ...event,
                                date: new Date(event.date),
                                mileage: parseInt(String(event.mileage)),
                                cost: event.cost ? parseFloat(String(event.cost)) : null,
                            })
                        )
                    );
                }

                alert('Vehicle created successfully!');
            }

            navigate('/dashboard');
        } catch (error: any) {
            console.error('Error saving vehicle:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error details:', error.message);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to save vehicle';
            alert(errorMessage);
        } finally {
            setLoading(false);
            setUploadingImages(false);
        }
    };

    const commonFeatures = [
        'Leather Seats',
        'Sunroof',
        'Navigation',
        'Backup Camera',
        'Bluetooth',
        'Cruise Control',
        'Heated Seats',
        'Premium Sound',
        'Parking Sensors',
        'Keyless Entry',
        'Adaptive Cruise',
        'Lane Assist',
    ];

    return (
        <div className="container max-w-4xl py-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>

            <h1 className="text-3xl font-bold mb-8">{isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle>Vehicle Images</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="images">Upload Images</Label>
                            <div className="mt-2 flex items-center gap-4">
                                <label
                                    htmlFor="images"
                                    className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-input rounded-md hover:bg-accent"
                                >
                                    <Upload className="h-4 w-4" />
                                    <span>Choose Files</span>
                                </label>
                                <input
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                <span className="text-sm text-muted-foreground">
                                    {imageFiles.length} file(s) selected
                                </span>
                            </div>
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {imagePreviews.map((preview, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Preview ${idx + 1}`}
                                            className="w-full h-32 object-cover rounded border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="make">Make *</Label>
                                <Input id="make" name="make" value={formData.make} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="model">Model *</Label>
                                <Input id="model" name="model" value={formData.model} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="year">Year *</Label>
                                <Input
                                    id="year"
                                    name="year"
                                    type="number"
                                    value={formData.year}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="condition">Condition *</Label>
                                <select
                                    id="condition"
                                    name="condition"
                                    value={formData.condition}
                                    onChange={handleChange}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                                    required
                                >
                                    <option value="NEW">New</option>
                                    <option value="USED">Used</option>
                                    <option value="CERTIFIED_PRE_OWNED">Certified Pre-Owned</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="price">Price (TND) *</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="vin">VIN *</Label>
                                <Input id="vin" name="vin" value={formData.vin} onChange={handleChange} required />
                            </div>
                            <div>
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="City, State"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="purchaseDate">Purchase Date *</Label>
                                <Input
                                    id="purchaseDate"
                                    name="purchaseDate"
                                    type="date"
                                    value={formData.purchaseDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="currentMileage">Current Mileage (km) *</Label>
                                <Input
                                    id="currentMileage"
                                    name="currentMileage"
                                    type="number"
                                    value={formData.currentMileage}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Mechanic Certification */}
                <Card>
                    <CardHeader>
                        <CardTitle>Mechanic Certification</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="mechanicCertified"
                                checked={formData.mechanicCertified}
                                onChange={handleChange}
                                className="w-5 h-5 rounded"
                            />
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold">This vehicle is mechanic certified</p>
                                    <p className="text-sm text-muted-foreground">
                                        Vehicle has been inspected and certified by a professional mechanic
                                    </p>
                                </div>
                            </div>
                        </label>
                    </CardContent>
                </Card>

                {/* Timeline Events */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Vehicle History Timeline (Optional)</CardTitle>
                            <Button type="button" onClick={handleAddTimelineEvent} size="sm" variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Event
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {timelineEvents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No timeline events added. Click "Add Event" to record maintenance history, repairs, or other
                                important events.
                            </p>
                        ) : (
                            timelineEvents.map((event, idx) => (
                                <Card key={idx} className="border-2">
                                    <CardContent className="pt-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-semibold">Event #{idx + 1}</h4>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeTimelineEvent(idx)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Event Type</Label>
                                                <select
                                                    value={event.eventType}
                                                    onChange={(e) => handleTimelineEventChange(idx, 'eventType', e.target.value)}
                                                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                                                >
                                                    <option value="PURCHASE">Purchase</option>
                                                    <option value="MAINTENANCE">Maintenance</option>
                                                    <option value="UPGRADE">Upgrade</option>
                                                    <option value="ACCIDENT">Accident</option>
                                                    <option value="REPAIR">Repair</option>
                                                    <option value="PARTS_REPLACED">Parts Replaced</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label>Date</Label>
                                                <Input
                                                    type="date"
                                                    value={event.date}
                                                    onChange={(e) => handleTimelineEventChange(idx, 'date', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Mileage (km)</Label>
                                                <Input
                                                    type="number"
                                                    value={event.mileage}
                                                    onChange={(e) => handleTimelineEventChange(idx, 'mileage', e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <Label>Cost (TND)</Label>
                                                <Input
                                                    type="number"
                                                    value={event.cost}
                                                    onChange={(e) => handleTimelineEventChange(idx, 'cost', e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Label>Title</Label>
                                                <Input
                                                    value={event.title}
                                                    onChange={(e) => handleTimelineEventChange(idx, 'title', e.target.value)}
                                                    placeholder="e.g., Oil Change, Brake Replacement"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <Label>Description</Label>
                                                <textarea
                                                    value={event.description}
                                                    onChange={(e) =>
                                                        handleTimelineEventChange(idx, 'description', e.target.value)
                                                    }
                                                    className="w-full min-h-20 rounded-md border border-input bg-background px-3 py-2"
                                                    placeholder="Describe what was done..."
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Specifications */}
                <Card>
                    <CardHeader>
                        <CardTitle>Specifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="fuelType">Fuel Type</Label>
                                <select
                                    id="fuelType"
                                    name="fuelType"
                                    value={formData.fuelType}
                                    onChange={handleChange}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                                >
                                    <option value="Gasoline">Gasoline</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="transmission">Transmission</Label>
                                <select
                                    id="transmission"
                                    name="transmission"
                                    value={formData.transmission}
                                    onChange={handleChange}
                                    className="w-full h-10 rounded-md border border-input bg-background px-3"
                                >
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                    <option value="CVT">CVT</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="engine">Engine</Label>
                                <Input
                                    id="engine"
                                    name="engine"
                                    value={formData.engine}
                                    onChange={handleChange}
                                    placeholder="2.0L 4-Cylinder"
                                />
                            </div>
                            <div>
                                <Label htmlFor="color">Color</Label>
                                <Input id="color" name="color" value={formData.color} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <Label>Features</Label>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                {commonFeatures.map((feature) => (
                                    <label key={feature} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.features.includes(feature)}
                                            onChange={() => handleFeatureToggle(feature)}
                                            className="rounded"
                                        />
                                        <span className="text-sm">{feature}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Description */}
                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="description">Vehicle Description *</Label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full min-h-32 rounded-md border border-input bg-background px-3 py-2 mt-2"
                            placeholder="Describe your vehicle..."
                            required
                        />
                    </CardContent>
                </Card>

                {/* Status */}
                <Card>
                    <CardHeader>
                        <CardTitle>Listing Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full h-10 rounded-md border border-input bg-background px-3 mt-2"
                        >
                            <option value="DRAFT">Save as Draft</option>
                            <option value="PUBLISHED">Publish Now</option>
                        </select>
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex gap-4">
                    <Button type="submit" size="lg" disabled={loading || uploadingImages}>
                        {uploadingImages ? 'Uploading Images...' : loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Vehicle' : 'Create Vehicle')}
                    </Button>
                    <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
