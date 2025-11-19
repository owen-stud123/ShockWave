import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { dashboardAPI, orderAPI } from '../services/api';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ projects: 0, earnings: 0, messages: 0, reviews: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const [statsRes, ordersRes] = await Promise.all([
            dashboardAPI.getStats(),
            orderAPI.getOrders()
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading]);
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-lightgray-light">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-mint"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-lightgray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8"><h1 className="text-3xl font-bold text-charcoal mb-2">Welcome, {user.name}!</h1></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Active Projects" value={stats.projects} />
            <StatCard title={user.role === 'designer' ? 'Total Earnings' : 'Total Spent'} value={`$${stats.earnings.toFixed(2)}`} />
            <StatCard title="Unread Messages" value={stats.messages} />
            <StatCard title="Reviews Received" value={stats.reviews} />
          </div>
          {user.role === 'designer' ? <DesignerDashboard orders={orders} /> : <BusinessDashboard orders={orders} />}
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-mint"><h3 className="text-lg font-semibold text-charcoal mb-2">{title}</h3><p className="text-3xl font-bold text-mint">{value}</p></div>
);

const DesignerDashboard = ({ orders }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-8">
        <ActionPanel links={[{ to: "/listings", text: "Find Work", primary: true }, { to: "/projects/saved", text: "Saved Projects" }, { to: "/invoices", text: "Manage Invoices" }]} />
        <OrdersList orders={orders} title="Your Projects" />
    </div>
    <div className="lg:col-span-1"><SidePanel title="Your Profile" links={[{ to: `/designer/${useAuth().user.id}`, text: "View Public Profile" }, { to: "/profile/edit", text: "Edit Profile & Portfolio" }]} /></div>
  </div>
);

const BusinessDashboard = ({ orders }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <ActionPanel links={[{ to: "/listings/new", text: "Post New Project", primary: true }, { to: "/browse", text: "Browse Designers" }, { to: "/invoices", text: "Manage Invoices" }]} />
            <OrdersList orders={orders} title="Your Projects" />
        </div>
        <div className="lg:col-span-1"><SidePanel title="Your Profile" links={[{ to: `/profile/edit`, text: "Edit Company Profile" }]} /></div>
    </div>
);

const ActionPanel = ({ links }) => (
    <div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-xl font-semibold text-charcoal mb-4">Quick Actions</h2><div className="flex flex-wrap gap-4">{links.map(link => (<Link key={link.to} to={link.to} className={link.primary ? "bg-mint text-white px-6 py-3 rounded-md hover:bg-mint-dark" : "bg-charcoal text-white px-6 py-3 rounded-md hover:bg-charcoal-light"}>{link.text}</Link>))}</div></div>
);

const SidePanel = ({ title, links }) => (
    <div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-xl font-semibold text-charcoal mb-4">{title}</h2><ul className="space-y-2">{links.map(link => (<li key={link.to}><Link to={link.to} className="text-mint hover:underline">{link.text}</Link></li>))}</ul></div>
);

const OrdersList = ({ orders, title }) => (
    <div className="bg-white p-6 rounded-lg shadow-md"><h2 className="text-xl font-semibold text-charcoal mb-4">{title}</h2>{orders.length === 0 ? <p className="text-charcoal-light">No projects to show.</p> : (<div className="space-y-4">{orders.map(order => (<Link to={`/order/${order.id}`} key={order.id} className="block border p-4 rounded-lg hover:bg-lightgray-light"><div className="flex justify-between items-center"><div><p className="font-bold text-charcoal">{order.listing_title}</p><p className="text-sm text-charcoal-light">with {useAuth().user.role === 'designer' ? order.buyer.name : order.seller.name}</p></div><span className="text-sm font-semibold capitalize px-2 py-1 rounded-full bg-mint/10 text-mint">{order.status.replace('_', ' ')}</span></div></Link>))}</div>)}</div>
);

export default Dashboard;