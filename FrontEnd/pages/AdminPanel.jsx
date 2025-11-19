import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import AdminMessagesView from './AdminMessagesView'; // Import the new component

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const AdminPanel = () => {
  const { user } = useAuth();
  const [view, setView] = useState('dashboard'); // 'dashboard', 'users', or 'messages'
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center p-8"><h2 className="text-2xl font-bold">Access Denied</h2><p>You do not have permission to access this page.</p></div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>
      <div className="flex border-b mb-6">
        <TabButton name="dashboard" currentView={view} setView={setView}>Dashboard</TabButton>
        <TabButton name="users" currentView={view} setView={setView}>Users</TabButton>
        <TabButton name="messages" currentView={view} setView={setView}>Messages</TabButton>
      </div>

      {view === 'dashboard' && <DashboardView />}
      {view === 'users' && <UsersView />}
      {view === 'messages' && <AdminMessagesView />}
    </div>
  );
};

const TabButton = ({ name, currentView, setView, children }) => (
    <button onClick={() => setView(name)} className={`px-4 py-2 ${currentView === name ? 'border-b-2 border-mint font-semibold text-mint' : 'text-gray-500'}`}>
        {children}
    </button>
);

const DashboardView = () => {
    const [analytics, setAnalytics] = useState(null);
    useEffect(() => { adminAPI.getAnalytics().then(res => setAnalytics(res.data)).catch(console.error); }, []);
    if (!analytics) return <p>Loading analytics...</p>;

    const chartOptions = { responsive: true, plugins: { legend: { position: 'top' } } };
    const userGrowthData = {
        labels: analytics.charts.userGrowth.map(d => d._id),
        datasets: [{ label: 'New Users', data: analytics.charts.userGrowth.map(d => d.count), borderColor: '#00CEC9', backgroundColor: 'rgba(0, 206, 201, 0.2)', fill: true }],
    };
    const projectGrowthData = {
        labels: analytics.charts.projectGrowth.map(d => d._id),
        datasets: [{ label: 'New Projects', data: analytics.charts.projectGrowth.map(d => d.count), backgroundColor: 'rgba(45, 52, 54, 0.8)' }],
    };

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Users" value={analytics.summary.totalUsers} />
                <StatCard title="Designers" value={analytics.summary.totalDesigners} />
                <StatCard title="Businesses" value={analytics.summary.totalBusinesses} />
                <StatCard title="Total Projects" value={analytics.summary.totalProjects} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-lg shadow"><h3 className="font-bold mb-2">User Growth (30 Days)</h3><Line options={chartOptions} data={userGrowthData} /></div>
                <div className="bg-white p-4 rounded-lg shadow"><h3 className="font-bold mb-2">Project Growth (30 Days)</h3><Bar options={chartOptions} data={projectGrowthData} /></div>
            </div>
        </div>
    );
};

const UsersView = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => { adminAPI.getUsers().then(res => setUsers(res.data)).catch(console.error); }, []);
    
    const handleStatusToggle = async (userId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'suspend' : 'reactivate'} this user?`)) return;
        try {
            const res = await adminAPI.updateUserStatus(userId, !currentStatus);
            setUsers(users.map(u => u._id === userId ? { ...u, is_active: res.data.user.is_active } : u));
        } catch (error) { alert("Could not update user status."); }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-gray-50"><tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id} className="border-b hover:bg-gray-50">
                            <td className="p-3">{user.name}</td><td className="p-3">{user.email}</td><td className="p-3 capitalize">{user.role}</td>
                            <td className="p-3"><span className={`px-2 py-1 text-xs rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.is_active ? 'Active' : 'Suspended'}</span></td>
                            <td className="p-3"><button onClick={() => handleStatusToggle(user._id, user.is_active)} className={`px-3 py-1 text-sm rounded-md text-white ${user.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>{user.is_active ? 'Suspend' : 'Reactivate'}</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const StatCard = ({ title, value }) => (
    <div className="bg-white p-4 rounded-lg shadow"><div className="text-sm text-gray-500">{title}</div><div className="text-2xl font-bold">{value}</div></div>
);

export default AdminPanel;