import { ShoppingBag, Coffee, CloudSun } from "lucide-react";
import React, { useState } from "react";
import { formatCurrency } from "../../utils/functions";
import useGreenCreditStore from "../../store/greenCreditStore";

export default function ProductsGreenCredit() {
  const { creditDetail } = useGreenCreditStore();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  // If creditDetail or products aren't available yet, show loading state
  if (
    !creditDetail ||
    !creditDetail.products ||
    creditDetail.products.length === 0
  ) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center mb-4">
          <ShoppingBag className="w-5 h-5 text-teal-700 mr-2" />
          <h2 className="text-lg font-medium">Products</h2>
        </div>
        <p className="text-gray-500">No products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center mb-4">
        <ShoppingBag className="w-5 h-5 text-teal-700 mr-2" />
        <h2 className="text-lg font-medium">Products</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {creditDetail.products.map((product) => (
          <div
            key={product.id}
            className={`border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer ${
              selectedProduct === product ? "ring-2 ring-teal-700" : ""
            }`}
            onClick={() => handleProductSelect(product)}
          >
            <div className="h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center text-xs text-teal-700 font-medium mb-1">
                <Coffee className="w-3 h-3 mr-1" />
                <span>{product.type}</span>
              </div>
              <h3 className="font-medium text-gray-800">{product.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <p className="font-bold text-teal-700">
                  {formatCurrency(product.price)}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    / {product.unit}
                  </span>
                </p>
                <div className="text-xs text-gray-500">
                  Stock: {product.stock} units
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="bg-teal-50 p-4 rounded-lg mt-4">
          <div className="flex justify-between items-start border-b border-teal-100 pb-4 mb-4">
            <div>
              <h3 className="text-lg font-medium text-teal-800">
                {selectedProduct.name}
              </h3>
              <p className="text-sm text-teal-600">
                {selectedProduct.type} • {selectedProduct.unit}
              </p>
            </div>
            <p className="text-xl font-bold text-teal-700">
              {formatCurrency(selectedProduct.price)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-teal-800 mb-2">Description</h4>
              <p className="text-gray-600 text-sm">
                {selectedProduct.description}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-teal-800 mb-2">
                Sustainability Features
              </h4>
              <ul className="space-y-2">
                {selectedProduct.sustainability.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start text-sm text-gray-600"
                  >
                    <CloudSun className="w-4 h-4 text-teal-700 mt-0.5 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {selectedProduct.certificates &&
            selectedProduct.certificates.length > 0 && (
              <div className="mt-4 pt-4 border-t border-teal-100">
                <h4 className="font-medium text-teal-800 mb-2">Certificates</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.certificates.map((cert, idx) => (
                    <span
                      key={idx}
                      className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-md"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
