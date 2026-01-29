export function MembersPage() {
    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Members</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    + Add Member
                </button>
            </div>

            <div className="mt-6">
                <input
                    type="text"
                    placeholder="Search members..."
                    className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="mt-6 bg-white rounded-lg shadow">
                <p className="p-8 text-center text-gray-500">Members list will be displayed here</p>
            </div>
        </div>
    );
}
