export default function TestStylesPage() {
  return (
    <main className="min-h-screen p-8 bg-white text-black">
      <h1 className="text-2xl font-bold mb-8">Design Tokens Test</h1>
      
      {/* Typography Scale */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Typography Scale</h2>
        <p className="text-xs mb-2">text-xs (12px)</p>
        <p className="text-sm mb-2">text-sm (14px)</p>
        <p className="text-base mb-2">text-base (16px)</p>
        <p className="text-lg mb-2">text-lg (20px)</p>
        <p className="text-xl mb-2">text-xl (28px)</p>
        <p className="text-2xl mb-2">text-2xl (40px)</p>
      </section>

      {/* Spacing Tokens */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Spacing Tokens</h2>
        <div className="space-y-1">
          <div className="bg-gray-200 p-1">p-1 (4px)</div>
          <div className="bg-gray-200 p-2">p-2 (8px)</div>
          <div className="bg-gray-200 p-3">p-3 (12px)</div>
          <div className="bg-gray-200 p-4">p-4 (16px)</div>
          <div className="bg-gray-200 p-6">p-6 (24px)</div>
          <div className="bg-gray-200 p-8">p-8 (32px)</div>
        </div>
      </section>

      {/* Colors */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Colors</h2>
        <div className="space-y-2">
          <div className="bg-black text-white p-4 rounded-xl">bg-black (#0A0A0A)</div>
          <div className="bg-white text-black p-4 rounded-xl border">bg-white (#F6F6F6)</div>
        </div>
      </section>

      {/* Border Radius */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Border Radius</h2>
        <div className="space-y-2">
          <div className="bg-gray-200 p-4 rounded-xl">rounded-xl (12px) - Cards</div>
          <div className="bg-gray-200 p-4 rounded-2xl">rounded-2xl (20px) - Rail Knob</div>
        </div>
      </section>

      {/* Shadows */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Shadows</h2>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            Hover me for shadow effect
          </div>
        </div>
      </section>

      {/* Font Weights */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Font Weights</h2>
        <p className="font-normal mb-2">font-normal (400)</p>
        <p className="font-semibold mb-2">font-semibold (600)</p>
        <p className="font-bold mb-2">font-bold (800)</p>
      </section>
    </main>
  )
}
