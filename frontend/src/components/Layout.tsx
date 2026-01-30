import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

const navItems = [
    { to: '/', label: 'Members', icon: '👥' },
    { to: '/checkin', label: 'Check-in', icon: '✅' },
];

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white">
                <div className="p-6">
                    <h1 className="text-xl font-bold">🏋️ FitMember</h1>
                    <p className="text-sm text-gray-400 mt-1">Management System</p>
                </div>

                <nav className="mt-6">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-6 py-3 text-sm transition-colors',
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                )
                            }
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
