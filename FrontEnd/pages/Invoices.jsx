import { useState, useEffect } from 'react';
import { invoiceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Invoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const res = await invoiceAPI.getInvoices();
                setInvoices(res.data);
            } catch (error) {
                console.error("Failed to fetch invoices", error);
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    if (loading) {
        return <div className="p-8 text-center">Loading invoices...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Invoices</h1>
            <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
                {invoices.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-600">You have no invoices to display.</p>
                        {user.role === 'designer' && <p className="text-sm text-gray-500 mt-2">Invoices can be generated from a completed order page.</p>}
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3">Invoice ID</th>
                                <th className="p-3">Project</th>
                                <th className="p-3">{user.role === 'designer' ? 'Client' : 'Designer'}</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Due Date</th>
                                <th className="p-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map(invoice => (
                                <tr key={invoice.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 text-sm text-gray-500 font-mono">#{invoice.id.slice(-6)}</td>
                                    <td className="p-3 font-medium text-charcoal">{invoice.listing_title}</td>
                                    <td className="p-3">{user.role === 'designer' ? invoice.business.name : invoice.designer.name}</td>
                                    <td className="p-3 font-semibold text-mint">${invoice.amount.toFixed(2)}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{new Date(invoice.due_date).toLocaleDateString()}</td>
                                    <td className="p-3">
                                     <Link to={`/invoice/${invoice.id}`} className="text-sm text-blue-600 hover:underline">
                                         View Details
                                       </Link>
                                     </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Invoices;