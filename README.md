# Crong UI

Modern web interface for the **Crong** HTTP cron scheduler. A sleek, responsive frontend built with SvelteKit and Tailwind CSS for managing scheduled HTTP jobs with precision timing, authentication, and execution history.

## About Crong

See the [crong repo](https://github.com/rodatboat/crong) for API specifications.
Crong is a HTTP cron scheduler built with Go and Fiber that provides:
- **Precise cron scheduling** for HTTP requests
- **JWT authentication** for secure job management
- **Execution history tracking** with detailed metrics
- **HTTP timing metrics** to monitor request performance
- **Non-blocking architecture** with bounded worker concurrency

**Crong UI** is the frontend for creating, managing, and monitoring your scheduled jobs.

## Features

✨ **Job Management**
- Create, read, update, and delete HTTP cron jobs
- Real-time job execution with status tracking
- Organize jobs into folders
- Set custom HTTP methods, headers, and request bodies

🔐 **Authentication**
- User registration and login with JWT tokens
- Secure session management
- Password-protected job access

📊 **Advanced Controls**
- Flexible cron expression editor with validation
- Custom headers for HTTP requests
- Request body editor with JSON formatting
- Timezone support for global scheduling
- Timeout configuration (1-30 seconds)
- Enable/disable jobs without deletion

📈 **Monitoring**
- View job execution history
- Monitor request timing and performance metrics
- Track successful and failed executions

🎨 **User Experience**
- Responsive design for desktop and mobile
- Intuitive form validation
- Real-time feedback and error messages

## Prerequisites

- **Node.js** 18+ 
- **npm**, **pnpm**, or **yarn**
- Backend Crong server running (see integration section)

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/crong-ui.git
cd crong-ui
```

2. **Install dependencies:**
```bash
npm install
# or
pnpm install
```

3. **Configure API endpoint:**
Create a `.env.local` file in the project root:
```env
VITE_API_URL=http://localhost:8080
```

Replace `http://localhost:8080` with your Crong backend server URL.

## Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173` by default.

For live reloading in your browser:
```bash
npm run dev -- --open
```

### Other Development Commands

**Type checking:**
```bash
npm run check        # Run once
npm run check:watch  # Watch mode
```

**Linting:**
```bash
npm run lint
```

## Building

Create a production build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## Deployment

The project uses SvelteKit with the auto adapter. For specific deployment targets:

- **Vercel**: Deploy directly from GitHub with zero configuration
- **Netlify**: Requires adapter configuration
- **Static hosting**: Requires adapter configuration for your platform

See [SvelteKit adapters](https://svelte.dev/docs/kit/adapters) for more details.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:8080` |

## Technology Stack

- **Frontend Framework**: [SvelteKit](https://svelte.dev/docs/kit)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Component Library**: [Shadcn-svelte](https://www.shadcn-svelte.com)
- **Icons**: [Lucide](https://lucide.dev)
- **Validation**: [Zod](https://zod.dev)
- **Build Tool**: [Vite](https://vitejs.dev)

## Integration with Crong Backend

Crong UI communicates with the Crong backend via REST API. Ensure your backend server is running before starting the frontend.

See the [crong repo](https://github.com/rodatboat/crong) for API specifications.

## Troubleshooting

**"Cannot connect to backend"**
- Verify the backend server is running
- Check `VITE_API_URL` in `.env.local` matches your backend URL
- Ensure CORS is configured on the backend

## License

MIT

## Support

For issues, questions, or feature requests, please open an issue on GitHub or contact the maintainers.

---

**Made with ❤️ for fun**
