import { Plus, ImageOff } from "lucide-react";

const stockStyles = {
  in_stock:  { label: "In Stock",  badge: "bg-green-50 text-green-700",   dot: "bg-green-600" },
  low_stock: { label: "Low Stock", badge: "bg-orange-50 text-orange-600", dot: "bg-orange-500" },
};

export default function ProductCard({ product, onAdd }) {
  const stock = stockStyles[product.stock];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageOff className="w-8 h-8 text-gray-300" />
        )}
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{product.name}</h3>
        <p className="text-base font-bold text-orange-500 mt-1">
          ₦{product.price.toLocaleString()}
        </p>

        <div className="flex items-center justify-between mt-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${stock.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${stock.dot}`} />
            {stock.label}
          </span>

          <button
            onClick={() => onAdd(product)}
            className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 active:scale-95 transition"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}