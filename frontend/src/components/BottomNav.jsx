import { Home, Search, ShoppingCart, Bell, User } from "lucide-react";

const items = [
  { label: "Home", icon: Home },
  { label: "Search", icon: Search },
  { label: "Cart", icon: ShoppingCart, badge: 3 },
  { label: "Notifications", icon: Bell, badge: 5 },
  { label: "Profile", icon: User },
];

export default function BottomNav({ active = "Home" }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 lg:hidden">
      <ul className="flex justify-around py-2">
        {items.map(({ label, icon: Icon, badge }) => (
          <li key={label} className="relative">
            <button
              className={`flex flex-col items-center gap-0.5 px-2 text-[11px] ${
                active === label ? "text-orange-500" : "text-gray-500"
              }`}
            >
              <Icon className="w-6 h-6" />
              {label}
            </button>
            {badge && (
              <span className="absolute -top-1 right-0 min-w-4 h-4 px-1 rounded-full bg-orange-500 text-white text-[10px] flex items-center justify-center">
                {badge}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}