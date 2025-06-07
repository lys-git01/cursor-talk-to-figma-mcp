/* 발행인정보 L5005	DG-issuerInfo DG-75 */

import useDialogStore from "@/store/dialogStore";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { loadDaumPostcodeScript, handleAddressSearch } from "@/utils/addressSearch";

const DGIssuerInfo = ({ onCloseFn, data }) => {
  const toast = useRef(null);
  const openDialog = useDialogStore((s) => s.openDialog);
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    issuerName: "홍길동",
    representative: "아무개",
    creditStatus: "여신현황",
    phone: "010-1234-1234",
    fax: "032-1234-1234",
    zipCode: "123-123",
    address: ["회사상세주소", "상세주소"],
    manager: "홍길동",
    managerPhone: "010-1234-1234",
    memo: data?.memo || "",
  });

  useEffect(() => {
    const script = loadDaumPostcodeScript();
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: 저장 로직 구현
    setIsEditMode(false);
    toast.current.show({
      severity: "success",
      summary: "저장 완료",
      detail: "발행인 정보가 저장되었습니다.",
    });
  };

  const handleEditMode = () => {
    setOriginalData({ ...formData });
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditMode(false);
  };

  const handleViewHistory = () => {
    openDialog("DGSalesLookup", {
      data: data?.customerName,
    });
  };

  const handleViewChanges = () => {
    openDialog("DGClientManagerChan", {
      data: data,
    });
  };

  const onAddressSelect = (data) => {
    setFormData((prev) => ({
      ...prev,
      zipCode: data.zonecode,
      address: [data.address, ""],
    }));
  };

  const basicInfoRows = [
    [{ label: "발행자 이름", field: "issuerName", value: formData.issuerName }],
    [{ label: "대표자 성명", field: "representative", value: formData.representative }],
    [
      {
        label: "여신현황",
        field: "creditStatus",
        value: formData.creditStatus,
        type: "dropdown",
        options: ["불량", "여신현황"],
      },
    ],
    [{ label: "핸드폰", field: "phone", value: formData.phone }],
    [{ label: "팩스", field: "fax", value: formData.fax }],
  ];

  const addressRows = isEditMode
    ? [
        [
          {
            label: "주소",
            field: "address",
            value: [
              formData.zipCode && formData.address[0]
                ? `${formData.zipCode} | ${formData.address[0]}`
                : "",
              formData.address[1] || "",
            ],
            isAddress: true,
          },
        ],
      ]
    : [
        [{ label: "우편번호", field: "zipCode", value: formData.zipCode }],
        [
          {
            label: "주소",
            field: "address",
            value: formData.address,
            isAddress: true,
          },
        ],
      ];

  const managerRows = [
    [{ label: "담당자", field: "manager", value: formData.manager }],
    [{ label: "담당자 전화", field: "managerPhone", value: formData.managerPhone }],
  ];

  return (
    <Dialog
      header={`발행인 정보`}
      visible
      onHide={() => onCloseFn(null)}
      className="DGIssuerInfo"
      style={{ width: "30vw" }}
    >
      <Toast ref={toast} />
      <div className="Dialog-container form-list">
        {!isEditMode && (
          <div className="dialog-editBtn">
            <Button label="수정" onClick={handleEditMode} />
          </div>
        )}
        {[...basicInfoRows, ...addressRows, ...managerRows].map((row, idx) => (
          <div key={idx} className="form__input">
            <p>{row[0].label}</p>
            <div className="flex items-center justify-between" style={{ width: "100%" }}>
              {isEditMode ? (
                row[0].type === "dropdown" ? (
                  <Dropdown
                    value={row[0].value}
                    options={row[0].options}
                    onChange={(e) => handleInputChange(row[0].field, e.value)}
                    className="width-100"
                  />
                ) : row[0].isAddress ? (
                  <div className="width-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        label="주소검색"
                        size="small"
                        onClick={() => handleAddressSearch(onAddressSelect)}
                        style={{ width: "100px" }}
                      />
                      <InputText value={row[0].value[0]} className="width-100" readOnly />
                    </div>
                    <InputText
                      value={row[0].value[1]}
                      onChange={(e) =>
                        handleInputChange(row[0].field, [row[0].value[0], e.target.value])
                      }
                      placeholder="상세주소"
                      className="width-100"
                    />
                  </div>
                ) : (
                  <InputText
                    value={row[0].value}
                    onChange={(e) => handleInputChange(row[0].field, e.target.value)}
                    className="width-100"
                  />
                )
              ) : row[0].isAddress ? (
                <div>
                  <span>{row[0].value[0]}</span>
                  <br />
                  <span style={{ marginTop: "0.5rem", display: "block" }}>{row[0].value[1]}</span>
                </div>
              ) : (
                <span>{row[0].value}</span>
              )}
            </div>
          </div>
        ))}
        <div className="form__input">
          <p>메모</p>
          <InputTextarea
            value={formData.memo}
            onChange={(e) => handleInputChange("memo", e.target.value)}
            rows={5}
            placeholder="메모"
            disabled={!isEditMode}
          />
        </div>
      </div>
      <div className="Dialog__btns">
        {isEditMode ? (
          <>
            <Button label="취소" severity="secondary" onClick={handleCancel} />
            <Button label="저장" onClick={handleSave} />
          </>
        ) : (
          <Button label="닫기" severity="secondary" onClick={() => onCloseFn(null)} />
        )}
      </div>
    </Dialog>
  );
};

export default DGIssuerInfo;
