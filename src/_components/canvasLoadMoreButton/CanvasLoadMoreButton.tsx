interface CanvasLoadMoreButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

export default function CanvasLoadMoreButton({
  disabled,
  onClick,
}: CanvasLoadMoreButtonProps) {
  return (
    <button
      className="btn btn-neutral absolute bottom-24 right-8"
      disabled={disabled}
      onClick={onClick}
    >
      Load more
    </button>
  );
}
