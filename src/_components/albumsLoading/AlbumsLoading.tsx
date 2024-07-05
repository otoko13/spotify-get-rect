export default function AlbumsLoading() {
  return (
    <div className="grid max-md:grid-cols-2 grid-cols-6 max-md:gap-4 gap-10 h-full py-4">
      {Array.from(Array(24).keys()).map((n) => (
        <div key={n} className="skeleton aspect-square" />
      ))}
    </div>
  );
}
