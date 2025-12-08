# How Messaging Works - Step by Step

## Sending a Message (Sender)

1. **Go to any vehicle detail page** (e.g., `/vehicles/some-id`)
2. **Click "Contact Seller" or "Make an Offer"** button
3. **Fill in the modal** with your message
4. **Click "Send Message"**
5. ✅ Message is sent to the vehicle owner

## Receiving Messages (Receiver)

Messages appear in **ONE specific place**: the Messages page at `/messages`

### How to Access Messages:

1. **Log in as the receiver** (the person who owns the vehicle)
2. **Navigate to `/messages`** in your browser
   - Direct URL: `http://localhost:5173/messages`
   - Or add a link in your navigation menu

3. **You'll see:**
   - **Left side**: List of conversations
   - **Right side**: Selected conversation messages

### What You Should See:

```
┌─────────────────────────────────────────────────────────┐
│                      Messages                            │
├──────────────────┬──────────────────────────────────────┤
│  Conversations   │         Selected Conversation        │
├──────────────────┤                                      │
│ ● John Doe       │  John Doe                            │
│   2024 BMW M3    │  Re: 2024 BMW M3                     │
│   "Hi, I'm..."   │                                      │
│                  │  ┌────────────────────────────────┐  │
│ ○ Jane Smith     │  │ Hi, I'm interested in your    │  │
│   2023 Audi A4   │  │ vehicle. Is it still...       │  │
│   "Is this..."   │  │                    [Received]  │  │
│                  │  └────────────────────────────────┘  │
│                  │                                      │
│                  │  ┌────────────────────────────────┐  │
│                  │  │ Yes, it's still available!    │  │
│                  │  │               [You - Sent]     │  │
│                  │  └────────────────────────────────┘  │
│                  │                                      │
│                  │  [Type your message here...    Send] │
└──────────────────┴──────────────────────────────────────┘
```

## Testing the Full Flow:

### Scenario: User A wants to contact User B about a vehicle

1. **User B creates a vehicle** (owns the vehicle)
2. **User A views the vehicle** at `/vehicles/{vehicle-id}`
3. **User A clicks "Contact Seller"**
4. **User A sends message**: "Hi, is this vehicle still available?"
5. **User B logs in and goes to `/messages`**
6. **User B sees conversation** with User A in the left sidebar
7. **User B clicks on the conversation** to read the message
8. **User B can reply** in the message input at the bottom

## Important Notes:

✅ **Messages are NOT shown as notifications** (no popup alerts)  
✅ **Receiver must navigate to `/messages` page** to see them  
✅ **Messages persist in database** - they don't disappear  
✅ **Unread count shows** as a badge on conversations  
✅ **Auto-marked as read** when you open the conversation  

## Adding a Messages Link to Navigation

To make it easier for users to access messages, you should add a link in your navbar:

**In `Navbar.tsx` (for logged-in users):**
```tsx
<Link to="/messages">
    <Button variant="ghost">
        Messages
        {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
    </Button>
</Link>
```

## Current Route:

The route already exists in your app:
- **Route**: `/messages`  
- **Component**: `MessagesPage`
- **Protection**: ✅ Requires login (protected route)

---

## Quick Test Checklist:

- [ ] Can you navigate to `http://localhost:5173/messages`?
- [ ] Are you logged in?
- [ ] Have you sent at least one message from another account?
- [ ] Do you see the conversations list?
- [ ] What errors (if any) appear in browser console?

If you see errors, check browser console (F12) and share the error message!
