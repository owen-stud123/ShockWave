import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { adminAPI } from '../services/api';
import AdminMessagesView from './AdminMessagesView';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('dashboard'); // 'dashboard', 'users', or 'messages'
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center p-8"><h2 className="text-2xl font-bold">Access Denied</h2><p>You do not have permission to access this page.</p></div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold">ShockWave Admin</h1>
              <div className="hidden md:flex space-x-1">
                <button onClick={() => setView('dashboard')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                  Dashboard
                </button>
                <button onClick={() => setView('users')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'users' ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                  Users
                </button>
                <button onClick={() => setView('messages')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${view === 'messages' ? 'bg-white/20 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}>
                  Messages
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=6366f1&color=fff`}
                  alt={user.name} 
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm hidden md:block">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'dashboard' && <DashboardView />}
        {view === 'users' && <UsersView />}
        {view === 'messages' && <AdminMessagesView />}
      </div>
    </div>
  );
};



const DashboardView = () => {
    const [analytics, setAnalytics] = useState(null);
    const userChartRef = useRef(null);
    const projectChartRef = useRef(null);

    useEffect(() => { 
        adminAPI.getAnalytics().then(res => setAnalytics(res.data)).catch(console.error); 
    }, []);

    useEffect(() => {
        if (!analytics || !window.am5) return;

        // User Growth Chart
        const userRoot = window.am5.Root.new(userChartRef.current);
        userRoot.setThemes([window.am5themes_Animated.new(userRoot)]);
        const userChart = userRoot.container.children.push(window.am5xy.XYChart.new(userRoot, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            paddingLeft: 0
        }));

        const userXAxis = userChart.xAxes.push(window.am5xy.CategoryAxis.new(userRoot, {
            categoryField: "date",
            renderer: window.am5xy.AxisRendererX.new(userRoot, {
                minGridDistance: 30
            })
        }));

        const userYAxis = userChart.yAxes.push(window.am5xy.ValueAxis.new(userRoot, {
            renderer: window.am5xy.AxisRendererY.new(userRoot, {})
        }));

        const userSeries = userChart.series.push(window.am5xy.SmoothedXLineSeries.new(userRoot, {
            name: "New Users",
            xAxis: userXAxis,
            yAxis: userYAxis,
            valueYField: "count",
            categoryXField: "date",
            stroke: window.am5.color(0x00CEC9),
            fill: window.am5.color(0x00CEC9),
            tooltip: window.am5.Tooltip.new(userRoot, {
                labelText: "{valueY} users"
            })
        }));

        userSeries.strokes.template.setAll({ strokeWidth: 2 });
        userSeries.fills.template.setAll({ fillOpacity: 0.2, visible: true });

        userSeries.bullets.push(function () {
            return window.am5.Bullet.new(userRoot, {
                locationY: 0,
                sprite: window.am5.Circle.new(userRoot, {
                    radius: 4,
                    stroke: userRoot.interfaceColors.get("background"),
                    strokeWidth: 2,
                    fill: userSeries.get("fill")
                })
            });
        });

        const userData = analytics.charts.userGrowth.map(d => ({ date: d._id, count: d.count }));
        userXAxis.data.setAll(userData);
        userSeries.data.setAll(userData);
        userSeries.appear(1000);
        userChart.appear(1000, 100);

        // Project Growth Chart
        const projectRoot = window.am5.Root.new(projectChartRef.current);
        projectRoot.setThemes([window.am5themes_Animated.new(projectRoot)]);
        const projectChart = projectRoot.container.children.push(window.am5xy.XYChart.new(projectRoot, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            paddingLeft: 0
        }));

        const projectXAxis = projectChart.xAxes.push(window.am5xy.CategoryAxis.new(projectRoot, {
            categoryField: "date",
            renderer: window.am5xy.AxisRendererX.new(projectRoot, {
                minGridDistance: 30
            })
        }));

        const projectYAxis = projectChart.yAxes.push(window.am5xy.ValueAxis.new(projectRoot, {
            renderer: window.am5xy.AxisRendererY.new(projectRoot, {})
        }));

        const projectSeries = projectChart.series.push(window.am5xy.ColumnSeries.new(projectRoot, {
            name: "New Projects",
            xAxis: projectXAxis,
            yAxis: projectYAxis,
            valueYField: "count",
            categoryXField: "date",
            tooltip: window.am5.Tooltip.new(projectRoot, {
                labelText: "{valueY} projects"
            })
        }));

        projectSeries.columns.template.setAll({ 
            cornerRadiusTL: 5, 
            cornerRadiusTR: 5, 
            strokeOpacity: 0,
            fillOpacity: 0.8
        });

        projectSeries.columns.template.adapters.add("fill", function (fill, target) {
            return projectChart.get("colors").getIndex(projectSeries.columns.indexOf(target));
        });

        const projectData = analytics.charts.projectGrowth.map(d => ({ date: d._id, count: d.count }));
        projectXAxis.data.setAll(projectData);
        projectSeries.data.setAll(projectData);
        projectSeries.appear(1000);
        projectChart.appear(1000, 100);

        return () => {
            userRoot.dispose();
            projectRoot.dispose();
        };
    }, [analytics]);

    if (!analytics) return <p>Loading analytics...</p>;

    return (
        <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Users" value={analytics.summary.totalUsers} />
                <StatCard title="Designers" value={analytics.summary.totalDesigners} />
                <StatCard title="Businesses" value={analytics.summary.totalBusinesses} />
                <StatCard title="Total Projects" value={analytics.summary.totalProjects} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold mb-2">User Growth (30 Days)</h3>
                    <div ref={userChartRef} style={{ width: '100%', height: '400px' }}></div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="font-bold mb-2">Project Growth (30 Days)</h3>
                    <div ref={projectChartRef} style={{ width: '100%', height: '400px' }}></div>
                </div>
            </div>
        </div>
    );
};

const UsersView = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => { 
        adminAPI.getUsers().then(res => {
            const data = res.data.users || res.data;
            setUsers(Array.isArray(data) ? data : []);
        }).catch(console.error); 
    }, []);
    
    const handleStatusToggle = async (userId, currentStatus) => {
        const action = currentStatus ? 'suspend' : 'reactivate';
        const confirmed = await new Promise((resolve) => {
            toast((t) => (
                <div>
                    <p className="font-semibold mb-2">Are you sure you want to {action} this user?</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(true); }}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                            {action === 'suspend' ? 'Suspend' : 'Reactivate'}
                        </button>
                        <button
                            onClick={() => { toast.dismiss(t.id); resolve(false); }}
                            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ), { duration: Infinity });
        });
        if (!confirmed) return;
        try {
            const res = await adminAPI.updateUserStatus(userId, !currentStatus);
            setUsers(users.map(u => u._id === userId ? { ...u, is_active: res.data.user.is_active } : u));
            toast.success(`User ${action}d successfully`);
        } catch (error) { toast.error("Could not update user status."); }
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