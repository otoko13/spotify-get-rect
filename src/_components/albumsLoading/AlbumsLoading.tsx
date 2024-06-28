export default function AlbumsLoading() {
  return (
    <div className="grid grid-cols-6 gap-10 h-full">
      {Array.from(Array(24).keys()).map((n) => (
        <div key={n} className="skeleton aspect-square" />
      ))}
    </div>
  );
}
