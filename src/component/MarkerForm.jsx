import React, { useState, useRef, useEffect } from 'react';
import './AddMarkerForm.css';
import * as XLSX from 'xlsx';
import { type } from '@testing-library/user-event/dist/type';
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


const handleImportExcel = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const data = new Uint8Array(event.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      alert('❌ File Excel không có dữ liệu.');
      return;
    }

    const validMarkers = jsonData
      .map((row, index) => {
        const lat = parseFloat(row.lat);
        const lng = parseFloat(row.lng);

        if (
          row.name &&
         
          !isNaN(lat) &&
          !isNaN(lng)
        ) {
          return {
            name: row.name,
            type: "UPE",
            latlng: {"lat":lat,"lng" :lng},
          };
        } else {
          console.warn(`⚠️ Dòng ${index + 2} bị bỏ qua do thiếu hoặc sai định dạng.`);
          return null;
        }
      })
      .filter((m) => m !== null);

   if (validMarkers.length === 0) {
  alert(
    '⚠️ Không có dòng hợp lệ để import!\n\n' +
    'Yêu cầu: File Excel phải có đầy đủ 4 cột: name, type, lat, lng\n\n' +
    '📄 Ví dụ:\n' +
    '+----------------------+--------------+-----------+------------+\n' +
    '|        name          |    type      |   lat     |    lng     |\n' +
    '+----------------------+--------------+-----------+------------+\n' +
    '| Marker A             | UPE          | 9.757898  | 105.641654 |\n' +
    '| Marker B             | Small Cell   | 9.609246  | 105.473545 |\n' +
    '+----------------------+--------------+-----------+------------+'
  );
  return;
}


   console.log(validMarkers)
   validMarkers.map(async(item,index)=>{
    console.log(item)
    await onSubmit(item)
   })
  };

  reader.readAsArrayBuffer(file);
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
      <label className="form-label">Tên trạm:</label>
      <input
        type="text"
        className="form-control"
        placeholder="Nhập tên trạm"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value,type:"UPE" }))
        }
      />
    </div>

    {/* <div className="mb-3">
      <label className="form-label">Loại trạm:</label>
      <select
        className="form-select"
        value={formData.type}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, type: e.target.value }))
        }
      >
        <option value="">-- Chọn loại trạm --</option>

        <option value="UPE">UPE</option>
        <option value="Small Cell">Small Cell</option>
        <option value="Cell Remote">Cell Remote</option>
        {/* <option value="Mang xong">Măng Xông</option> */}
      {/* </select>
    </div> */}

    <div className="d-flex justify-content-end gap-2">
              <input
          type="file"
          accept=".xlsx, .xls"
          style={{ display: 'none' }}
          id="excelInput"
          onChange={handleImportExcel}
        />
        <button
          className="btn btn-outline-primary"
          onClick={() => document.getElementById('excelInput').click()}
        >
          📥 Import từ Excel
        </button>

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
