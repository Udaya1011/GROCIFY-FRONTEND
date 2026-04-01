import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminIssues = () => {
    const { axios } = useAppContext();
    const [issues, setIssues] = useState([]);
    const [filteredIssues, setFilteredIssues] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);

    const fetchIssues = async () => {
        try {
            const { data } = await axios.get("/api/issue/admin/all");
            if (data.success) {
                setIssues(data.issues);
                setFilteredIssues(data.issues);
            }
        } catch (error) {
            console.error("Error fetching issues:", error);
            toast.error("Failed to load issues");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const { data } = await axios.post("/api/issue/admin/status", { id, status });
            if (data.success) {
                toast.success(data.message);
                fetchIssues();
            }
        } catch (error) {
            console.error("Error updating issue status:", error);
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        fetchIssues();
    }, []);

    useEffect(() => {
        const filtered = issues.filter(issue => {
            const matchesSearch =
                issue.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                issue.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                issue.userId.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === "All" || issue.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
        setFilteredIssues(filtered);
    }, [searchTerm, statusFilter, issues]);

    if (loading) return <div className="p-6">Loading issues...</div>;

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-semibold">Customer Issues & Feedback</h2>
                <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Search subjects, users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                        />
                        <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-40 px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="All">All Status</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-left">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-700">
                        <tr>
                            <th className="px-6 py-4 font-semibold">User</th>
                            <th className="px-6 py-4 font-semibold">Subject</th>
                            <th className="px-6 py-4 font-semibold">Description</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredIssues.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                    <p className="text-lg font-medium">No matches found</p>
                                    <p className="text-sm mt-1 text-gray-400">Try adjusting your filters or search term</p>
                                </td>
                            </tr>
                        ) : (
                            filteredIssues.map((issue) => (
                                <tr key={issue._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{issue.userId.name}</p>
                                        <p className="text-xs text-gray-500">{issue.userId.email}</p>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{issue.subject}</td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs overflow-hidden text-ellipsis">{issue.description}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${issue.status === 'Open' ? 'bg-red-100 text-red-600' :
                                            issue.status === 'In Progress' ? 'bg-yellow-100 text-yellow-600' :
                                                issue.status === 'Resolved' ? 'bg-green-100 text-green-600' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {issue.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <select
                                            value={issue.status}
                                            onChange={(e) => updateStatus(issue._id, e.target.value)}
                                            className="text-xs border rounded px-2 py-1 outline-none bg-white font-medium hover:border-indigo-500 transition-colors cursor-pointer"
                                        >
                                            <option value="Open">Open</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminIssues;
