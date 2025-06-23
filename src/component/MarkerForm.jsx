import React, { useState, useRef, useEffect } from 'react';
import './AddMarkerForm.css';

const MarkerForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    initialData || { name: '', type: '', latlng: null }
  );
  const popupRef = useRef(null);

  useEffect(() => {
    const input = popupRef.current?.querySelector('input');
    if (input) input.focus();
  }, []);

  const handleMouseDown = (e) => {
    const popup = popupRef.current;
    const offsetX = e.clientX - popup.getBoundingClientRect().left;
    const offsetY = e.clientY - popup.getBoundingClientRect().top;

    const onMouseMove = (eMove) => {
      popup.style.left = `${eMove.clientX - offsetX}px`;
      popup.style.top = `${eMove.clientY - offsetY}px`;
      popup.style.transform = 'none';
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleSubmit = () => {
    if (formData.name.trim() && formData.type.trim()) {
      onSubmit(formData);
    }
  };

  return (
   <div
  ref={popupRef}
  className="card shadow position-absolute p-3"
  onMouseDown={handleMouseDown}
  style={{
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '300px',
    zIndex: 1100,
  }}
>
  <div className="card-header bg-primary text-white fw-bold p-2">
    {initialData?.editingIndex != null ? '✏️ Sửa Marker' : '➕ Thêm Marker Mới'}
  </div>

  <div className="card-body p-2">
    <div className="mb-3">
      <label className="form-label">Tên marker:</label>
      <input
        type="text"
        className="form-control"
        placeholder="Nhập tên marker"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
      />
    </div>

    <div className="mb-3">
      <label className="form-label">Loại marker:</label>
      <select
        className="form-select"
        value={formData.type}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, type: e.target.value }))
        }
      >
        <option value="">-- Chọn loại marker --</option>
        <option value="UPE">UPE</option>
        <option value="Small Cell">Small Cell</option>
        <option value="Cell Remote">Cell Remote</option>
      </select>
    </div>

    <div className="d-flex justify-content-end gap-2">
      <button className="btn btn-secondary" onClick={onCancel}>
        ❌ Hủy
      </button>
      <button className="btn btn-success" onClick={handleSubmit}>
        ✅ {initialData?.editingIndex != null ? 'Lưu' : 'Thêm'}
      </button>
    </div>
  </div>
</div>

  );
};

export default MarkerForm;
