// {/* 7.2.4.공통코드등록 H1024, BM-7204 */}
import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";
import { renderRow } from "@/utils/common";

const CommonCodePage = () => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const showToast = useToastStore.getState().showToast;
  const [commonCodeList, setCommonCodeList] = useState([]);
  const [commonCodeDetailList, setCommonCodeDetailList] = useState([]);
  const [selectedCommonCode, setSelectedCommonCode] = useState(null);
  const [selectedCommonCodeDetail, setSelectedCommonCodeDetail] = useState(null);

  // 임시 데이터
  useEffect(() => {
    // faker를 이용해 공통코드 50개, 공통코드상세 100개 생성
    const tempCommonCodes = Array.from({ length: 50 }, (_, i) => ({
      code: String(i + 1).padStart(3, "0"),
      commonCode: String(i + 1).padStart(3, "0"),
      name: faker.commerce.department() + (i + 1),
      display1: faker.commerce.productAdjective(),
      display2: faker.commerce.productMaterial(),
      remark: faker.lorem.word(),
      order: String(faker.number.int({ min: 1000, max: 9999 })),
      useYn: faker.helpers.arrayElement(["사용", "미사용"]),
    }));
    const tempCommonCodeDetails = Array.from({ length: 100 }, (_, i) => {
      const commonCodeIdx = faker.number.int({ min: 0, max: 49 });
      return {
        code: String(i + 1).padStart(5, "0"),
        commonCode: tempCommonCodes[commonCodeIdx].code,
        name: faker.commerce.productName(),
        display1: faker.commerce.productAdjective(),
        display2: faker.commerce.productMaterial(),
        remark: faker.lorem.word(),
        order: String(faker.number.int({ min: 1000, max: 9999 })),
        useYn: faker.helpers.arrayElement(["사용", "미사용"]),
      };
    });
    setCommonCodeList(tempCommonCodes);
    setCommonCodeDetailList(tempCommonCodeDetails);

    if (tempCommonCodes.length > 0) {
      setSelectedCommonCode(tempCommonCodes[0]);
      const firstDetail = tempCommonCodeDetails.find(
        (detail) => detail.commonCode === tempCommonCodes[0].code,
      );
      if (firstDetail) setSelectedCommonCodeDetail(firstDetail);
    }
  }, []);

  // 공통코드 선택 시 상세코드 필터링
  useEffect(() => {
    if (selectedCommonCode) {
      const filtered = commonCodeDetailList.filter(
        (detail) => detail.commonCode === selectedCommonCode.code,
      );
      setSelectedCommonCodeDetail(filtered[0] || null);
    }
  }, [selectedCommonCode, commonCodeDetailList]);

  const handleAddCommonCodeDetail = () => {
    openDialog("CommonCodeForm7204", {
      state: "추가",
      onClose: (newData) => {
        setCommonCodeDetailList([...commonCodeDetailList, newData]);
      },
    });
  };

  const handleEdit = (rowData) => {
    openDialog("CommonCodeForm7204", {
      state: "수정",
      data: rowData,
      onClose: (updatedData) => {
        setCommonCodeDetailList(
          commonCodeDetailList.map((item) => (item.code === updatedData.code ? updatedData : item)),
        );
      },
    });
  };

  const handleDelete = (rowData) => {
    const accept = () => {
      setCommonCodeDetailList(commonCodeDetailList.filter((item) => item.code !== rowData.code));

      showToast({
        severity: "info",
        summary: `공통코드 상세 삭제`,
        detail: `${rowData.code}이(가) 삭제되었습니다.`,
        life: 3000,
      });
    };
    confirmDialog({
      message: `${rowData.code}을(를) 정말로 삭제하시겠습니까?`,
      header: `공통코드 상세 삭제`,
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: accept,
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const actionBodyTemplate = (rowData) => (
    <div className="buttonSet">
      <Button label="수정" outlined size="small" onClick={() => handleEdit(rowData)} />
      <Button
        label="삭제"
        outlined
        size="small"
        severity="danger"
        onClick={() => handleDelete(rowData)}
      />
    </div>
  );

  // 선택된 공통코드의 상세코드만 필터링
  const filteredDetailList = commonCodeDetailList.filter(
    (detail) => detail.commonCode === selectedCommonCode?.code,
  );

  const commonCodeRows = [
    [
      {
        label: "구분코드",
        value: selectedCommonCode?.commonCode,
      },
    ],
    [
      {
        label: "코드",
        value: selectedCommonCode?.code,
      },
    ],
    [
      {
        label: "표시명1",
        value: selectedCommonCode?.display1,
      },
    ],
    [
      {
        label: "표시명2",
        value: selectedCommonCode?.display2,
      },
    ],
    [
      {
        label: "비고",
        value: selectedCommonCode?.remark,
      },
    ],
    [
      {
        label: "표시순번",
        value: selectedCommonCode?.order,
      },
    ],
    [
      {
        label: "사용여부",
        value: selectedCommonCode?.useYn,
      },
    ],
  ];
  const detailCommonCodeRows = [
    [
      {
        label: "구분코드",
        value: selectedCommonCodeDetail?.commonCode,
      },
    ],
    [
      {
        label: "코드",
        value: selectedCommonCodeDetail?.code,
      },
    ],
    [
      {
        label: "표시명1",
        value: selectedCommonCodeDetail?.display1,
      },
    ],
    [
      {
        label: "표시명2",
        value: selectedCommonCodeDetail?.display2,
      },
    ],
    [
      {
        label: "비고",
        value: selectedCommonCodeDetail?.remark,
      },
    ],
    [
      {
        label: "표시순번",
        value: selectedCommonCodeDetail?.order,
      },
    ],
    [
      {
        label: "사용여부",
        value: selectedCommonCodeDetail?.useYn,
      },
    ],
  ];

  return (
    <div id="CommonCodeEntry">
      <div className="CommonCodeEntry-con flex gap-3">
        <section className="datatable width-50 flex gap-3">
          <div className="CommonCodeEntry-con__left">
            <div className="datatable__header">
              <h3>공통코드</h3>
            </div>
            <div className="datatable__body">
              <DataTable
                emptyMessage="등록된 공통코드가 없습니다."
                value={commonCodeList}
                selectionMode="single"
                selection={selectedCommonCode}
                onSelectionChange={(e) => setSelectedCommonCode(e.value)}
                dataKey="code"
                showGridlines
                scrollable
                scrollHeight="flex"
                resizableColumns
                metaKeySelection={true}
              >
                <Column field="code" header="코드" />
                <Column field="name" header="구분" />
              </DataTable>
            </div>
          </div>
          <div className="CommonCodeEntry-con__right">
            <div className="datatable__header">
              <h3>공통코드 상세</h3>
              <Button
                label="추가"
                size="small"
                icon="pi pi-plus"
                onClick={handleAddCommonCodeDetail}
                disabled={!selectedCommonCode}
              />
            </div>
            <div className="datatable__body">
              <DataTable
                emptyMessage="등록된 공통코드 상세가 없습니다."
                value={filteredDetailList}
                selectionMode="single"
                selection={selectedCommonCodeDetail}
                onSelectionChange={(e) => setSelectedCommonCodeDetail(e.value)}
                dataKey="code"
                showGridlines
                scrollable
                scrollHeight="flex"
                resizableColumns
                metaKeySelection={true}
              >
                <Column field="code" header="코드" />
                <Column field="name" header="공통코드명" />
                <Column
                  body={(rowData) => actionBodyTemplate(rowData)}
                  header="수정/삭제"
                  style={{ width: "150px" }}
                />
              </DataTable>
            </div>
          </div>
        </section>
        <section className="detail">
          {selectedCommonCodeDetail ? (
            <div>
              <div className="con-header">
                <h4 className="con-header__title">공통코드 상세</h4>
              </div>
              <div className="con-body">{detailCommonCodeRows.map((row) => renderRow(row))}</div>
            </div>
          ) : selectedCommonCode ? (
            <div>
              <div className="con-header">
                <h4 className="con-header__title">공통코드</h4>
              </div>
              <div className="con-body">{commonCodeRows.map((row) => renderRow(row))}</div>
            </div>
          ) : (
            <div>상세정보를 선택하세요.</div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CommonCodePage;
