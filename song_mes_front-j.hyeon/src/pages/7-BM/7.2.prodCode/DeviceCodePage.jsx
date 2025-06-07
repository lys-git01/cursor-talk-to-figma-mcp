/* 7.2.5.기기코드등록 H1018, BM-7205 */

import { TabPanel, TabView } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { renderRow } from "@/utils/common";
import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";

const DeviceCodePage = () => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const showToast = useToastStore.getState().showToast;
  const [deviceCodeList, setDeviceCodeList] = useState([]);
  const [integratedDeviceList, setIntegratedDeviceList] = useState([]);
  const [selectedDeviceCode, setSelectedDeviceCode] = useState(null);
  const [selectedIntegratedDevice, setSelectedIntegratedDevice] = useState(null);
  // 임시 데이터 생성
  useEffect(() => {
    const tempDeviceCodes = Array.from({ length: 20 }, (_, i) => ({
      code: String(i + 1).padStart(3, "0"),
      name: faker.commerce.productName(),
      workType: faker.helpers.arrayElement(["작업기기1", "작업기기2", "작업기기3"]),
      order: faker.number.int({ min: 1, max: 100 }),
      screen: faker.helpers.arrayElement(["표시", "미표시"]),
      status: faker.helpers.arrayElement(["정상", "고장"]),
      process: faker.helpers.arrayElement(["체크", "미체크"]),
      useYn: faker.helpers.arrayElement(["사용", "미사용"]),
      manualCalc: faker.helpers.arrayElement(["사용", "미사용"]),
      workScore: faker.number.int({ min: 1, max: 100 }),
      speed: faker.number.int({ min: 1, max: 100 }),
      lossTime: faker.number.int({ min: 1, max: 100 }),
    }));
    setDeviceCodeList(tempDeviceCodes);
    setSelectedDeviceCode(tempDeviceCodes[0]);
  }, []);
  useEffect(() => {
    const tempIntegratedDeviceList = Array.from({ length: 20 }, (_, i) => ({
      order: i + 1,
      code: String(i + 1).padStart(3, "0"),
      name: faker.commerce.productName(),
      screen: faker.helpers.arrayElement(["표시", "미표시"]),
      useYn: faker.helpers.arrayElement(["사용", "미사용"]),
    }));
    setIntegratedDeviceList(tempIntegratedDeviceList);
    setSelectedIntegratedDevice(tempIntegratedDeviceList[0]);
  }, []);
  const handleAdd = (type) => {
    if (type !== "integrated") {
      openDialog("DeviceCodeForm7205", {
        state: "추가",
        onClose: (newData) => {
          setDeviceCodeList([...deviceCodeList, newData]);
        },
      });
    } else {
      openDialog("IntegratedDeviceForm7205", {
        state: "추가",
        onClose: (newData) => {
          setIntegratedDeviceList([...integratedDeviceList, newData]);
        },
      });
    }
  };
  const handleEdit = (rowData, type) => {
    if (type !== "integrated") {
      openDialog("DeviceCodeForm7205", {
        state: "수정",
        data: rowData,
        onClose: (updatedData) => {
          if (updatedData) {
            setDeviceCodeList(
              deviceCodeList.map((item) => (item.code === updatedData.code ? updatedData : item)),
            );
          }
        },
      });
    } else {
      openDialog("IntegratedDeviceForm7205", {
        state: "수정",
        data: rowData,
        onClose: (updatedData) => {
          if (updatedData) {
            setIntegratedDeviceList(
              integratedDeviceList.map((item) =>
                item.code === updatedData.code ? updatedData : item,
              ),
            );
          }
        },
      });
    }
  };

  const handleDelete = (rowData) => {
    const accept = () => {
      setDeviceCodeList(deviceCodeList.filter((item) => item.code !== rowData.code));
      showToast({
        severity: "info",
        summary: `기기코드 삭제`,
        detail: `${rowData.code}이(가) 삭제되었습니다.`,
        life: 3000,
      });
    };
    confirmDialog({
      message: `${rowData.code}을(를) 정말로 삭제하시겠습니까?`,
      header: `기기코드 삭제`,
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: accept,
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const actionBodyTemplate = (rowData, type) => (
    <div className="buttonSet">
      <Button label="수정" outlined size="small" onClick={() => handleEdit(rowData, type)} />
      <Button
        label="삭제"
        outlined
        size="small"
        severity="danger"
        onClick={() => handleDelete(rowData, type)}
      />
    </div>
  );

  const deviceCodeRows = [
    [{ label: "코드", value: selectedDeviceCode?.code }],
    [{ label: "통합기기명", value: selectedDeviceCode?.name }],
    [{ label: "작업기기", value: selectedDeviceCode?.workType }],
    [{ label: "표시순번", value: selectedDeviceCode?.order }],
    [{ label: "화면표시", value: selectedDeviceCode?.screen }],
    [{ label: "기계상태", value: selectedDeviceCode?.status }],
    [{ label: "공정체크", value: selectedDeviceCode?.process }],
    [{ label: "사용여부", value: selectedDeviceCode?.useYn }],
    [
      {
        label: "수작업 계산",
        value: selectedDeviceCode?.manualCalc,
        tooltip: "단가를 수작업으로 계산 여부",
      },
    ],
    [{ label: "작업점수", value: selectedDeviceCode?.workScore }],
    [{ label: "스피드", value: selectedDeviceCode?.speed }],
    [{ label: "로스타임", value: selectedDeviceCode?.lossTime }],
  ];
  const integratedDeviceRows = [
    [{ label: "통합코드", value: selectedIntegratedDevice?.code }],
    [{ label: "통합기기명", value: selectedIntegratedDevice?.name }],
    [{ label: "화면표시", value: selectedIntegratedDevice?.screen }],
    [{ label: "사용여부", value: selectedIntegratedDevice?.useYn }],
  ];
  const handleConfirmOrder = () => {
    console.log("보이는 순서 확정", integratedDeviceList);
  };

  return (
    <div id="DeviceCodePage">
      <TabView>
        <TabPanel header="기기코드등록">
          <div className="tab1 flex gap-3">
            <div className="width-50">
              <div className="datatable__header">
                <h3>기기코드</h3>
                <div className="con-header__btns">
                  <Button label="추가" onClick={handleAdd} />
                </div>
              </div>
              <div className="datatable__body mt-3">
                <DataTable
                  emptyMessage="등록된 기기코드가 없습니다."
                  value={deviceCodeList}
                  selectionMode="single"
                  selection={selectedDeviceCode}
                  onSelectionChange={(e) => setSelectedDeviceCode(e.value)}
                  dataKey="code"
                  showGridlines
                  scrollable
                  scrollHeight="flex"
                  resizableColumns
                  metaKeySelection={true}
                >
                  <Column field="code" header="코드" />
                  <Column field="name" header="통합기기명" />
                  <Column field="workType" header="작업기기" />
                  <Column field="screen" header="화면" />
                  <Column field="status" header="상태" />
                  <Column field="process" header="공정" />
                  <Column field="useYn" header="사용여부" />
                  <Column
                    body={(rowData) => actionBodyTemplate(rowData)}
                    header="수정/삭제"
                    style={{ width: "150px" }}
                  />
                </DataTable>
              </div>
            </div>
            <div className="detail width-50">
              <div className="con-header">
                <h4 className="con-header__title">기기코드 상세</h4>
              </div>
              <div className="con-body">
                {deviceCodeRows.map((row, idx) => renderRow(row, idx))}
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="통합기기관리">
          <div className="tab2 flex gap-3">
            <div className="width-50">
              <div className="datatable__header">
                <h3>통합기기관리</h3>
                <div className="con-header__btns flex gap-2">
                  <Button label="추가" onClick={() => handleAdd("integrated")} />
                  <Button
                    label="보이는 순서 확정"
                    severity="secondary"
                    onClick={handleConfirmOrder}
                  />
                </div>
              </div>
              <div className="datatable__body mt-3">
                <DataTable
                  emptyMessage="등록된 기기코드가 없습니다."
                  value={integratedDeviceList}
                  selectionMode="single"
                  selection={selectedIntegratedDevice}
                  onSelectionChange={(e) => setSelectedIntegratedDevice(e.value)}
                  dataKey="code"
                  showGridlines
                  scrollable
                  scrollHeight="flex"
                  resizableColumns
                  metaKeySelection={true}
                  reorderableColumns
                  reorderableRows
                  onRowReorder={(e) => setIntegratedDeviceList(e.value)}
                >
                  <Column field="order" header="순번" />
                  <Column header="DnD" rowReorder style={{ width: "3rem" }} />
                  <Column field="code" header="코드번호" />
                  <Column field="name" header="통합기기명" />
                  <Column field="screen" header="화면표시" />
                  <Column field="useYn" header="사용여부" />
                  <Column
                    body={(rowData) => actionBodyTemplate(rowData, "integrated")}
                    header="수정/삭제"
                    style={{ width: "150px" }}
                  />
                </DataTable>
              </div>
            </div>
            <div className="detail width-50">
              <div className="con-header">
                <h4 className="con-header__title">통합 기기코드 상세</h4>
              </div>
              <div className="con-body">
                {integratedDeviceRows.map((row, idx) => renderRow(row, idx))}
              </div>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default DeviceCodePage;
