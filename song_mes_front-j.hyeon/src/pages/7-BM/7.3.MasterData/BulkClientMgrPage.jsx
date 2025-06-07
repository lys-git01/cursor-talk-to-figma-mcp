// 7.3.3.거래담당일괄변경	A0120	bulkClientMgr	BM-7303
import { Button } from "primereact/button";
import useDialogStore from "@/store/dialogStore";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { faker } from "@faker-js/faker";
// import useToastStore from "@/store/toastStore";

// 샘플 데이터 생성 함수
const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `EMP${1000 + index}`,
    name: faker.person.fullName(),
    clientCount: Math.floor(Math.random() * 50),
    status: Math.random() < 0.8 ? "재직" : "퇴사",
  }));
};

const generateClientList = (managerId, count = 20) => {
  return Array.from({ length: count }, (_, index) => ({
    code: `CLI${1000 + index}`,
    grade: ["A", "B", "C"][Math.floor(Math.random() * 3)],
    name: faker.company.name(),
    managerId: managerId, // 담당자 ID 추가
  }));
};

const sampleList = generateSampleList(30);
// 각 담당자별 거래처 목록 생성
const allClientLists = sampleList.reduce((acc, manager) => {
  acc[manager.id] = generateClientList(manager.id, manager.clientCount);
  return acc;
}, {});

const BulkClientMgrPage = () => {
  const [data, setData] = useState(sampleList);
  const [clientData, setClientData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const openDialog = useDialogStore((s) => s.openDialog);
  const [filterType, setFilterType] = useState("전체");

  // 첫 로드시 첫 번째 거래담당자 선택
  useEffect(() => {
    if (data.length > 0 && !selectedRow) {
      const firstManager = data[0];
      setSelectedRow(firstManager);
      setClientData(allClientLists[firstManager.id]);
    }
  }, [data]);

  const onRowSelect = (event) => {
    setSelectedRow(event.data);
    // 선택된 담당자의 거래처 목록을 가져오는 로직
    setClientData(allClientLists[event.data.id]);
  };

  const editBtn = (rowData) => {
    openDialog("BulkClientMgrForm7303", {
      data: {
        currentManager: `${rowData.id} ${rowData.name}`,
        clientList: allClientLists[rowData.id],
      },
    });
  };

  useEffect(() => {
    if (filterType === "전체") {
      setData(sampleList);
    } else {
      const filtered = sampleList.filter((item) => item.status === filterType);
      setData(filtered);
    }
  }, [filterType]);

  return (
    <div id="BulkClientMgr">
      <div className="common-search">
        <div className="common-search__input">
          <label htmlFor="filterType">조회구분</label>
          <Dropdown
            value={filterType}
            options={["전체", "퇴사", "재직"]}
            onChange={(e) => setFilterType(e.value)}
            placeholder="선택"
          />
        </div>
      </div>

      <div className="BulkClientMgr-con content-box flex gap-3">
        <section className="datatable width-50">
          <div className="datatable__header">
            <h3>거래담당자 목록</h3>
            <p>총 거래처 수 {data.length}곳</p>
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
            resizableColumns
            scrollHeight="flex"
            rowClassName={(rowData) => (rowData.status === "퇴사" ? "red-500" : "")}
          >
            <Column field="id" header="사번"></Column>
            <Column field="name" header="사원명"></Column>
            <Column field="clientCount" header="거래처수"></Column>
            <Column
              header="수정"
              body={(rowData) => (
                <div className="buttonSet">
                  <Button label="수정" outlined size="small" onClick={() => editBtn(rowData)} />
                </div>
              )}
              style={{ width: "150px" }}
            />
          </DataTable>
        </section>

        <section className="datatable width-50">
          <div className="datatable__header">
            <h3>거래담당자의 거래처목록</h3>
            {selectedRow && (
              <p>
                담당자: {selectedRow.name} ({selectedRow.id})
              </p>
            )}
          </div>

          <DataTable
            emptyMessage="데이터가 없습니다."
            value={clientData}
            showGridlines
            scrollable
            resizableColumns
            scrollHeight="flex"
          >
            <Column header="순번" body={(_, options) => options.rowIndex + 1} />
            <Column field="code" header="거래코드"></Column>
            <Column field="grade" header="등급"></Column>
            <Column field="name" header="거래처명"></Column>
          </DataTable>
        </section>
      </div>
    </div>
  );
};

export default BulkClientMgrPage;
