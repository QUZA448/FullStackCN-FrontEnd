# DevForum Frontend

A modern, fully-functional React frontend for a Stack Overflow-like forum application.

## Project Structure

```
forum-frontend-app/
├── public/
│   └── index.html                 # Main HTML template
├── src/
│   ├── components/
│   │   └── Header.js              # Navigation & search bar
│   ├── pages/
│   │   ├── HomePage.js            # Questions list & filters
│   │   ├── QuestionDetailPage.js  # Single question + answers
│   │   ├── AskQuestionPage.js     # Create new question
│   │   ├── LoginPage.js           # User login
│   │   ├── RegisterPage.js        # User registration
│   │   ├── ProfilePage.js         # User profile & stats
│   │   └── TagsPage.js            # All tags listing
│   ├── services/
│   │   └── api.js                 # API client with axios
│   ├── store/
│   │   ├── authReducer.js         # Redux auth reducer
│   │   └── index.js               # Redux store config
│   ├── hooks/
│   │   └── index.js               # Custom hooks (useAuth, useFetch)
│   ├── App.js                     # Main app with routing
│   ├── App.css                    # App styles
│   ├── index.js                   # React entry point
│   └── index.css                  # Global styles
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
├── tailwind.config.js             # Tailwind CSS config
├── postcss.config.js              # PostCSS config
├── package.json                   # Dependencies & scripts
└── README.md                      # This file
```

## Getting Started

### Prerequisites
- Node.js 14+ and npm/yarn
- Backend API running on `http://localhost:5000`

### Installation

1. **Extract the project**
   ```bash
   unzip forum-frontend-app.zip
   cd forum-frontend-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env if needed (default points to localhost:5000)
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   App will open at `http://localhost:3000`

## Features Implemented

### Authentication
- User registration with email validation
- Login with JWT tokens
- Auto-logout on token expiration
- Redux state management for auth

### Questions
- List all questions with filters (newest, trending, unanswered)
- View question details with all answers
- Create new questions with tags
- Edit/delete own questions
- View count tracking

### Answers
- Post answers to questions
- Vote on answers (upvote/downvote)
- Mark best answer (question owner only)
- Edit/delete own answers

### Voting System
- Upvote/downvote questions and answers
- Real-time reputation updates
- Prevent voting on own content
- Vote removal support

### Tags
- Browse all tags
- Filter questions by tags
- Create new tags when asking
- Tag suggestions

### User Profiles
- View user reputation points
- See all user's questions
- See all user's answers
- User stats dashboard

### Search & Discovery
- Search questions by title
- Filter by tags
- Browse trending/unanswered
- Tag-based filtering

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | React 18 |
| Routing | React Router v6 |
| State Management | Redux + Redux Thunk |
| HTTP Client | Axios |
| Styling | Tailwind CSS |
| Build Tool | React Scripts |

## API Integration

### Authentication Endpoints
```
POST /api/auth/register     - Create account
POST /api/auth/login        - Get JWT token
POST /api/auth/logout       - Clear session
```

### Questions Endpoints
```
GET    /api/questions                      - List questions
GET    /api/questions/:id                  - Get question detail
POST   /api/questions                      - Create question
PUT    /api/questions/:id                  - Update question
DELETE /api/questions/:id                  - Delete question
```

### Answers Endpoints
```
POST   /api/questions/:id/answers          - Post answer
PUT    /api/answers/:id                    - Update answer
DELETE /api/answers/:id                    - Delete answer
PATCH  /api/answers/:id/mark-best          - Mark as best
```

### Voting Endpoints
```
POST   /api/votes                          - Vote (up/down)
DELETE /api/votes/:id                      - Remove vote
```

### Users Endpoints
```
GET    /api/users/:id                      - Get profile
GET    /api/users/:id/questions            - User's questions
GET    /api/users/:id/answers              - User's answers
```

### Tags Endpoints
```
GET    /api/tags                           - All tags
GET    /api/tags/:name/questions           - Questions by tag
```

## UI/UX Features

- **Responsive Design** - Mobile, tablet, desktop compatible
- **Clean Layout** - Card-based interface with proper spacing
- **Loading States** - Visual feedback during API calls
- **Error Handling** - User-friendly error messages
- **Navigation** - Easy menu with user dropdown
- **Search Bar** - Quick question search
- **Tag Sidebar** - Popular tags on homepage

## Security Features

- JWT token stored in localStorage
- Axios interceptors for auto-token injection
- Protected routes (ask, answer require login)
- CORS-enabled API calls
- Password validation on registration

## Build & Deploy

### Development Build
```bash
npm start
```

### Production Build
```bash
npm run build
```
Creates optimized bundle in `build/` folder

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Heroku
```bash
heroku create forum-frontend
npm run build
git push heroku main
```

## Testing

Add unit tests:
```bash
npm test
```

Test coverage:
```bash
npm test -- --coverage
```

## Troubleshooting

### API Connection Issues
- Ensure backend is running on `http://localhost:5000`
- Check `REACT_APP_API_URL` in `.env`
- Verify CORS is enabled on backend

### Build Issues
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

### Login Issues
- Check localStorage isn't disabled
- Verify JWT token key in `.env`
- Check browser console for errors

## 📄 Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000/api      # Backend API URL
REACT_APP_JWT_TOKEN_KEY=forum_jwt_token          # LocalStorage key
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of the DevForum Full-Stack Application.

## Future Enhancements

- [ ] Real-time notifications
- [ ] Comment system for answers
- [ ] User following/subscriptions
- [ ] Rich text editor (Markdown support)
- [ ] Image uploads
- [ ] Email notifications
- [ ] Dark mode
- [ ] Analytics dashboard
- [ ] Question bounties
- [ ] Advanced search filters

---
