import { useState } from "react";
import { Search, SlidersHorizontal, Bell } from "lucide-react";
import ProductCard from "../components/ProductCard";
import BottomNav from "../components/BottomNav";
import { categories, products } from "../data/products";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  // Safer way to get the first name
  const firstName = user?.name ? user.name.split(" ")[0] : "User";

  const visibleProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (product) => {
    console.log("Add to cart:", product.name); // real cart logic comes later
  };

  // Prevent crash if user is somehow missing
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <header className="flex items-center justify-between py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Welcome, {firstName}
          </h1>
          <button className="relative p-2" aria-label="Notifications">
            <Bell className="w-6 h-6 text-gray-800" />
            <span className="absolute top-0 right-0 min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center">
              5
            </span>
          </button>
        </header>

        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-orange-500 rounded-2xl px-4 py-3">
          <Search className="w-5 h-5 text-white shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-white placeholder-orange-100 outline-none"
          />
          <SlidersHorizontal className="w-5 h-5 text-white shrink-0" />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto py-4 -mx-4 px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm border transition ${
                activeCategory === cat
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {visibleProducts.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>

        {visibleProducts.length === 0 && (
          <p className="text-center text-gray-500 py-12">No products found.</p>
        )}

        {/* Temporary logout button for testing */}
        <button
          onClick={logout}
          className="mt-8 text-sm text-gray-400 underline"
        >
          Log out (testing only)
        </button>
      </div>

      <BottomNav active="Home" />
    </div>
  );
}