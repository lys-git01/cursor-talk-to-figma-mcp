/* 발행인 선택	L5004 DG-issuerSelect DG-80 */

import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { faker } from "@faker-js/faker";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

// 임시 데이터 생성
const tempIssuerSelect = () =>
  Array.from({ length: 6 }, () => ({
    id: faker.string.uuid(),
    issuerCode: faker.string.numeric(4),
    issuerName: faker.company.name(),
    amount: faker.number.int({ min: 1000, max: 100000 }),
  }));

const DGIssuerSelect = ({ onCloseFn }) => {
  const toast = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchValues, setSearchValues] = useState({
    issuerCode: "",
    issuerName: "",
  });

  // 검색 처리
  const handleSearch = () => {
    // 실제로는 API 호출을 통해 데이터를 가져와야 합니다
    setTableData(tempIssuerSelect());
    toast.current.show({
      severity: "success",
      summary: "검색 완료",
      detail: "발행인 목록을 조회했습니다.",
    });
  };

  // 추가 처리
  const handleAdd = () => {
    const newRow = {
      id: faker.string.uuid(),
      issuerCode: searchValues.issuerCode,
      issuerName: searchValues.issuerName,
      amount: 0,
    };
    setTableData([...tableData, newRow]);
    toast.current.show({
      severity: "success",
      summary: "추가 완료",
      detail: "새로운 발행인이 추가되었습니다.",
    });
  };

  // 선택 처리
  const handleSelect = () => {
    if (!selectedRow) {
      toast.current.show({
        severity: "warn",
        summary: "경고",
        detail: "발행인을 선택해주세요.",
      });
      return;
    }
    onCloseFn(selectedRow);
  };

  return (
    <Dialog
      header="발행인 선택"
      visible
      onHide={() => onCloseFn(null)}
      className="DGIssuerSelect"
      style={{ width: "50vw" }}
    >
      <Toast ref={toast} />

      <div className="Dialog-container">
        {/* 검색 영역 */}
        <div className="search-area mb-3">
          <div className="flex gap-3 items-center">
            <label>거래처</label>
            <InputText
              value={searchValues.issuerCode}
              onChange={(e) => setSearchValues((prev) => ({ ...prev, issuerCode: e.target.value }))}
              placeholder="거래처 코드"
              className="w-32"
            />
            <InputText
              value={searchValues.issuerName}
              onChange={(e) => setSearchValues((prev) => ({ ...prev, issuerName: e.target.value }))}
              placeholder="거래처 이름"
              className="w-32"
            />
            <Button label="검색" onClick={handleSearch} />
            <Button label="추가" onClick={handleAdd} severity="secondary" />
          </div>
        </div>

        {/* 테이블 영역 */}
        <div className="table-area">
          <DataTable
            value={tableData}
            selection={selectedRow}
            onSelectionChange={(e) => setSelectedRow(e.value)}
            selectionMode="single"
            dataKey="id"
            emptyMessage="내역이 없습니다."
            scrollable
            scrollHeight="300px"
          >
            <Column field="issuerCode" header="거래처 코드" />
            <Column field="issuerName" header="거래처 이름" />
            <Column field="amount" header="유형" />
          </DataTable>
        </div>
      </div>

      {/* 버튼 영역 */}
      <div className="Dialog__btns mt-3">
        <Button label="선택" onClick={handleSelect} />
        <Button label="닫기" severity="secondary" onClick={() => onCloseFn(null)} />
      </div>
    </Dialog>
  );
};

export default DGIssuerSelect;
