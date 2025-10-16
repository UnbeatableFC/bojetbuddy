# BojetBuddy - Smart Student Expense Tracker

A modern, beautiful web application for students to track, manage, and optimize their expenses.

## 🎯 Features

- **📊 Dashboard Overview**: Visualize your spending with interactive charts and real-time statistics
- **➕ Quick Expense Entry**: Add expenses in seconds with an intuitive form
- **📝 Expense Management**: View, filter, and search through all your expenses
- **🏷️ Custom Categories**: Create and manage expense categories tailored to your needs
- **💡 Smart Insights**: Get personalized suggestions to optimize spending habits
- **🔐 Secure Authentication**: User accounts with email/password authentication
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **🌙 Dark Mode**: Automatic dark mode support for comfortable viewing

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui
- **Routing**: React Router v6
- **Charts**: Recharts
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Clerk
- **Database**: Firebase

## 🎨 Design System

BudgetBuddy features a carefully crafted design system with:

- **Typography**: Inter for body text, Raleway for headings
- **Color Palette**:
  - Primary Blue: #0A74DA (light) / #2E9AFF (dark)
  - Dark Blue: #083D77 (light) / #041C3C (dark)
  - Accent colors for success, warning, and info states
- **Components**: Custom-designed cards with hover effects and smooth transitions
- **Animations**: Subtle transitions for enhanced user experience

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm installed
- Git for version control

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd budgetbuddy

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Building for Production

```bash
npm run build
```

## 📁 Project Structure

```
budgetbuddy/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Shadcn components
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   └── Footer.tsx
│   ├── pages/               # Page components
│   │   ├── Home.tsx
│   │   ├── Auth.tsx
│   │   ├── Dashboard.tsx
│   │   ├── AddExpense.tsx
│   │   ├── ExpensesList.tsx
│   │   └── Settings.tsx
│   ├── types/               # TypeScript type definitions
│   ├── lib/                 # Utility functions
│   └── index.css           # Global styles and design system
├── public/                  # Static assets
└── index.html              # HTML entry point
```

## 🔐 Authentication & Database

This project is ready for **Lovable Cloud** integration, which provides:

- User authentication (email/password, social login)
- PostgreSQL database for expense storage
- Secure API endpoints
- File storage for receipts/attachments
- Real-time data synchronization

To enable backend features, connect Lovable Cloud through the Lovable interface.

## 🎯 Key Pages

1. **Home** (`/`): Landing page with hero section and features
2. **Authentication** (`/auth`): Login and signup forms
3. **Dashboard** (`/dashboard`): Overview with charts and statistics
4. **Add Expense** (`/dashboard/add`): Form to create new expenses
5. **Expenses List** (`/dashboard/expenses`): Filterable table of all expenses
6. **Settings** (`/dashboard/settings`): Category management and data controls

## 🤝 Contributing

This is a student project built with Lovable. Feel free to fork and customize for your needs!

## 📝 License

MIT License - feel free to use this project for learning and personal use.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [Shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)

---

**Note**: This project uses Lovable Cloud for backend functionality. For local development without backend features, the app will work with mock data. Connect Lovable Cloud to enable full functionality including authentication and data persistence.
