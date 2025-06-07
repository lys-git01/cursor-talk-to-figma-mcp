/* 7.1.1.사용권한등록 H1020, BM-7101 */
import AuthEntryDetail from "@/components/7-BM/AuthEntryDetail";
import ComSearch from "@/components/ComSearch";
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    id: faker.string.alphanumeric(10).toLowerCase(),
    name: `Sample Name ${index + 1}`,
  }));
};

const sampleList = generateSampleList(30);
const AuthEntryPage = () => {
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const showToast = useToastStore.getState().showToast;
  const [data, setData] = useState();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const searchCategory = {
    pageCode: 7101,
    text: ["이름"],
    select: ["select1"],
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

  useEffect(() => {
    showToast({
      severity: "info",
      summary: "백엔드 api 데이터 호출",
      detail: `saveObject: ${JSON.stringify(saveObject)}`,
    });
  }, [saveObject]);

  const onRowSelect = (event) => {
    // 수정 중일 때는 행 선택 불가
    if (isEditing) return;

    setSelectedRow(event.data);
    showToast({
      severity: "info",
      summary: "Product Selected",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
  };

  const handleEditingChange = (editing) => {
    setIsEditing(editing);
  };

  return (
    <div id="AuthEntry">
      <ComSearch
        searchCategory={searchCategory}
        setSaveObject={setSaveObject}
        disabled={isEditing}
      />
      <div className="AuthEntry-con content-box">
        <section className="datatable mt-3">
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={data}
            selectionMode={isEditing ? null : "single"}
            selection={selectedRow}
            onSelectionChange={(e) => !isEditing && setSelectedRow(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="id"
            showGridlines
            scrollable
            scrollHeight="flex"
            // virtualScrollerOptions={{ itemSize: 43 }}
            resizableColumns
          >
            <Column field="id" header="사번"></Column>
            <Column field="name" header="사원이름"></Column>
          </DataTable>
        </section>
        <AuthEntryDetail selectedRow={selectedRow} onEditingChange={handleEditingChange} />
      </div>
    </div>
  );
};

export default AuthEntryPage;
