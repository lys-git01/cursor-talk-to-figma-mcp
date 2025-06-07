/* 7.1.4.사용자등록 A9001, BM-7104 */
import ComSearch from "@/components/ComSearch";
import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import React, { useEffect, useState } from "react";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { faker } from "@faker-js/faker";
import UserEntryDetail from "@/components/7-BM/UserEntryDetail";
import useDialogStore from "@/store/dialogStore";

const USESTATUS = ["사용", "미사용"];

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    num: index + 1,
    id: faker.string.alphanumeric(10).toLowerCase(),
    name: `Sample Name ${index + 1}`,
    useOperationSearch: USESTATUS[Math.floor(Math.random() * USESTATUS.length)],
    useOfficeSearch: USESTATUS[Math.floor(Math.random() * USESTATUS.length)],
    usePOSearch: USESTATUS[Math.floor(Math.random() * USESTATUS.length)],
    useFieldSearch: USESTATUS[Math.floor(Math.random() * USESTATUS.length)],
  }));
};

const sampleList = generateSampleList(30);

const UserEntryPage = () => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const [data, setData] = useState();
  const [selectedRow, setSelectedRow] = useState(null);
  const showToast = useToastStore.getState().showToast;
  const searchCategory = {
    pageCode: 7104,
    text: ["사원이름"],
    select: ["select1", "select2", "select3", "select4", "select5"],
    callList: [],
    detailedSearch: {
      isUse: false,
    },
  };
  useEffect(() => {
    // TODO 백엔드 호출
    setData(sampleList);
    setSelectedRow(sampleList[0]);
  }, []);
  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "Product Selected",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
  };
  // TODO
  useEffect(() => {
    showToast({
      severity: "info",
      summary: "백엔드 api 데이터 호출",
      detail: `saveObject: ${JSON.stringify(saveObject)}`,
    });
  }, [saveObject]);

  // TODO
  const deleteBtn = () => {
    confirmDialog({
      message: `${selectedRow.name}을(를) 정말로 삭제하시겠습니까?`,
      header: "사원 삭제",
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
      summary: "사원 삭제",
      detail: "사원가 삭제되었습니다.",
      life: 3000,
    });
  };
  const addBtn = () => {
    openDialog("AddUserEntry7104", {
      state: "추가",
    });
  };
  return (
    <div id="UserEntry">
      <ComSearch searchCategory={searchCategory} setSaveObject={setSaveObject} />
      <div className="UserEntry-con content-box">
        <section className="datatable">
          <div className="datatable__header">
            <h3>사용자 목록</h3>
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
            value={data}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => setSelectedRow(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="id"
            showGridlines
            scrollable
            scrollHeight="flex"
            // virtualScrollerOptions={{ itemSize: 43 }}
            resizableColumns
          >
            <Column field="num" header="순번"></Column>
            <Column field="id" header="사번"></Column>
            <Column field="name" header="사원이름"></Column>
            <Column field="useOperationSearch" header="운영관리"></Column>
            <Column field="useOfficeSearch" header="사무실"></Column>
            <Column field="usePOSearch" header="포스"></Column>
            <Column field="useFieldSearch" header="현장"></Column>
          </DataTable>
        </section>

        {/* 상세내용 */}
        <UserEntryDetail selectedRow={selectedRow} />
      </div>
    </div>
  );
};

export default UserEntryPage;
