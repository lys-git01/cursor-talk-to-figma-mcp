/* 7.2.3.청구코드등록 H1014, BM-7203 */

import { Button } from "primereact/button";
import useDialogStore from "@/store/dialogStore";
import { renderRow } from "@/utils/common";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { faker } from "@faker-js/faker";
import useToastStore from "@/store/toastStore";
import { confirmDialog } from "primereact/confirmdialog";
import { Divider } from "primereact/divider";
import { getClaimCodeList } from "@/api/BM";

const TYPES = ["자재청구", "공정청구(기본)", "공정청구(확장)"];
const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    code: (1000 + index).toString(),
    name: faker.company.name(),
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
    displayOrder: Math.floor(Math.random() * 100),
    processCode: faker.company.name(),
    orderUnit: faker.company.name(),
    isDetailUnit: Math.random() < 0.5,
  }));
};

const sampleList = generateSampleList(30);

const BillingCodeEntryPage = () => {
  const [data, setData] = useState(sampleList);
  const [selectedRow, setselectedRow] = useState(null);
  const openDialog = useDialogStore((s) => s.openDialog);
  const showToast = useToastStore.getState().showToast;
  const [filterType, setFilterType] = useState("공정청구(확장)"); // 전체, 자재청구, 공정청구(기본)
  
  useEffect(() => {
    const fetchClaimCodeList = async () => {
      try {
        const res = await getClaimCodeList();
        setData(res.data);
      } catch (error) {
        showToast({
          severity: "error",
          summary: "청구코드 목록을 가져오는 데 실패했습니다",
          detail: error.message,
        });
      }
    };
    fetchClaimCodeList();
  }, []);

  // TODO 백엔드 호출 상세 데이터 교체
  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "행이 선택 되었습니다.",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
  };

  // TODO
  const addBtn = () => {
    openDialog("BillingCodeForm7203", {
      state: "추가",
    });
  };
  // TODO
  const deleteBtn = () => {
    console.log("deleteBtn", selectedRow);
    confirmDialog({
      message: `청구코드를 정말로 삭제하시겠습니까?`,
      header: "청구코드 삭제",
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
      summary: "청구코드 삭제",
      detail: "청구코드가 삭제되었습니다.",
      life: 3000,
    });
  };

  useEffect(() => {
    if (filterType === "전체") {
      setData(sampleList);
    } else {
      const filtered = sampleList.filter((item) => item.type === filterType);
      setselectedRow(filtered[0]);
      setData(filtered);
    }
  }, [filterType]);

  const basicInfoRows1 = [
    { label: "청구코드", value: selectedRow?.code },
    { label: "청구명", value: selectedRow?.name },
    { label: "표시순번", value: selectedRow?.displayOrder },
  ];
  const basicInfoRows2 = [
    { label: "공정코드", value: selectedRow?.processCode },
    { label: "수주서 작성시 단위", value: selectedRow?.orderUnit },
    {
      label: "수주서 작성시 세부 단위 유무",
      value: selectedRow?.isDetailUnit ? "사용" : "미사용",
      info: "* 예) 인쇄청구시 “수량”, “도＂일 경우 체크",
    },
  ];
  // TODO
  const editBtn = () => {
    openDialog("BillingCodeForm7203", {
      state: "수정",
      data: selectedRow,
    });
  };
  return (
    <div id="BillingCodeEntry">
      <div className="common-search">
        <div className="common-search__input">
          <label htmlFor="filterType">조회구분</label>
          <Dropdown
            value={filterType}
            options={["전체", "자재청구", "공정청구(기본)", "공정청구(확장)"]}
            onChange={(e) => setFilterType(e.value)}
            placeholder="선택"
          />
        </div>
      </div>
      {/* 테이블 */}
      <div className="BillingCodeEntry-con content-box flex gap-3">
        <section className="datatable width-50">
          <div className="datatable__header">
            <h3>청구코드 목록</h3>
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
            dataKey="code"
            showGridlines
            scrollable
            resizableColumns
            scrollHeight="flex"
          >
            <Column field="code" header="청구코드"></Column>
            <Column field="name" header="청구명"></Column>
          </DataTable>
        </section>

        {/* 상세내용 */}
        <section className="detail mt-3 width-50">
          <div className="con-header">
            <div className="con-header__title">청구코드 상세</div>
            <div className="con-header__btns">
              <Button label="수정" severity="secondary" onClick={editBtn} size="small" />
            </div>
          </div>

          <div className="con-body">
            {basicInfoRows1.map((row, idx) => renderRow([row], idx))}
            <Divider align="left">
              <b>자동 수주서 등록으로 전송할 경우를 대비</b>
            </Divider>
            {basicInfoRows2.map((row, idx) => renderRow([row], idx))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BillingCodeEntryPage;
