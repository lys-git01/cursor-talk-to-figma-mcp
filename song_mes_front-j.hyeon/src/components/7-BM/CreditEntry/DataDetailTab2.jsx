import { faker } from "@faker-js/faker";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import React, { useEffect, useState } from "react";
import { Column } from "primereact/column";
import useDialogStore from "@/store/dialogStore";

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => {
    const baseOrderNumber = 202501000000;
    return {
      orderNumber: String(baseOrderNumber + index + 1),
      orderDate: faker.date.recent({ days: 30 }).toISOString().split("T")[0],
      orderName: `${faker.company.name()} Order`,
      amount: faker.number.int({ min: 1000000, max: 100000000 }),
      author: faker.person.fullName(),
    };
  });
};
const sampleList = generateSampleList(30);

const DataDetailTab2 = ({ company = "company" }) => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const [salesDetails, setSalesDetails] = useState();

  useEffect(() => {
    // TODO 백엔드 데이터 호출
    console.log("회사명", company);
    setSalesDetails(sampleList);
  }, []);

  const updateMemoBtn = () => {
    openDialog(
      "UpdateMemo7102", // 고유는 뒤에 숫자
      { company: company || "거래처명" },
    );
  };

  return (
    <div>
      <div className="tab2">
        <div className="con-header">
          <h4 className="con-header__title">메모사항</h4>
          <Button label="수정" severity="secondary" onClick={updateMemoBtn} />
        </div>
        <div className="tab2-meno">
          <p>
            대표자주소:
            <br />
            법인번호: <br />
            주민번호: <br />
            전화번호:
            <br />
            결재담당:
            <br />
            작업담당: <br />
            결재일:
            <br />
            최초거래일: <br />
            거래동기및상담자:
            <br />
            사업개시일:
            <br />
            신용상태:
            <br />
            기타참조사항:
            <br />
          </p>
        </div>
        <div className="con-header">
          <Divider align="left">
            <b>매출내역</b>
          </Divider>
        </div>
        <DataTable
          emptyMessage="데이터가 없습니다."
          value={salesDetails}
          showGridlines
          scrollable
          size="small"
          scrollHeight="calc(60vh - 240px)"
          rowClassName={(rowData) => (rowData.quit ? "allRed" : "")}
        >
          <Column field="orderNumber" header="수주번호"></Column>
          <Column field="orderDate" header="수주일자"></Column>
          <Column field="orderName" header="수주명"></Column>
          <Column field="amount" header="금액"></Column>
          <Column field="author" header="작성자"></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default DataDetailTab2;
