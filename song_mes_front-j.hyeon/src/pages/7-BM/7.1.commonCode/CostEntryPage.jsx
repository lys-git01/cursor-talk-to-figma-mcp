// 7.1.3.단가표등록	H1017	costEntry	BM-7103

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { renderRow } from "@/utils/common";
import { confirmDialog } from "primereact/confirmdialog";
import useToastStore from "@/store/toastStore";
import useDialogStore from "@/store/dialogStore";

const CostEntryPage = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore.getState().openDialog;
  const [data, setData] = useState([
    { code: "00001", name: "삼성전자" },
    { code: "00002", name: "LG화학" },
    { code: "00003", name: "한화솔루션" },
    { code: "00004", name: "포스코" },
    { code: "00005", name: "SK하이닉스" },
  ]);
  const [form, setForm] = useState({
    creditName: "",
    creditCode: "",
  });
  useEffect(() => {
    setSelectedRow(data[0]);
  }, []);

  // 거래처별 합지 단가표 샘플 데이터
  const hapjiDataMap = {
    "00001": [
      { id: 1, weight: 80, originPrice: 1200, normalPrice: 1100 },
      { id: 2, weight: 100, originPrice: 1500, normalPrice: 1400 },
    ],
    "00002": [
      { id: 1, weight: 90, originPrice: 1300, normalPrice: 1200 },
      { id: 2, weight: 110, originPrice: 1600, normalPrice: 1500 },
    ],
    "00003": [
      { id: 1, weight: 120, originPrice: 1800, normalPrice: 1700 },
      { id: 2, weight: 150, originPrice: 2100, normalPrice: 2000 },
    ],
    "00004": [
      { id: 1, weight: 200, originPrice: 2500, normalPrice: 2400 },
      { id: 2, weight: 220, originPrice: 2700, normalPrice: 2600 },
    ],
    "00005": [
      { id: 1, weight: 300, originPrice: 3500, normalPrice: 3400 },
      { id: 2, weight: 320, originPrice: 3700, normalPrice: 3600 },
    ],
  };

  // 거래처별 가공비 단가표 샘플 데이터
  const gagongbiDataMap = {
    "00001": [
      { id: 1, garo: 1, sero: 1, inPrint: 1, etc: 1 },
      { id: 2, garo: 2, sero: 2, inPrint: 2, etc: 2 },
    ],
    "00002": [
      { id: 1, garo: 3, sero: 3, inPrint: 3, etc: 3 },
      { id: 2, garo: 4, sero: 4, inPrint: 4, etc: 4 },
    ],
    "00003": [
      { id: 1, garo: 5, sero: 5, inPrint: 5, etc: 5 },
      { id: 2, garo: 6, sero: 6, inPrint: 6, etc: 6 },
    ],
    "00004": [
      { id: 1, garo: 7, sero: 7, inPrint: 7, etc: 7 },
      { id: 2, garo: 8, sero: 8, inPrint: 8, etc: 8 },
    ],
    "00005": [
      { id: 1, garo: 9, sero: 9, inPrint: 9, etc: 9 },
      { id: 2, garo: 10, sero: 10, inPrint: 10, etc: 10 },
    ],
  };

  const [gagongbiData, setGagongbiData] = useState(gagongbiDataMap["00001"]);
  const [selectedGagongbiRow, setSelectedGagongbiRow] = useState(gagongbiData[0]);

  // 가공비 상세 행 렌더링
  const gagongbiRows = [
    [{ label: "코드", value: selectedRow ? selectedRow.code : "" }],
    [{ label: "거래처명", value: selectedRow ? selectedRow.name : "" }],
    [{ label: "가로", value: selectedGagongbiRow ? selectedGagongbiRow.garo : "" }],
    [{ label: "세로", value: selectedGagongbiRow ? selectedGagongbiRow.sero : "" }],
    [{ label: "인쇄지단가", value: selectedGagongbiRow ? selectedGagongbiRow.inPrint : "" }],
    [{ label: "기타단가", value: selectedGagongbiRow ? selectedGagongbiRow.etc : "" }],
  ];
  // 선택된 거래처에 따라 합지 단가표를 보여주기 위한 상태
  const [hapjiData, setHapjiData] = useState(hapjiDataMap["00001"]);
  const [selectedHapjiRow, setSelectedHapjiRow] = useState(hapjiData[0]);
  const hapjiRows = [
    [{ label: "코드", value: selectedRow ? selectedRow.code : "" }],
    [{ label: "거래처명", value: selectedRow ? selectedRow.name : "" }],
    [{ label: "평량(g)", value: selectedHapjiRow ? selectedHapjiRow.weight : "" }],
    [{ label: "원방합지단가", value: selectedHapjiRow ? selectedHapjiRow.originPrice : "" }],
    [{ label: "일반합지단가", value: selectedHapjiRow ? selectedHapjiRow.normalPrice : "" }],
  ];

  // 거래처 전체 데이터(초기값 보관)
  const initialData = [
    { code: "00001", name: "삼성전자" },
    { code: "00002", name: "LG화학" },
    { code: "00003", name: "한화솔루션" },
    { code: "00004", name: "포스코" },
    { code: "00005", name: "SK하이닉스" },
  ];

  // 거래처 선택 시 해당 거래처의 합지 단가표로 변경
  const handleRowSelect = (e) => {
    setSelectedRow(e.value);
    setHapjiData(hapjiDataMap[e.value.code] || []);
  };

  const handleHapjiRowSelect = (e) => {
    setSelectedHapjiRow(e.value);
  };

  // 검색 기능
  const handleSearch = () => {
    const filtered = initialData.filter(
      (item) =>
        (!form.creditName || item.name.includes(form.creditName)) &&
        (!form.creditCode || item.code.includes(form.creditCode)),
    );
    setData(filtered);
    setSelectedRow(filtered[0] || null);
  };

  // 초기화 기능
  const handleReset = () => {
    setForm({ creditName: "", creditCode: "" });
    setData(initialData);
    setSelectedRow(initialData[0]);
  };

  // 합지 단가표 삭제 기능
  const handleDeleteHapji = () => {
    // TODO
    confirmDialog({
      message: `${selectedHapjiRow.weight}을(를) 정말로 삭제하시겠습니까?`,
      header: "합지 단가표 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };
  const accept = () => {
    if (!selectedHapjiRow) return;
    const newList = hapjiData.filter((row) => row.id !== selectedHapjiRow.id);
    setHapjiData(newList);
    setSelectedHapjiRow(newList[0] || null);
    showToast({
      severity: "info",
      summary: "합지 단가표 삭제",
      detail: "합지 단가표가 삭제되었습니다.",
      life: 3000,
    });
  };

  // 거래처 선택 시 가공비 단가표도 변경
  useEffect(() => {
    if (selectedRow) {
      setHapjiData(hapjiDataMap[selectedRow.code] || []);
      setGagongbiData(gagongbiDataMap[selectedRow.code] || []);
      setSelectedHapjiRow((hapjiDataMap[selectedRow.code] || [])[0]);
      setSelectedGagongbiRow((gagongbiDataMap[selectedRow.code] || [])[0]);
    }
  }, [selectedRow]);

  const handleGagongbiRowSelect = (e) => {
    setSelectedGagongbiRow(e.value);
  };
  const handleAdd = (type, state) => {
    if (type === "hapji") {
      openDialog("CostEntryPageForm7103", {
        data: {
          code: selectedRow.code,
          name: selectedRow.name,
          weight: state === "추가" ? "" : selectedHapjiRow.weight,
          originPrice: state === "추가" ? "" : selectedHapjiRow.originPrice,
          normalPrice: state === "추가" ? "" : selectedHapjiRow.normalPrice,
        },
        type,
        state,
      });
    } else if (type === "gagongbi") {
      openDialog("CostEntryPageForm7103", {
        data: {
          code: selectedRow.code,
          name: selectedRow.name,
          garo: state === "추가" ? "" : selectedGagongbiRow.garo,
          sero: state === "추가" ? "" : selectedGagongbiRow.sero,
          inPrint: state === "추가" ? "" : selectedGagongbiRow.inPrint,
          etc: state === "추가" ? "" : selectedGagongbiRow.etc,
        },
        type,
        state,
      });
    }
  };
  return (
    <div id="costEntryPage">
      {/* 좌측 영역 */}
      <div className="costEntryPage__left">
        {/* 검색 영역 */}
        <section className="common-search">
          <div className="flex flex-col gap-2">
            <div className="common-search__input" key="creditName">
              <label htmlFor="creditName">거래처명</label>
              <InputText
                className="w-fix"
                placeholder="거래처명"
                name="creditName"
                id="creditName"
                value={form.creditName}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    creditName: e.target.value,
                  }))
                }
              />
            </div>
            <div className="common-search__input" key="creditCode">
              <label htmlFor="creditCode">거래처코드</label>
              <InputText
                className="w-fix"
                placeholder="거래처코드"
                name="creditCode"
                id="creditCode"
                value={form.creditCode}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    creditCode: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button label="검색" icon="pi pi-search" iconPos="right" onClick={handleSearch} />
            <Button
              label="초기화"
              icon="pi pi-refresh"
              severity="secondary"
              iconPos="right"
              onClick={handleReset}
            />
          </div>
        </section>
        {/* 거래처 테이블 */}
        <section className="datatable">
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={data}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={handleRowSelect}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            scrollHeight="flex"
            resizableColumns
          >
            <Column header="순번" body={(_, options) => options.rowIndex + 1} />
            <Column field="code" header="거래처코드"></Column>
            <Column field="name" header="거래처명"></Column>
          </DataTable>
        </section>
      </div>
      {/* 우측 영역 */}
      <div className="costEntryPage__right">
        {/* TabView */}
        <TabView>
          <TabPanel header="합지 단가표 생성">
            <div className="costEntryPage__tableAndDetail">
              {/* 합지 단가표 목록 테이블 */}
              <section className="datatable">
                <div className="datatable__header">
                  <h3>합지 단가표 목록</h3>
                  <div className="datatable__btns">
                    <Button
                      label="삭제"
                      size="small"
                      severity="danger"
                      icon="pi pi-times"
                      onClick={handleDeleteHapji}
                    />
                    <Button
                      label="추가"
                      size="small"
                      icon="pi pi-plus"
                      onClick={() => handleAdd("hapji", "추가")}
                    />
                  </div>
                </div>
                <DataTable
                  emptyMessage="데이터가 없습니다."
                  value={hapjiData}
                  selectionMode="single"
                  selection={selectedHapjiRow}
                  onSelectionChange={handleHapjiRowSelect}
                  metaKeySelection={true}
                  dataKey="id"
                  showGridlines
                  scrollable
                  scrollHeight="flex"
                  resizableColumns
                >
                  <Column header="순번" body={(_, options) => options.rowIndex + 1} />
                  <Column field="weight" header="평량(g)" />
                  <Column field="originPrice" header="원방합지단가" />
                  <Column field="normalPrice" header="일반합지단가" />
                </DataTable>
              </section>
              {/* 상세 정보 */}
              <div className="detail">
                <div className="con-header">
                  <h4 className="con-header__title">합지 단가표 상세</h4>
                  <div className="con-header__btns">
                    <Button
                      label="수정"
                      severity="secondary"
                      onClick={() => handleAdd("hapji", "수정")}
                    />
                  </div>
                </div>
                <div className="con-body">{hapjiRows.map((row, idx) => renderRow(row, idx))}</div>
              </div>
            </div>
          </TabPanel>
          <TabPanel header="가공비 단가표 생성">
            <div className="costEntryPage__tableAndDetail">
              {/* 가공비 단가표 목록 테이블 */}
              <section className="datatable">
                <div className="datatable__header">
                  <h3>가공비 단가표 목록</h3>
                  <div className="datatable__btns">
                    <Button
                      label="삭제"
                      size="small"
                      severity="danger"
                      icon="pi pi-times"
                      onClick={() => {}}
                    />
                    <Button
                      label="추가"
                      size="small"
                      icon="pi pi-plus"
                      onClick={() => handleAdd("gagongbi", "추가")}
                    />
                  </div>
                </div>
                <DataTable
                  emptyMessage="데이터가 없습니다."
                  value={gagongbiData}
                  selectionMode="single"
                  selection={selectedGagongbiRow}
                  onSelectionChange={handleGagongbiRowSelect}
                  metaKeySelection={true}
                  dataKey="id"
                  showGridlines
                  scrollable
                  scrollHeight="flex"
                  resizableColumns
                >
                  <Column header="순번" body={(_, options) => options.rowIndex + 1} />
                  <Column field="garo" header="가로" />
                  <Column field="sero" header="세로" />
                  <Column field="inPrint" header="인쇄지단가" />
                  <Column field="etc" header="기타단가" />
                </DataTable>
              </section>
              {/* 상세 정보 */}
              <div className="detail">
                <div className="con-header">
                  <h4 className="con-header__title">가공비 단가표 상세</h4>
                  <div className="con-header__btns">
                    <Button
                      label="수정"
                      severity="secondary"
                      onClick={() => handleAdd("gagongbi", "수정")}
                    />
                  </div>
                </div>
                <div className="con-body">
                  {gagongbiRows.map((row, idx) => renderRow(row, idx))}
                </div>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default CostEntryPage;
