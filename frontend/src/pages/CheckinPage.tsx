export function CheckinPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Check-in</h1>
            <p className="mt-2 text-gray-600">Record member check-ins</p>

            <div className="mt-8 max-w-md">
                <div className="bg-white rounded-lg shadow p-6">
                    <label className="block text-sm font-medium text-gray-700">
                        Member Email or ID
                    </label>
                    <input
                        type="text"
                        placeholder="Enter member email..."
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button className="mt-4 w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
                        ✅ Check In
                    </button>
                </div>
            </div>
        </div>
    );
}
