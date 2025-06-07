import { faker } from "@faker-js/faker";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import React, { useEffect, useState } from "react";

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    num: index.toString(),
    prevPIC: faker.person.fullName(),
    newPIC: faker.person.fullName(),
    Reason: faker.lorem.sentence(),
    Modname: faker.person.fullName(),
    updateDate: faker.date.recent().toISOString().split("T")[0], // YYYY-MM-DD 형식
  }));
};
const sampleList = generateSampleList(30);

const AssigneeHis7102 = ({ onCloseFn, company }) => {
  const [picChangeHistory, setPicChangeHistory] = useState();

  useEffect(() => {
    // TODO 백엔드 데이터 호출
    console.log("회사명", company);
    setPicChangeHistory(sampleList);
  }, []);

  return (
    <Dialog
      header="담당자 변경내역"
      visible
      modal={false}
      tyle={{ width: "50vw" }}
      onHide={onCloseFn}
      className="assigneeHis"
      style={{ maxWidth: "1000px" }}
    >
      <div className="Dialog-container">
        <DataTable
          emptyMessage="데이터가 없습니다."
          value={picChangeHistory}
          showGridlines
          scrollable
          size="small"
          scrollHeight="calc(60vh - 240px)"
          // virtualScrollerOptions={{ itemSize: 43 }}
          // resizableColumns
          rowClassName={(rowData) => (rowData.quit ? "allRed" : "")}
        >
          <Column field="num" header="번호" style={{ width: "50px" }}></Column>
          <Column field="prevPIC" header="이전담당"></Column>
          <Column field="newPIC" header="변경담당"></Column>
          <Column field="Reason" header="사유"></Column>
          <Column field="Modname" header="수정자"></Column>
          <Column field="updateDate" header="수정일" style={{ width: "100px" }}></Column>
        </DataTable>
      </div>
      <div className="Dialog__btns">
        <Button label="닫기" severity="secondary" onClick={onCloseFn}></Button>
      </div>
    </Dialog>
  );
};

export default AssigneeHis7102;
