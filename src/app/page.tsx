export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-6xl items-center px-6 py-16 sm:px-8">
      <div className="max-w-2xl rounded-[32px] border border-white/55 bg-white/45 p-8 shadow-[0_30px_80px_-40px_rgba(95,121,113,0.3)] backdrop-blur-xl sm:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.32em] text-[#6f817d]">
          Quiet workspace
        </p>
        <h1 className="mt-4 text-4xl leading-tight font-semibold text-[#273432] sm:text-5xl">
          Hello world
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-[#6f817d] sm:text-lg">
          A calmer palette can make the interface feel steadier and easier to
          stay with for longer sessions.
        </p>
      </div>
    </section>
  );
}
