import { useState } from 'react';
import { messageAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Send } from 'lucide-react';

interface MessagingModalProps {
    isOpen: boolean;
    onClose: () => void;
    receiverId: string;
    receiverName: string;
    vehicleId?: string;
    vehicleTitle?: string;
    isOffer?: boolean;
}

export default function MessagingModal({
    isOpen,
    onClose,
    receiverId,
    receiverName,
    vehicleId,
    vehicleTitle,
    isOffer,
}: MessagingModalProps) {
    const { user } = useAuthStore();
    const [subject, setSubject] = useState(
        isOffer ? `Offer for ${vehicleTitle}` : `Inquiry about ${vehicleTitle}`
    );
    const [message, setMessage] = useState(
        isOffer
            ? `Hi, I'm interested in making an offer for your ${vehicleTitle}. I'd like to discuss the price and details.`
            : ''
    );
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) {
            alert('Please enter a message');
            return;
        }

        setSending(true);
        try {
            await messageAPI.send({
                receiverId,
                vehicleId,
                subject,
                content: message,
            });
            alert('Message sent successfully!');
            onClose();
            setMessage('');
            setSubject('');
        } catch (error: any) {
            console.error('Error sending message:', error);
            alert(error.response?.data?.error || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (!isOpen) return null;

    if (!user) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6">
                        <p className="text-center mb-4">Please login to send messages</p>
                        <Button onClick={onClose} className="w-full">
                            Close
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{isOffer ? 'Make an Offer' : 'Contact Seller'}</CardTitle>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Sending to: <span className="font-semibold">{receiverName}</span>
                        </p>
                        {vehicleTitle && (
                            <p className="text-sm text-muted-foreground">
                                Vehicle: <span className="font-semibold">{vehicleTitle}</span>
                            </p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Message subject"
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <Label htmlFor="message">Message</Label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full min-h-32 rounded-md border border-input bg-background px-3 py-2 mt-2"
                            placeholder="Type your message..."
                            required
                        />
                    </div>

                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSend} disabled={sending}>
                            <Send className="mr-2 h-4 w-4" />
                            {sending ? 'Sending...' : 'Send Message'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
