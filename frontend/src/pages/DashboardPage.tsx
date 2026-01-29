export function DashboardPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">Welcome to FitMember Management System</p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Total Members</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">--</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Active Memberships</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">--</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-sm font-medium text-gray-500">Check-ins Today</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">--</p>
                </div>
            </div>
        </div>
    );
}
