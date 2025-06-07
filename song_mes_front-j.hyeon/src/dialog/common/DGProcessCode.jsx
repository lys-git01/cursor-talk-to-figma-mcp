// 공정코드	L1018	DG-processCode	DG-08

import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";

// 샘플 데이터 생성
const processListSample = [
  { code: "P001", name: "재단" },
  { code: "P002", name: "인쇄" },
  { code: "P003", name: "코팅" },
];
const detailProcessSample = {
  P001: [
    { code: "D001", name: "재단-1" },
    { code: "D002", name: "재단-2" },
  ],
  P002: [
    { code: "D003", name: "인쇄-1" },
    { code: "D004", name: "인쇄-2" },
  ],
  P003: [
    { code: "D005", name: "코팅-1" },
    { code: "D006", name: "코팅-2" },
  ],
};

const DGProcessCode = ({ visible = true, onCloseFn = () => {} }) => {
  const [selectedProcess, setSelectedProcess] = useState(processListSample[0]);
  const [detailList, setDetailList] = useState(
    detailProcessSample[processListSample[0].code] || [],
  );
  const [selectedDetail, setSelectedDetail] = useState(
    detailProcessSample[processListSample[0].code]?.[0] || null,
  );
  const [search, setSearch] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const newDetailList = detailProcessSample[selectedProcess.code] || [];
    setDetailList(newDetailList);
    // 첫 번째 상세공정을 기본 선택
    setSelectedDetail(newDetailList.length > 0 ? newDetailList[0] : null);
    // 공정이 변경될 때 검색어 초기화
    setSearchKeyword("");
    setSearch("");
  }, [selectedProcess]);

  // 검색 필터링
  const filteredDetailList = detailList.filter((item) => item.name.includes(search));

  // 검색 버튼 클릭
  const handleSearch = () => {
    setSearch(searchKeyword);
  };

  // 검색어 입력
  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  // 저장 버튼 클릭
  const handleSave = () => {
    if (!selectedProcess || !selectedDetail) return;
    onCloseFn({ process: selectedProcess, detail: selectedDetail });
  };

  // 닫기 버튼 클릭
  const handleClose = () => {
    onCloseFn(null);
  };

  return (
    <Dialog
      header="공정코드"
      visible={visible}
      modal={false}
      onHide={handleClose}
      className="DGProcessCode"
    >
      <div className="DGProcessCode-info">
        <div>
          <p>공정</p>
          <span>{selectedProcess?.name}</span>
        </div>
        <div>
          <p>상세공정</p>
          <span>{selectedDetail?.name || ""}</span>
        </div>
      </div>
      <div className="flex gap-3">
        {/* 공정 리스트 */}
        <div style={{ flex: 1 }}>
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={processListSample}
            selectionMode="single"
            selection={selectedProcess}
            onSelectionChange={(e) => setSelectedProcess(e.value)}
            metaKeySelection={true}
            dataKey="code"
            scrollHeight="300px"
            style={{ minHeight: 300 }}
          >
            <Column field="name" header="공정명" />
          </DataTable>
        </div>
        {/* 상세공정 리스트 */}
        <div style={{ flex: 2 }}>
          <div className="DGProcessCode-search">
            <InputText
              type="text"
              placeholder="상세공정명"
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            <Button label="검색" onClick={handleSearch} />
          </div>
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={filteredDetailList}
            selectionMode="single"
            selection={selectedDetail}
            onSelectionChange={(e) => setSelectedDetail(e.value)}
            metaKeySelection={true}
            dataKey="code"
            scrollHeight="300px"
            style={{ minHeight: 300 }}
          >
            <Column field="name" header="상세공정명" />
          </DataTable>
        </div>
      </div>
      {/* 하단 버튼 */}
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={handleClose} />
        <Button label="저장" onClick={handleSave} disabled={!selectedProcess || !selectedDetail} />
      </div>
    </Dialog>
  );
};

export default DGProcessCode;
