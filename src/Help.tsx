import { Link } from "react-router-dom";

type StoreLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  hours: string;
  emoji: string;
};

const storeLocations: StoreLocation[] = [
  {
    id: "store1",
    name: "Falcorp Grocery - Sandton",
    address: "123 Rivonia Road, Sandton",
    city: "Johannesburg",
    phone: "+27 11 123 4567",
    hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
    emoji: "🏪"
  },
  {
    id: "store2",
    name: "Falcorp Grocery - Rosebank",
    address: "456 Oxford Road, Rosebank",
    city: "Johannesburg",
    phone: "+27 11 234 5678",
    hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
    emoji: "🏪"
  },
  {
    id: "store3",
    name: "Falcorp Grocery - Pretoria",
    address: "789 Church Street, Pretoria CBD",
    city: "Pretoria",
    phone: "+27 12 345 6789",
    hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
    emoji: "🏪"
  },
  {
    id: "store4",
    name: "Falcorp Grocery - Centurion",
    address: "321 John Vorster Drive, Centurion",
    city: "Centurion",
    phone: "+27 12 456 7890",
    hours: "Mon-Sat: 8AM-8PM, Sun: 9AM-6PM",
    emoji: "🏪"
  }
];

function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex flex-col items-center p-4 font-sans">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-gradient"></div>

      <div className="relative z-10 w-full max-w-5xl mt-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Shop</span>
          </Link>

          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-600 rounded-3xl shadow-glow">
            <span className="text-3xl">❓</span>
          </div>
        </div>

        <div className="glass-morphism rounded-3xl shadow-glass border border-white/30 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary-600 via-primary-500 to-accent-600 text-white py-6 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-accent-400/20 animate-shimmer shimmer-bg"></div>
            <h1 className="relative text-3xl font-display font-bold text-shadow mb-2">Help & Support</h1>
            <p className="relative text-primary-100">Find our store locations and get assistance</p>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-6 shadow-glass">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center text-2xl">
                    📞
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Customer Service</h3>
                    <p className="text-sm text-gray-600">We're here to help</p>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">Phone:</span> 0800 123 456</p>
                  <p><span className="font-semibold">Email:</span> support@falcorpgrocery.co.za</p>
                  <p><span className="font-semibold">Hours:</span> Mon-Fri 8AM-6PM</p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-6 shadow-glass">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-success-100 to-success-200 rounded-xl flex items-center justify-center text-2xl">
                    🚚
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Delivery Info</h3>
                    <p className="text-sm text-gray-600">Fast & reliable</p>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">Delivery Fee:</span> R50</p>
                  <p><span className="font-semibold">Free Delivery:</span> Orders over R500</p>
                  <p><span className="font-semibold">Time:</span> 1-2 business days</p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-6 shadow-glass">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-100 to-accent-200 rounded-xl flex items-center justify-center text-2xl">
                    💳
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Payment Methods</h3>
                    <p className="text-sm text-gray-600">Secure payments</p>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p>✓ Credit/Debit Cards</p>
                  <p>✓ SnapScan & Zapper</p>
                  <p>✓ EFT & Bank Transfer</p>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-sm border border-white/60 rounded-2xl p-6 shadow-glass">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center text-2xl">
                    ⭐
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Loyalty Program</h3>
                    <p className="text-sm text-gray-600">Earn rewards</p>
                  </div>
                </div>
                <div className="space-y-2 text-gray-700">
                  <p>✓ Earn 1 point per R10 spent</p>
                  <p>✓ Exclusive member discounts</p>
                  <p>✓ Birthday specials</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-6 border border-primary-100">
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-6">
                🏪 Our Store Locations
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {storeLocations.map((store, index) => (
                  <div
                    key={store.id}
                    className="bg-white/90 backdrop-blur-sm border border-white/80 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-200 animate-scale-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                        {store.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 text-base mb-1">{store.name}</h3>
                        <p className="text-sm text-gray-600">{store.city}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{store.address}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-success-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{store.phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{store.hours}</span>
                      </div>
                    </div>

                    <button className="mt-4 w-full bg-gradient-to-r from-primary-500 to-accent-600 text-white py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:scale-102">
                      Get Directions
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
