// 7.2.11.합지청구가등록	H1023	laminateBilling	BM-7211

import ComSearch from "@/components/ComSearch";
import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { renderRow } from "@/utils/common";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import React, { useEffect, useState } from "react";

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    code: (1000 + index).toString(),
    name: `Sample Name ${index + 1}`,
    count: Math.floor(Math.random() * 1000),
  }));
};

const generateBillingList = (vendorId, count = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `${vendorId}-${index + 1}`,
    weight: Math.floor(Math.random() * 1000),
    basicBilling: Math.floor(Math.random() * 1000000),
    extraBilling: Math.floor(Math.random() * 100000),
    vendorId: vendorId,
  }));
};

const sampleList = generateSampleList(30);

const LaminateBillingPage = () => {
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const showToast = useToastStore.getState().showToast;
  const [vendorData, setVendorData] = useState(sampleList);
  const [billingData, setBillingData] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const openDialog = useDialogStore((s) => s.openDialog);

  const searchCategory = {
    pageCode: 7211,
    text: ["거래처명"],
    select: [],
    callList: [],
    detailedSearch: {
      isUse: false,
    },
  };

  useEffect(() => {
    // TODO 백엔드 호출
    setVendorData(sampleList);
    if (sampleList.length > 0) {
      setSelectedVendor(sampleList[0]);
      const firstBillingList = generateBillingList(sampleList[0].code);
      setBillingData(firstBillingList);
      if (firstBillingList.length > 0) {
        setSelectedBilling(firstBillingList[0]);
      }
    }
  }, []);

  useEffect(() => {
    showToast({
      severity: "info",
      summary: "백엔드 api 데이터 호출",
      detail: `saveObject: ${JSON.stringify(saveObject)}`,
    });
  }, [saveObject]);

  // 거래처 선택 시 해당 거래처의 합지청구가 목록 로드
  useEffect(() => {
    if (selectedVendor) {
      // TODO: 백엔드 API 호출로 변경
      const vendorBillings = generateBillingList(selectedVendor.code);
      setBillingData(vendorBillings);
      if (vendorBillings.length > 0) {
        setSelectedBilling(vendorBillings[0]);
      } else {
        setSelectedBilling(null);
      }
    } else {
      setBillingData([]);
      setSelectedBilling(null);
    }
  }, [selectedVendor]);

  const onVendorSelect = (event) => {
    showToast({
      severity: "info",
      summary: "거래처 선택",
      detail: `거래처: ${event.data.name}`,
      life: 3000,
    });
  };

  const onBillingSelect = (event) => {
    showToast({
      severity: "info",
      summary: "합지청구가 선택",
      detail: `중량: ${event.data.weight}kg`,
      life: 3000,
    });
  };

  // TODO
  const deleteBtn = () => {
    confirmDialog({
      message: `${selectedBilling.id}을(를) 정말로 삭제하시겠습니까?`,
      header: "합지청구가 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const accept = () => {
    showToast({
      severity: "info",
      summary: "합지청구가 삭제",
      detail: "합지청구가 삭제되었습니다.",
      life: 3000,
    });
  };

  // TODO
  const addBtn = () => {
    openDialog("LaminateBillingForm7211", {
      state: "추가",
      vendor: selectedVendor,
      onClose: (data) => {
        showToast({
          severity: "success",
          summary: `${data.code} 저장 완료`,
          detail: "저장되었습니다.",
          life: 3000,
        });
      },
    });
  };

  const fixBillingPrice = () => {
    showToast({
      severity: "info",
      summary: "청구단가 고정",
      detail: "청구단가가 고정되었습니다.",
      life: 3000,
    });
  };

  const editBtn = () => {
    openDialog("LaminateBillingForm7211", {
      state: "수정",
      vendor: selectedVendor,
      billing: selectedBilling,
      onClose: (data) => {
        showToast({
          severity: "success",
          summary: `${data.code} 저장 완료`,
          detail: "저장되었습니다.",
          life: 3000,
        });
      },
    });
  };

  const basicInfoRows = [
    {
      label: "거래처코드",
      value: selectedVendor?.id,
    },
    {
      label: "거래처명",
      value: selectedVendor?.name,
    },
    {
      label: "합지중량",
      value: selectedBilling?.weight,
    },
    {
      label: "기본청구가",
      value: selectedBilling?.basicBilling,
    },
    {
      label: "기타청구가",
      value: selectedBilling?.extraBilling,
    },
  ];
  return (
    <div id="LaminateBilling">
      <ComSearch searchCategory={searchCategory} setSaveObject={setSaveObject} />
      <div className="LaminateBilling-con content-box">
        <section className="datatable">
          <div className="datatable__header">
            <h3>거래처 목록</h3>
          </div>
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={vendorData}
            selectionMode={"single"}
            selection={selectedVendor}
            onSelectionChange={(e) => setSelectedVendor(e.value)}
            onRowSelect={onVendorSelect}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            scrollHeight="flex"
            resizableColumns
          >
            <Column header="순번" body={(_, options) => options.rowIndex + 1} />
            <Column field="name" header="거래처명"></Column>
            <Column field="count" header="등록건수"></Column>
          </DataTable>
        </section>
        <section className="datatable">
          <div className="datatable__header">
            <h3>합지청구가 목록</h3>
            <div className="datatable__btns">
              <Button
                label="삭제"
                size="small"
                severity="danger"
                icon="pi pi-times"
                onClick={deleteBtn}
              />
              <Button label="추가" size="small" icon="pi pi-plus" onClick={addBtn} />
            </div>
          </div>
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={billingData}
            selectionMode={"single"}
            selection={selectedBilling}
            onSelectionChange={(e) => setSelectedBilling(e.value)}
            onRowSelect={onBillingSelect}
            metaKeySelection={true}
            dataKey="id"
            showGridlines
            scrollable
            scrollHeight="flex"
            resizableColumns
          >
            <Column field="weight" header="중량"></Column>
            <Column field="basicBilling" header="기본청구"></Column>
            <Column field="extraBilling" header="기타청구"></Column>
          </DataTable>
        </section>
        <section className="detail">
          <div className="con-header">
            <h4 className="con-header__title">
              기본정보
              <Tag value="청구가 고정"></Tag>
            </h4>
            <div className="con-header__btns">
              <Button size="small" label="청구단가 고정" onClick={fixBillingPrice} />
              <Button size="small" label="수정" severity="secondary" onClick={editBtn} />
            </div>
          </div>
          <div className="con-body">{basicInfoRows.map((row, idx) => renderRow([row], idx))}</div>
        </section>
      </div>
    </div>
  );
};

export default LaminateBillingPage;
