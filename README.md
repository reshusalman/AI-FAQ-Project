# AnswerBot – AI-powered FAQ and Customer Support Automation

## 1. Requirements
- Node.js 18+
- npm 9+
- MongoDB local or MongoDB Atlas
- VS Code
- Postman or Thunder Client
- Gemini API key

## 2. Installation
```bash
npm install
```
Copy `.env.example` to `.env` and fill in `MONGO_URI`, `JWT_SECRET`, and `GEMINI_API_KEY`.

## 3. Run
```bash
npm run dev
```
Server: `http://localhost:5000`

## 4. API testing
### Register
POST `/api/auth/register`
```json
{"name":"Priya Sharma","email":"priya@writeflow.com","password":"securepassword123","role":"creator"}
```

### Login
POST `/api/auth/login`
```json
{"email":"priya@writeflow.com","password":"securepassword123"}
```
Copy the returned token.

### Create FAQ
POST `/api/faqs`
Header: `Authorization: Bearer YOUR_TOKEN`
```json
{"question":"How do I configure custom category tags?","answer":"Navigate to the settings panel and save the category tags.","category":"Configuration"}
```

### Search
GET `/api/faqs/search?q=configure`

### Generate FAQ with Gemini
POST `/api/ai/generate-faq`
Header: `Authorization: Bearer YOUR_TOKEN`
```json
{"topic":"Mongoose schema indexing validation runtime workflow optimization"}
```

### Generate and save as unpublished FAQ
```json
{"topic":"MongoDB indexing","save":true}
```

### AI answer
POST `/api/ai/answer`
Header: `Authorization: Bearer YOUR_TOKEN`
```json
{"question":"How can I search configuration FAQs?"}
```

### Public FAQ list
GET `/api/faqs`

### Categories
GET `/api/categories`

## 5. Role model
- `admin`: all management operations
- `creator`: create/update/delete own FAQs and use AI
- `user`: authenticated profile access and AI answer generation
- public: published FAQ listing/search

## 6. Folder structure
```text
answerbot/
├── src/
│   ├── config/db.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── categoryController.js
│   │   └── faqController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Category.js
│   │   ├── FAQ.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── faqRoutes.js
│   ├── services/aiService.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```
