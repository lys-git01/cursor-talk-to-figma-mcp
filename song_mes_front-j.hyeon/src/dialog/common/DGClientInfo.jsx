// 거래처 정보 조회 L3006 DG-clientInfo DG-24

import useDialogStore from "@/store/dialogStore";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const DGClientInfo = ({ onCloseFn, data }) => {
  const toast = useRef(null);
  const openDialog = useDialogStore((s) => s.openDialog);

  const handleViewHistory = () => {
    openDialog("DGSalesLookup", {
      data: data?.customerName,
    });
  };

  const handleViewChanges = () => {
    openDialog("DGClientManagerChan", {
      data: data,
    });
  };

  const basicInfoRows = [
    [
      {
        label: "거래처코드",
        value: data?.customerCode,
        button: <Button label="거래내역보기" onClick={handleViewHistory} />,
      },
    ],
    [{ label: "거래처명", value: data?.customerName }],
    [{ label: "대표자", value: "대표자" }],
    [{ label: "사업자번호", value: "사업자번호" }],
    [{ label: "업태", value: "업태" }],
    [{ label: "업종", value: "업종" }],
    [{ label: "우편번호", value: "123-123" }],
    [
      {
        label: "회사주소",
        value: ["회사상세주소", "상세주소"],
        isAddress: true,
      },
    ],
    [{ label: "전화번호", value: "010-1234-1234" }],
    [{ label: "팩스번호", value: "032-1234-1234" }],
    [
      {
        label: "담당자",
        value: "홍길동",
        button: <Button label="변경내역보기" onClick={handleViewChanges} />,
      },
    ],
    [{ label: "최종매출일", value: "2025-01-01" }],
    [{ label: "금융기관", value: "금융기관" }],
    [{ label: "계좌번호", value: "계좌번호" }],
    [{ label: "에이징발생", value: "에이징발생" }],
    [{ label: "미수금", value: "0" }],
    [{ label: "어음잔액", value: "0" }],
  ];

  return (
    <Dialog
      header={`거래처 정보 조회`}
      visible
      onHide={() => onCloseFn(null)}
      className="DGClientInfo"
      style={{ width: "48vw" }}
    >
      <Toast ref={toast} />
      <div className="Dialog-container form-list">
        <div className="flex">
          <div className="left-container">
            {basicInfoRows.map((row, idx) => (
              <div key={idx} className="form__input">
                <p>{row[0].label}</p>
                <div className="flex items-center justify-between" style={{ width: "100%" }}>
                  {row[0].isAddress ? (
                    <div>
                      <span>{row[0].value[0]}</span>
                      <br />
                      <span style={{ marginTop: "0.5rem", display: "block" }}>
                        {row[0].value[1]}
                      </span>
                    </div>
                  ) : (
                    <>
                      <span>{row[0].value}</span>
                      {row[0].button}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="right-container width-50">
            <div className="form__input">
              <p>비고</p>
              <InputTextarea placeholder={"비고"} rows={26} />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between items-center mb-3">
            <p style={{ fontWeight: "bold" }}>합지 할인율</p>
          </div>
          <DataTable emptyMessage="내역이 없습니다.">
            <Column field="rowNum" header="순번" />
            <Column field="changeDate" header="변경일" />
            <Column field="discountRate" header="할인율" />
            <Column field="menu" header="비고" />
            <Column field="writer" header="입력자" />
          </DataTable>
        </div>
      </div>
      <div className="Dialog__btns">
        <Button label="닫기" severity="secondary" onClick={() => onCloseFn(null)} />
      </div>
    </Dialog>
  );
};

export default DGClientInfo;
