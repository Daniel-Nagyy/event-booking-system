const Event = require('../Models/Event');
const Booking = require('../Models/Booking');

// Keywords and their responses
const INTENTS = {
  greeting: {
    keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      "Hello! Welcome to EventHub. How can I assist you today? 🎉",
      "Hi there! I'm here to help you with events and bookings. What would you like to know?",
      "Hey! Looking for events or need help with bookings? I'm here for you! 😊"
    ]
  },
  booking: {
    keywords: ['book', 'booking', 'reserve', 'buy ticket', 'purchase', 'how to book'],
    responses: [
      "To book a ticket:\n\n1️⃣ Browse events on our Events page\n2️⃣ Click on an event you like\n3️⃣ Select ticket type and quantity\n4️⃣ Click 'Book Now'\n5️⃣ You'll receive a QR code ticket via email instantly! 📧\n\nNeed help finding events?",
      "Booking is easy! Just find an event, choose your tickets, and checkout. Your QR code ticket will be sent to your email immediately. Want me to show you upcoming events?"
    ]
  },
  cancellation: {
    keywords: ['cancel', 'refund', 'cancel booking', 'delete booking'],
    responses: [
      "To cancel a booking:\n\n1️⃣ Go to 'My Bookings' in your profile\n2️⃣ Find the booking you want to cancel\n3️⃣ Click the 'Cancel' button\n\n⚠️ Note: Cancellations must be made at least 48 hours before the event for a full refund.",
      "You can cancel from the 'My Bookings' page. Refunds are processed within 5-7 business days for cancellations made 48+ hours before the event."
    ]
  },
  ticket: {
    keywords: ['ticket', 'qr code', 'qr', 'receive ticket', 'where is my ticket'],
    responses: [
      "Your QR code ticket is sent to your email immediately after booking! 📧\n\nYou can also:\n• View it in 'My Bookings'\n• Download it as an image\n• Print it out\n\nJust show the QR code at the event entrance!",
      "Tickets are digital QR codes. Check your email or visit 'My Bookings' to view/download your ticket. No paper needed! 🎫"
    ]
  },
  events: {
    keywords: ['event', 'events', 'what events', 'upcoming', 'show events', 'find event'],
    responses: [
      "I can help you find events! Let me fetch the latest upcoming events for you... 🎪",
      "Looking for events? Let me show you what's coming up! 🎉"
    ],
    fetchEvents: true
  },
  payment: {
    keywords: ['payment', 'pay', 'credit card', 'payment method', 'how to pay'],
    responses: [
      "We accept:\n💳 Credit cards (Visa, Mastercard, Amex)\n💳 Debit cards\n💰 Digital wallets\n\nAll payments are secure and encrypted. Your card details are never stored on our servers!",
      "Payment is secure and easy! We support all major credit/debit cards. Your transaction is encrypted and safe. 🔒"
    ]
  },
  organizer: {
    keywords: ['create event', 'organize', 'organizer', 'host event', 'my event'],
    responses: [
      "Want to organize an event? Great! 🎊\n\nHere's how:\n1️⃣ Sign up as an Organizer\n2️⃣ Create your event with details\n3️⃣ Wait for admin approval\n4️⃣ Start selling tickets!\n\nYou'll get:\n✅ QR code scanner\n✅ Analytics dashboard\n✅ Revenue tracking",
      "As an organizer, you can create events, track bookings, and scan tickets. Create your organizer account to get started!"
    ]
  },
  help: {
    keywords: ['help', 'support', 'contact', 'problem', 'issue'],
    responses: [
      "I'm here to help! You can:\n\n📧 Email: noorjjj2006@gmail.com\n💬 Use this chat for quick answers\n📝 Submit a contact form\n\nWhat specific issue are you facing?",
      "Need assistance? Our support team is ready to help!\n\n📧 noorjjj2006@gmail.com\n\nOr tell me what you need help with and I'll guide you! 😊"
    ]
  },
  price: {
    keywords: ['price', 'cost', 'how much', 'expensive', 'cheap'],
    responses: [
      "Event prices vary based on:\n• Event type and category\n• Ticket type (VIP, Standard, etc.)\n• Organizer pricing\n\nBrowse events to see specific prices. Most events have multiple ticket options! 🎫",
      "Prices depend on the event and ticket type. Check out our Events page to see all options and prices!"
    ]
  },
  account: {
    keywords: ['account', 'profile', 'sign up', 'register', 'login'],
    responses: [
      "Account features:\n\n👤 Profile: Update your info and photo\n🎟️ My Bookings: View all your tickets\n📊 Dashboard: For organizers\n\nNot registered yet? Sign up in seconds!",
      "You can manage everything from your profile! View bookings, update info, and more. Need help with account settings?"
    ]
  }
};

