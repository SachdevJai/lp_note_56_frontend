import fetch from 'node-fetch';  // Vercel supports 'node-fetch' out of the box
import config from '../envvarsconfig';  // Import the environment variables

export default async function handler(req, res) {

    try {
        // Forward the incoming request to the EC2 backend
        const response = await fetch(`${config.BACKEND_URL}${req.url}`, {
            method: req.method,  // Forward the method (GET, POST, etc.)
            headers: {
                ...req.headers,  // Forward the request headers
                'Content-Type': 'application/json',  // Optional: Add content type if necessary
            },
            body: req.method === 'POST' ? JSON.stringify(req.body) : undefined,  // Forward request body if it's a POST request
        });

        // Forward the backend response to the frontend
        const data = await response.json();
        res.status(response.status).json(data);  // Send the backend response to the frontend
    } catch (error) {
        // Handle any errors that occur while forwarding the request
        console.error(error);
        res.status(500).json({ message: 'Error forwarding the request' });
    }
}
