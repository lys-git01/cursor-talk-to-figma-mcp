import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import useToastStore from "@/store/toastStore";
import { useParams, useNavigate } from "react-router-dom";
import { loadDaumPostcodeScript } from "@/utils/addressSearch";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const CutImageEntryFormPage = () => {
  const showToast = useToastStore.getState().showToast;
  const navigate = useNavigate();
  const { id } = useParams();
  const state = id ? "수정" : "추가";
  const [formData, setFormData] = useState({
    절수코드: id ?? "", // 수정,입력불가 참고용
    절수명: "",
    이미지목록: [],
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef();

  // TODO 수정시에는 기본값으로 데이터 넣어주기

  useEffect(() => {
    const script = loadDaumPostcodeScript();
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 파일 업로드 핸들러
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      이미지목록: [
        ...prev.이미지목록,
        ...files.map((file) => ({
          file,
          name: file.name,
          id: `${file.name}_${Date.now()}_${Math.random()}`,
        })),
      ],
    }));
  };

  // 드래그&드롭 업로드
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setFormData((prev) => ({
      ...prev,
      이미지목록: [
        ...prev.이미지목록,
        ...files.map((file) => ({
          file,
          name: file.name,
          id: `${file.name}_${Date.now()}_${Math.random()}`,
        })),
      ],
    }));
  };

  // 체크박스 선택
  const handleSelect = (e) => {
    setSelectedImages(e.value.map((img) => img.id));
  };

  // 삭제
  const handleDelete = () => {
    setFormData((prev) => ({
      ...prev,
      이미지목록: prev.이미지목록.filter((img) => !selectedImages.includes(img.id)),
    }));
    setSelectedImages([]);
  };

  // DataTable 썸네일 렌더링
  const imageBodyTemplate = (rowData) => {
    if (!rowData.file) return null;
    return (
      <img
        src={URL.createObjectURL(rowData.file)}
        alt={rowData.name}
        style={{ width: 48, height: 48, objectFit: "cover" }}
      />
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    showToast({
      severity: "info",
      summary: "저장",
      detail: "저장이 완료되었습니다.",
    });
  };

  return (
    <div className="CutImageEntryForm form-list">
      <Card>
        <h3 className="CutImageEntryForm__title">절수이미지 {state}</h3>
        <div>
          {state === "수정" && (
            <div className="form__input">
              <p>절수코드</p>
              <span>{formData?.절수코드}</span>
            </div>
          )}

          <div className="form__input">
            <p>절수명*</p>
            <InputText
              id="절수명"
              name="절수명"
              value={formData.절수명}
              onChange={handleChange}
              placeholder="절수명을 입력해주세요."
            />
          </div>

          {/* 이미지 업로드 영역 */}
          <div className="Img-upload" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
            <div>
              <input
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <i className="pi pi-images" />
              <Button
                label="파일 선택"
                onClick={() => fileInputRef.current.click()}
                style={{ marginBottom: 8 }}
              />
              <div>또는 파일을 여기로 끌어 놓으세요.</div>
            </div>
          </div>
          {/* 선택한 이미지 삭제 */}
          <div className="mb-2 flex justify-end">
            <Button
              label="이미지 삭제"
              onClick={handleDelete}
              disabled={selectedImages.length === 0}
            />
          </div>
          {/* 업로된 이미지 테이블 영역 */}
          <DataTable
            emptyMessage="등록된 이미지가 없습니다."
            value={formData.이미지목록}
            selection={formData.이미지목록.filter((img) => selectedImages.includes(img.id))}
            onSelectionChange={handleSelect}
            dataKey="id"
            showGridlines
            scrollable
            scrollHeight="flex"
            resizableColumns
            metaKeySelection={true}
            reorderableColumns
            reorderableRows
            onRowReorder={(e) => setFormData((prev) => ({ ...prev, 이미지목록: e.value }))}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column header="DnD" rowReorder style={{ width: "3rem" }} />
            <Column header="썸네일" body={imageBodyTemplate} style={{ width: "5rem" }} />
            <Column field="name" header="이미지명" />
          </DataTable>
          <div className="mt-4 flex justify-center gap-2">
            <Button label="취소" severity="secondary" type="button" onClick={() => navigate(-1)} />
            <Button label="저장" type="submit" onClick={handleSubmit} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CutImageEntryFormPage;