// Default responses when no match found
const DEFAULT_RESPONSES = [
  "I'm not sure I understand. Could you rephrase that? Here are some things I can help with:\n\n📅 Finding events\n🎫 Booking tickets\n❌ Cancellations\n💳 Payment info\n📧 Support contact",
  "Hmm, I didn't quite catch that. Try asking about:\n• Upcoming events\n• How to book tickets\n• Cancellation policy\n• Payment methods\n• Organizing events",
  "I'm here to help! I can assist with bookings, events, cancellations, and more. What would you like to know?"
];

// Find intent based on keywords
const detectIntent = (message) => {
  const lowerMessage = message.toLowerCase();
  
  for (const [intent, data] of Object.entries(INTENTS)) {
    for (const keyword of data.keywords) {
      if (lowerMessage.includes(keyword)) {
        return intent;
      }
    }
  }
  
  return 'default';
};

// Get random response from array
const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

// Main chat handler
exports.chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Detect intent
    const intent = detectIntent(message);
    
    let reply = '';
    let additionalData = null;

    if (intent === 'default') {
      reply = getRandomResponse(DEFAULT_RESPONSES);
    } else {
      const intentData = INTENTS[intent];
      reply = getRandomResponse(intentData.responses);

      // Fetch events if requested
      if (intentData.fetchEvents) {
        const upcomingEvents = await Event.find({
          status: 'approved',
          date: { $gte: new Date() }
        })
          .sort({ date: 1 })
          .limit(5)
          .select('title date location category ticketTypes');

        if (upcomingEvents.length > 0) {
          reply += '\n\n🎪 Upcoming Events:\n\n';
          upcomingEvents.forEach((event, index) => {
            const eventDate = new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });
            const minPrice = Math.min(...event.ticketTypes.map(t => t.price));
            reply += `${index + 1}. ${event.title}\n`;
            reply += `   📅 ${eventDate} | 📍 ${event.location}\n`;
            reply += `   💰 From $${minPrice}\n\n`;
          });
          reply += 'Visit our Events page to book! 🎫';

          additionalData = { events: upcomingEvents };
        } else {
          reply += '\n\nNo upcoming events right now. Check back soon! 🔜';
        }
      }

      // Add user context if authenticated
      if (userId && (intent === 'booking' || intent === 'account')) {
        const userBookings = await Booking.find({ user: userId })
          .populate('event', 'title date')
          .limit(3)
          .sort({ createdAt: -1 });

        if (userBookings.length > 0) {
          reply += '\n\n📋 Your Recent Bookings:\n';
          userBookings.forEach((booking, index) => {
            reply += `${index + 1}. ${booking.event.title} - ${booking.bookingStatus}\n`;
          });
        }
      }
    }

    res.json({
      reply,
      intent,
      additionalData,
      conversationHistory: [] // Not needed for rule-based
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      reply: "I'm having trouble right now. Please contact support at noorjjj2006@gmail.com or try again later. 😔"
    });
  }
};

// Quick responses
exports.getQuickResponses = (req, res) => {
  const responses = [
    { id: 1, text: "Show me upcoming events", category: "events" },
    { id: 2, text: "How do I book a ticket?", category: "booking" },
    { id: 3, text: "How can I cancel my booking?", category: "cancellation" },
    { id: 4, text: "Where is my ticket?", category: "ticket" },
    { id: 5, text: "What payment methods do you accept?", category: "payment" },
    { id: 6, text: "How do I organize an event?", category: "organizer" }
  ];

  res.json({ quickResponses: responses });
};

// Get event-specific help
exports.getEventHelp = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findById(eventId)
      .populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventDate = new Date(event.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const helpInfo = {
      event: {
        title: event.title,
        date: event.date,
        location: event.location,
        ticketTypes: event.ticketTypes
      },
      faqs: [
        {
          question: "Where is this event?",
          answer: `📍 ${event.location}`
        },
        {
          question: "When is this event?",
          answer: `📅 ${eventDate} at ${event.time}`
        },
        {
          question: "What ticket types are available?",
          answer: event.ticketTypes.map(t => `${t.name}: $${t.price} (${t.remaining} left)`).join('\n')
        },
        {
          question: "How many tickets are left?",
          answer: `${event.remainingTickets} tickets remaining out of ${event.totalTickets}`
        },
        {
          question: "Who is organizing this event?",
          answer: `Organized by ${event.organizer.name}`
        }
      ]
    };

    res.json(helpInfo);

  } catch (error) {
    console.error('Event help error:', error);
    res.status(500).json({ error: 'Failed to get event help' });
  }
};