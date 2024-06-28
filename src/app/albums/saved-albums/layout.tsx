export default function SavedAlbumsLayout({
  modal,
  children,
}: {
  modal: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
