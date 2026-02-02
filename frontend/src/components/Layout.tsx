import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
    { to: '/', label: 'Members', icon: '👥' },
    { to: '/checkin', label: 'Check-in', icon: '✅' },
];

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="flex flex-col lg:flex-row h-screen bg-gray-50">
            <aside className="w-full lg:w-64 bg-gray-900 text-white flex flex-col shrink-0">
                <div className="p-4 lg:p-6 flex lg:block items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">🏋️ FitMember</h1>
                        <p className="hidden lg:block text-sm text-gray-400 mt-1">Management System</p>
                    </div>
                </div>

                <nav className="flex lg:block border-t lg:border-t-0 border-gray-800">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    'flex-1 lg:flex-none flex items-center justify-center lg:justify-start gap-3 px-6 py-4 lg:py-3 text-sm transition-colors',
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                )
                            }
                        >
                            <span>{item.icon}</span>
                            <span className="lg:inline">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <main className="flex-1 overflow-auto">
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
