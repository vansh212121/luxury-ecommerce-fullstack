// src/components/admin/ProductTable.jsx - New Reusable Component
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ProductTable = ({ products, onEdit, onDelete }) => {
  return (
    <div className="bg-charcoal/50 backdrop-blur-sm rounded-xl border border-warm-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-warm-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-warm-white/80 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-warm-white/10">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-warm-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={product.images?.[0]?.image_url || 'https://placehold.co/48x48/151515/FFF?text=?'} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-lg object-cover" 
                    />
                    <div>
                      <p className="font-medium text-warm-white">{product.name}</p>
                      <p className="text-sm text-warm-white/60">{product.category.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gold font-semibold">${product.price}</td>
                <td className="px-6 py-4 text-warm-white/80">{product.stock}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    product.status === 'active' ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onEdit(product)} className="p-2 text-gold hover:bg-gold/10 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(product.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
