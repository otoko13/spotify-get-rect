export default function AlbumsLoading() {
  return (
    <div className="pb-4 pt-20 px-4">
      <div className="grid max-md:grid-cols-2 grid-cols-6 max-md:gap-4 gap-10 mb-10 max-md:mb-4">
        {Array.from(Array(24).keys()).map((n) => (
          <div key={n} className="skeleton aspect-square" />
        ))}
      </div>
    </div>
  );
}
