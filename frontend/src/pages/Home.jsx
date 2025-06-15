export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Featured Products</h2>
          <p className="text-gray-600">Discover our latest collection of furniture.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Special Offers</h2>
          <p className="text-gray-600">Check out our current discounts and deals.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">New Arrivals</h2>
          <p className="text-gray-600">See what's new in our store.</p>
        </div>
      </div>
    </div>
  )
}
