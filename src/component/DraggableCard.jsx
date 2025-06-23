import React, { useRef, useEffect } from 'react';

const DraggableCard = ({
  children,
  onClose,
  title = 'Thông tin',
  width = 300,
}) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const initialLeft = (viewportWidth - width) / 2;
      const initialTop = (viewportHeight - card.offsetHeight) / 2;
      card.style.left = `${initialLeft}px`;
      card.style.top = `${initialTop}px`;
    }
  }, [width]);

  const handleDragStart = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const shiftX = e.clientX - card.getBoundingClientRect().left;
    const shiftY = e.clientY - card.getBoundingClientRect().top;

    const moveAt = (pageX, pageY) => {
      card.style.left = `${pageX - shiftX}px`;
      card.style.top = `${pageY - shiftY}px`;
    };

    const onMouseMove = (e) => {
      moveAt(e.pageX, e.pageY);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      ref={cardRef}
      className="card shadow position-absolute"
      style={{
        width,
        zIndex: 1100,
        position: 'fixed', // dùng fixed để luôn nằm giữa màn hình
      }}
    >
      <div
        className="card-header fw-bold d-flex justify-content-between align-items-center bg-light"
        onMouseDown={handleDragStart}
        style={{ cursor: 'move', userSelect: 'none' }}
      >
        {title}
        {onClose && (
          <button className="btn btn-sm btn-close" onClick={onClose}></button>
        )}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
};

export default DraggableCard;
