// ============================================
// WEBSOCKET SERVER FOR REAL-TIME NEWS
// ============================================

const express = require("express");
const app = express();

app.use(express.json());

const WebSocket = require('ws');
const http = require('http');

// Sample news data generator
const categories = ['technology', 'business', 'sports', 'entertainment', 'health', 'politics', 'science'];
const sources = ['cnn', 'bbc', 'reuters', 'ap', 'nytimes', 'guardian'];
const statuses = ['breaking', 'published', 'draft'];
const authors = ['Sarah Chen', 'Mike Johnson', 'Emma Wilson', 'Alex Rivera', 'Lisa Park', 'David Kim', 'Maria Garcia'];

const headlines = [
    'AI Breakthrough in Medical Diagnosis',
    'Global Markets Rally as Inflation Cools',
    'Champions League Final Shocks Fans',
    'New Cancer Treatment Shows Promise',
    'Hollywood Strike Ends with Deal',
    'SpaceX Launches New Satellite Constellation',
    'Federal Reserve Signals Rate Cut',
    'World Cup Qualifiers Drama',
    'Album Breaks Streaming Records',
    'Climate Summit Reaches Agreement',
    'Quantum Computing Milestone Achieved',
    'Tech Giants Face New Regulations',
    'Mental Health Crisis Among Youth',
    'Stock Market Tech Sector Recovery',
    'New Species Discovered in Deep Ocean',
    'Revolutionary Battery Technology Unveiled',
    'Major Cybersecurity Threat Detected',
    'Breakthrough in Fusion Energy Research',
    'New AI Model Beats Human Performance',
    'Global Climate Initiative Launched'
];

function generateNewsItem() {
    const id = Date.now() + Math.random() * 1000;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const status = Math.random() > 0.7 ? 'breaking' : 'published';
    
    return {
        id: Math.floor(id),
        title: headlines[Math.floor(Math.random() * headlines.length)],
        category: category,
        source: source,
        published: 'Just now',
        timestamp: Date.now(),
        status: status,
        summary: `Breaking news update from ${source}. This is a real-time update about ${category}.`,
        author: authors[Math.floor(Math.random() * authors.length)],
        url: '#'
    };
}

// Create HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('WebSocket Server is running');
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// Broadcast to all clients
function broadcast(data) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Generate random news updates
function generateRandomUpdate() {
    const isBreaking = Math.random() > 0.6;
    const article = generateNewsItem();
    
    if (isBreaking) {
        broadcast({
            type: 'breaking_news',
            data: article,
            timestamp: new Date().toISOString()
        });
    } else {
        broadcast({
            type: 'new_article',
            data: article,
            timestamp: new Date().toISOString()
        });
    }
}

// Send initial data to new client
function sendInitialData(ws) {
    const initialData = [];
    for (let i = 0; i < 15; i++) {
        initialData.push(generateNewsItem());
    }
    ws.send(JSON.stringify({
        type: 'initial_data',
        data: initialData,
        timestamp: new Date().toISOString()
    }));
}

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('🟢 Client connected');
    clients.add(ws);

    // Send initial data
    sendInitialData(ws);

    // Handle incoming messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('📩 Received:', data);
            
            // Handle different message types
            switch(data.type) {
                case 'ping':
                    ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
                    break;
                case 'subscribe':
                    // Client can subscribe to specific categories
                    console.log(`📰 Client subscribed to: ${data.category || 'all'}`);
                    break;
                case 'get_stats':
                    ws.send(JSON.stringify({
                        type: 'stats',
                        data: {
                            articles: Math.floor(Math.random() * 10000) + 5000,
                            alerts: Math.floor(Math.random() * 2000) + 1000,
                            breaking: Math.floor(Math.random() * 50) + 10,
                            sources: Math.floor(Math.random() * 10) + 20
                        },
                        timestamp: new Date().toISOString()
                    }));
                    break;
                default:
                    console.log('Unknown message type:', data.type);
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('🔴 Client disconnected');
        clients.delete(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

// Send real-time updates every 3-8 seconds
setInterval(() => {
    if (clients.size > 0) {
        generateRandomUpdate();
        console.log(`📤 Sent update to ${clients.size} clients`);
    }
}, Math.random() * 5000 + 3000);

// Send stats update every 10 seconds
setInterval(() => {
    if (clients.size > 0) {
        broadcast({
            type: 'stats_update',
            data: {
                articles: Math.floor(Math.random() * 10000) + 5000,
                alerts: Math.floor(Math.random() * 2000) + 1000,
                breaking: Math.floor(Math.random() * 50) + 10,
                sources: Math.floor(Math.random() * 10) + 20
            },
            timestamp: new Date().toISOString()
        });
    }
}, 10000);

let news = [];

app.post("/news", (req, res) => {
    const article = {
        id: Date.now(),
        ...req.body
    };

    news.push(article);

    res.status(201).json({
        success: true,
        message: "News added successfully",
        data: article
    });
});

app.get("/news", (req, res) => {
    res.json(news);
});

// Start server
const PORT = 8080;
app.listen(3000, () => {
    console.log("REST API running on http://localhost:3000");
});

server.listen(8080, () => {
    console.log("WebSocket running on ws://localhost:8080");
});