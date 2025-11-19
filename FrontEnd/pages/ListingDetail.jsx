import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { invoiceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const InvoiceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await invoiceAPI.getInvoice(id);
        setInvoice(res.data);
      } catch (err) {
        alert('Invoice not found or access denied');
        navigate('/invoices');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, navigate]);

  const handleMarkAsPaid = async () => {
    if (!window.confirm('Mark this invoice as paid? (External payment confirmed)')) return;
    try {
      await invoiceAPI.markAsPaid(id);
      setInvoice(prev => ({ ...prev, status: 'paid' }));
      alert('Invoice marked as paid!');
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading invoice...</div>;
  if (!invoice) return null;

  const isBusiness = user.id === invoice.business.id;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-mint text-white p-8">
          <h1 className="text-4xl font-bold">Invoice {invoice.invoice_number}</h1>
          <p className="text-xl mt-2">Project: {invoice.listing_title}</p>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-3">From</h3>
              <p className="font-semibold">{invoice.designer.name}</p>
              <p className="text-gray-600">{invoice.designer.email}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">To</h3>
              <p className="font-semibold">{invoice.business.name}</p>
              <p className="text-gray-600">{invoice.business.email}</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600">Amount Due</p>
                <p className="text-4xl font-bold text-mint">${invoice.amount.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-4 py-2 rounded-full text-white font-bold ${
                  invoice.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'
                }`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Issue Date</p>
                <p>{new Date(invoice.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Due Date</p>
                <p>{new Date(invoice.due_date).toLocaleDateString()}</p>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold mb-2">Payment Instructions / Notes</p>
                <p className="whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              {isBusiness && invoice.status !== 'paid' && (
                <button
                  onClick={handleMarkAsPaid}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg"
                >
                  Mark as Paid (External)
                </button>
              )}
              <Link
                to="/invoices"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-8 rounded-lg"
              >
                Back to Invoices
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;