export default function Stats() {
  return (
    <section className="bg-gray-900 border-t border-gray-800 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 grid-cols-2 gap-8 border-b border-gray-800 pb-8">
          <div className="text-center aos-init aos-animate" data-aos="fade-up" data-aos-duration="400">
            <h4 className="text-4xl font-bold mb-2">13+</h4>
            <small className="text-gray-400">Supported Networks</small>
          </div>
          <div className="text-center aos-init aos-animate" data-aos="fade-up" data-aos-duration="500">
            <h4 className="text-4xl font-bold mb-2">7,318</h4>
            <small className="text-gray-400">Weekly Trades</small>
          </div>
          <div className="text-center aos-init aos-animate" data-aos="fade-up" data-aos-duration="500">
            <h4 className="text-4xl font-bold mb-2">8.7 Min.</h4>
            <small className="text-gray-400">Avg. Processing Time</small>
          </div>
          <div className="text-center aos-init aos-animate" data-aos="fade-up" data-aos-duration="500">
            <h4 className="text-4xl font-bold mb-2">22K+</h4>
            <small className="text-gray-400">Active Users</small>
          </div>
        </div>
        <div className="mt-16 text-center aos-init aos-animate" data-aos="fade-up" data-aos-duration="400">
          <p className="font-bold text-gray-400 text-sm tracking-widest mb-4">SECURELY BUY, SELL, SIGN AND MANAGE TRANSACTIONS</p>
          <h1 className="text-5xl font-bold">Escrow exchange for 120+ cryptocurrencies</h1>
          <div className="mt-8 border border-gray-800 rounded-lg p-1">
            <iframe src="https://widget.coinlib.io/widget?type=full_v2&theme=dark&cnt=6&pref_coin_id=1505&graph=yes" width="100%" height="420px" scrolling="none" style={{border:0, margin:0, padding:0}}></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
