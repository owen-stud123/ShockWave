import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch invoice details from API
    // For now, using placeholder data
    setInvoice({
      id,
      invoiceNumber: `INV-${id}`,
      date: new Date().toLocaleDateString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      amount: 0,
      status: "pending",
      items: []
    });
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        ← Back
      </button>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Invoice Detail</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Invoice Number</p>
            <p className="font-semibold">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Status</p>
            <p className="font-semibold capitalize">{invoice.status}</p>
          </div>
          <div>
            <p className="text-gray-600">Date</p>
            <p className="font-semibold">{invoice.date}</p>
          </div>
          <div>
            <p className="text-gray-600">Due Date</p>
            <p className="font-semibold">{invoice.dueDate}</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          {invoice.items.length === 0 ? (
            <p className="text-gray-500">No items</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.description}</td>
                    <td className="text-right py-2">${item.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 text-right">
          <p className="text-2xl font-bold">
            Total: ${invoice.amount}
          </p>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetail;
