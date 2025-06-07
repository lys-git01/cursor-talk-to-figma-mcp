/* 7.2.9.제지류공시가등록 : H1021, BM-7209 */

import { Button } from "primereact/button";
import useDialogStore from "@/store/dialogStore";
import { renderRow } from "@/utils/common";
import { formatNumberWithCommas } from "@/utils/common";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { faker } from "@faker-js/faker";
import useToastStore from "@/store/toastStore";
import { confirmDialog } from "primereact/confirmdialog";

const TYPES = ["합지", "인쇄지"];
const SELECT_OPTIONS = ["전체", ...TYPES];

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    id: (1000 + index).toString(),
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
    clientName: faker.company.name(),
    shortName: faker.company.name().slice(0, 5),
    englishName: faker.company.name().toUpperCase(),
    weight: faker.number.int({ min: 60, max: 250 }),
    width: faker.number.int({ min: 500, max: 1200 }),
    height: faker.number.int({ min: 700, max: 1500 }),
    publicPrice: faker.number.int({ min: 1000, max: 10000 }),
    quantity: faker.number.int({ min: 1, max: 1000 }),
  }));
};

const sampleList = generateSampleList(30);

const PaperPriceEntryPage = () => {
  const [data, setData] = useState(sampleList);
  const [selectedRow, setselectedRow] = useState(null);
  const openDialog = useDialogStore((s) => s.openDialog);
  const showToast = useToastStore.getState().showToast;
  const [filterType, setFilterType] = useState("전체");
  // TODO 백엔드 호출 상세 데이터 교체
  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "Product Selected",
      detail: `Name: ${event.data.clientName}`,
      life: 3000,
    });
  };

  useEffect(() => {
    setselectedRow(data[0]);
  }, []);

  // TODO
  const addBtn = () => {
    openDialog("PaperPriceEntry7209", {
      data,
      state: "추가",
    });
  };
  // TODO
  const deleteBtn = () => {
    console.log("deleteBtn", selectedRow);
    confirmDialog({
      message: `제지류공시가를 정말로 삭제하시겠습니까?`,
      header: "제지류공시가 삭제",
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
      summary: "제지류공시가 삭제",
      detail: "제지류공시가가 삭제되었습니다.",
      life: 3000,
    });
  };

  useEffect(() => {
    if (filterType === "전체") {
      setData(sampleList);
    } else {
      const filtered = sampleList.filter((item) => item.type === filterType);
      setData(filtered);
    }
  }, [filterType]);

  const basicInfoRows = [
    { label: "종이구분", value: selectedRow?.type },
    { label: "매출처", value: selectedRow?.clientName },
    { label: "간략명", value: selectedRow?.shortName },
    { label: "영문", value: selectedRow?.englishName },
    {
      label: "평량",
      value: formatNumberWithCommas(selectedRow?.weight ?? 0),
    },
    {
      label: "가로 사이즈",
      value: formatNumberWithCommas(selectedRow?.width ?? 0),
    },
    {
      label: "세로 사이즈",
      value: formatNumberWithCommas(selectedRow?.height ?? 0),
    },
    {
      label: "공시가격",
      value: formatNumberWithCommas(selectedRow?.publicPrice ?? 0),
    },
    {
      label: "공시수량",
      value: formatNumberWithCommas(selectedRow?.quantity ?? 0),
    },
  ];

  // TODO
  const editBtn = () => {
    openDialog("PaperPriceEntry7209", {
      selectedRow,
      state: "수정",
    });
  };
  return (
    <div id="PaperPriceEntry">
      <div className="common-search">
        <div className="common-search__input">
          <label htmlFor="filterType">조회구분</label>
          <Dropdown
            value={filterType}
            options={SELECT_OPTIONS.map((t) => ({ label: t, value: t }))}
            onChange={(e) => setFilterType(e.value)}
            placeholder="선택"
          />
        </div>
      </div>
      {/* 테이블 */}
      <div className="PaperPriceEntry-con content-box">
        <section className="datatable">
          <div
            className="datatable__header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3>제지류공시가 목록</h3>
            <div className="datatable__btns">
              <Button
                label="삭제"
                size="small"
                icon="pi pi-times"
                severity="danger"
                onClick={deleteBtn}
              />
              <Button label="추가" size="small" icon="pi pi-plus" onClick={addBtn} />
            </div>
          </div>

          <DataTable
            emptyMessage="데이터가 없습니다."
            value={data}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => setselectedRow(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="id"
            showGridlines
            scrollable
            resizableColumns
            scrollHeight="flex"
          >
            <Column field="type" header="종류"></Column>
            <Column field="clientName" header="거래처명"></Column>
            <Column field="shortName" header="단축명"></Column>
            <Column field="englishName" header="영문"></Column>
            <Column
              field="weight"
              header="평량"
              body={(rowData) => formatNumberWithCommas(rowData.weight)}
            ></Column>
            <Column
              field="width"
              header="가로"
              body={(rowData) => formatNumberWithCommas(rowData.width)}
            ></Column>
            <Column
              field="height"
              header="세로"
              body={(rowData) => formatNumberWithCommas(rowData.height)}
            ></Column>
            <Column
              field="publicPrice"
              header="공시가"
              body={(rowData) => formatNumberWithCommas(rowData.publicPrice)}
            ></Column>
            <Column
              field="quantity"
              header="수량"
              body={(rowData) => formatNumberWithCommas(rowData.quantity)}
            ></Column>
          </DataTable>
        </section>

        {/* 상세내용 */}
        <section className="detail">
          <div className="con-header">
            <div className="con-header__title">제지류 공시가 상세</div>
            <div className="con-header__btns">
              <Button label="수정" severity="secondary" onClick={editBtn} />
            </div>
          </div>

          <div className="con-body">{basicInfoRows.map((row, idx) => renderRow([row], idx))}</div>
        </section>
      </div>
    </div>
  );
};

export default PaperPriceEntryPage;
