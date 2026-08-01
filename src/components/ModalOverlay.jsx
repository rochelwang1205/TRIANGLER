export default function ModalOverlay({ show, onClose, children, size = 'md' }) {
  if (!show) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <div className="modal-overlay" onClick={handleBackdropClick} role="presentation">
        <div className={`modal-box modal-box--${size}`} role="dialog">
          {children}
        </div>
      </div>
    </>
  );
}
