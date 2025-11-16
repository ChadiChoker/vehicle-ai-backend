
# Vehicle AI Backend

This backend service provides REST APIs to create vehicle inspections, upload photos, run AI-powered damage detection, and fetch detailed results. Features include Swagger API docs, Docker support, CI integration, and seamless deployment on Render.




## Getting Started

Clone repo: git clone https://github.com/ChadiChoker/vehicle-ai-backend.git

Install dependencies: npm install

Create .env file:

PORT=8000
HF_API_KEY=your_huggingface_api_key
HF_API_URL=https://router.huggingface.co/hf-inference


Run locally: npm run dev

Run production: npm start


## API Documentation 

Swagger docs are available at /api/docs after running the backend. Example: http://localhost:8000/api/docs


## Available Endpoints

POST /api/inspections - Create new inspection

POST /api/inspections/:inspectionId/photos - Upload photo

POST /api/inspections/:inspectionId/analyze - Run AI damage analysis

GET /api/inspections/:inspectionId/results - Get damage results


## Docker

Build: docker build -t vehicle-ai-backend .

Run: docker run -p 8000:8000 --env-file .env vehicle-ai-backend


## Deployment

Recommended on Render.com or any Node.js compatible host

Use npm install and npm start commands

Add .env variables on the host platform
## Tech Stack

Node.js, Express, Multer, Swagger, Docker, Render, Hugging Face API
## Testing

This project includes automated tests to ensure reliability and correctness.

Run all tests with:

npm test


Tests cover core API functionality and critical workflows. Ensure all tests pass before pushing changes or deploying.

You can integrate these tests into your CI pipeline to enforce quality on every push.


## Future Improvements

Given more time and resources, the following enhancements could significantly improve this project:

Advanced Deployment:
Integrate with scalable cloud platforms like AWS Elastic Beanstalk, Google Cloud Run, or Kubernetes clusters for better availability, auto-scaling, and fault tolerance.

Enhanced Security:
Implement OAuth2 or OpenID Connect for authentication, add rate limiting, and strengthen data encryption for sensitive user information.

Real-time Features:
Add WebSocket support for real-time status updates, live notifications on inspection progress, or damage detection alerts.

AI Model Integration:
Integrate more sophisticated machine learning models to improve vehicle damage assessment accuracy and add predictive maintenance features.

Comprehensive Monitoring & Logging:
Use tools like Prometheus, Grafana, or ELK stack to monitor app performance and detect issues proactively.

Extensive Testing:
Expand test coverage with end-to-end (E2E) tests and performance testing to ensure robustness under load.

API Versioning & Documentation:
Implement versioning for APIs to support backward compatibility and improve developer experience with richer, interactive API documentation.

# URLs for Reference

Local development: http://localhost:8000/

Deployed backend (Render): https://vehicle-ai-backend.onrender.com/

Use these URLs to test your API in staging and production environments.