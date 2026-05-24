export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 via-sky-800 to-cyan-500 text-white">
      
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-white/20">
        <div>
          <h1 className="text-3xl font-bold">Smart PR UDICC</h1>
          <p className="text-sm opacity-80">
            ระบบสร้างจดหมายข่าวอัจฉริยะ
          </p>
        </div>

        <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:scale-105 transition">
          + สร้างข่าวใหม่
        </button>
      </header>

      {/* Dashboard */}
      <section className="p-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <h2 className="text-xl font-bold mb-2">
              ข่าวทั้งหมด
            </h2>

            <p className="text-5xl font-bold">
              24
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <h2 className="text-xl font-bold mb-2">
              รูปภาพทั้งหมด
            </h2>

            <p className="text-5xl font-bold">
              139
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
            <h2 className="text-xl font-bold mb-2">
              ผู้ใช้งาน
            </h2>

            <p className="text-5xl font-bold">
              12
            </p>
          </div>

        </div>

        {/* Create News Section */}
        <div className="mt-10 bg-white text-gray-800 rounded-3xl p-8">

          <h2 className="text-3xl font-bold mb-6">
            สร้างจดหมายข่าว
          </h2>

          <div className="grid gap-4">

            <input
              type="text"
              placeholder="หัวข้อข่าว"
              className="border p-4 rounded-xl"
            />

            <textarea
              placeholder="รายละเอียดข่าว"
              className="border p-4 rounded-xl h-40"
            />

            <input
              type="file"
              multiple
              className="border p-4 rounded-xl"
            />

            <button className="bg-blue-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition">
              Generate ข่าวอัตโนมัติ
            </button>

          </div>

        </div>

      </section>
    </main>
  );
}