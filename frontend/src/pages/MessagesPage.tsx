import { useState, useEffect } from 'react';
import { messageAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/utils';
import { Mail, Send, User, Car } from 'lucide-react';

export default function MessagesPage() {
    const { user } = useAuthStore();
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation.otherUser.id, selectedConversation.vehicle?.id);
        }
    }, [selectedConversation]);

    const fetchConversations = async () => {
        try {
            console.log('Fetching conversations...');
            const { data } = await messageAPI.getConversations();
            console.log('Conversations loaded:', data);
            setConversations(data);
        } catch (error: any) {
            console.error('Error fetching conversations:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (otherUserId: string, vehicleId?: string) => {
        try {
            const { data } = await messageAPI.getMessages(otherUserId, vehicleId);
            setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        setSending(true);
        try {
            await messageAPI.send({
                receiverId: selectedConversation.otherUser.id,
                vehicleId: selectedConversation.vehicle?.id,
                content: newMessage,
            });
            setNewMessage('');
            await fetchMessages(selectedConversation.otherUser.id, selectedConversation.vehicle?.id);
        } catch (error: any) {
            console.error('Error sending message:', error);
            alert(error.response?.data?.error || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="container py-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="container py-8">
            <h1 className="text-3xl font-bold mb-8">Messages</h1>

            <div className="grid md:grid-cols-3 gap-6 h-[600px]">
                {/* Conversations List */}
                <Card className="md:col-span-1 overflow-auto">
                    <CardHeader>
                        <CardTitle className="text-lg">Conversations</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {conversations.length === 0 ? (
                            <div className="p-6 text-center text-muted-foreground">
                                <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No conversations yet</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {conversations.map((conv, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`w-full p-4 text-left hover:bg-accent transition-colors ${selectedConversation === conv ? 'bg-accent' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <User className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold truncate">
                                                        {conv.otherUser.firstName} {conv.otherUser.lastName}
                                                    </p>
                                                    {conv.unreadCount > 0 && (
                                                        <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                                            {conv.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                                {conv.vehicle && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                                                        <Car className="h-3 w-3" />
                                                        <span className="truncate">
                                                            {conv.vehicle.year} {conv.vehicle.make} {conv.vehicle.model}
                                                        </span>
                                                    </div>
                                                )}
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {conv.lastMessage.content.substring(0, 50)}...
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Messages View */}
                <Card className="md:col-span-2 flex flex-col">
                    {selectedConversation ? (
                        <>
                            <CardHeader className="border-b">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">
                                            {selectedConversation.otherUser.firstName}{' '}
                                            {selectedConversation.otherUser.lastName}
                                        </CardTitle>
                                        {selectedConversation.vehicle && (
                                            <p className="text-sm text-muted-foreground">
                                                Re: {selectedConversation.vehicle.year} {selectedConversation.vehicle.make}{' '}
                                                {selectedConversation.vehicle.model}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            {/* Messages */}
                            <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                                {messages.map((msg) => {
                                    const isMine = msg.senderId === user?.id;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-lg p-3 ${isMine
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted'
                                                    }`}
                                            >
                                                {msg.subject && (
                                                    <p className="font-semibold text-sm mb-1">{msg.subject}</p>
                                                )}
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                                <p
                                                    className={`text-xs mt-1 ${isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                                        }`}
                                                >
                                                    {formatDate(msg.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>

                            {/* Message Input */}
                            <div className="border-t p-4">
                                <div className="flex gap-2">
                                    <Input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <CardContent className="flex items-center justify-center h-full">
                            <div className="text-center text-muted-foreground">
                                <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <p>Select a conversation to view messages</p>
                            </div>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
}
