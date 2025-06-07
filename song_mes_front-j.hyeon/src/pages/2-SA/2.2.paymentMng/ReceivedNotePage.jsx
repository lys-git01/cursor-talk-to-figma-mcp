/* 2.2.7.받은어음관리 : A8560, SA-2207 */

import { useEffect, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Panel } from "primereact/panel";
import ComSearch from "@/components/ComSearch";
import { faker } from "@faker-js/faker";
import useToastStore from "@/store/toastStore";
import { formatNumberWithCommas, renderRow } from "@/utils/common";
import useDialogStore from "@/store/dialogStore";

const ReceivedNotePage = () => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((state) => state.openDialog);

  const [saveObject, setSaveObject] = useState({}); // 검색용
  const [receivedNoteList, setReceivedNoteList] = useState([]);
  const [selectedReceivedNote, setSelectedReceivedNote] = useState(null);
  const [receivedNoteDetailList, setReceivedNoteDetailList] = useState([]);
  const [totalAmount, setTotalAmount] = useState({ occurPrice: 0, totalPrice: 0, balance: 0 });
  const [originalReceivedNoteList, setOriginalReceivedNoteList] = useState([]);

  // 임시 데이터 생성
  useEffect(() => {
    const getRandomDate = () => {
      const today = new Date();
      const randomDays = Math.floor(Math.random() * 61) - 30; // -30에서 +30 사이의 랜덤한 일수
      const date = new Date(today.getTime() + randomDays * 24 * 60 * 60 * 1000);
      return date
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\. /g, "-")
        .replace(".", "");
    };

    const tempReceivedNoteList = Array.from({ length: 20 }, (_, i) => ({
      rowNum: i + 1,
      slipDate: "2025-06-05",
      id: faker.helpers.arrayElement(["1001", "1002", "1003"]),
      customerName: faker.helpers.arrayElement(["A기업", "B기업", "C기업"]),
      depositDate: "2025-06-04",
      type: "전자",
      status: "보유",
      publisher: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
      discount: faker.number.int({ min: 1, max: 100 }),
      noteNum: faker.string.uuid(),
      expireDate: getRandomDate(),
      occurPrice: faker.number.int({ min: 1000, max: 1000000 }),
      totalPrice: faker.number.int({ min: 1000, max: 1000000 }),
      balance: faker.number.int({ min: 0, max: 1000000 }),
      memo: `test ${i + 1}`,
      // 상세목록
      phoneNumber: faker.phone.number(),
      faxNumber: faker.phone.number(),
      managerCode: faker.helpers.arrayElement(["1001", "1002", "1003"]),
      managerName: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
      bankName: faker.helpers.arrayElement(["국민은행", "농협은행", "신한은행"]),
    }));

    // 상세목록 테이블 데이터 생성
    const tempReceivedNoteDetailList = Array.from({ length: 5 }, (_, i) => ({
      rowNum: `detail ${faker.number.int({ min: 1000, max: 9999 })}`,
      appointDate: "2025-06-04",
      planType: faker.helpers.arrayElement(["만기예정", "완료"]),
      // planPrice: faker.number.int({ min: 0, max: 1000000 }),
      planPrice: 0,
      planMemo: faker.lorem.sentence(),
    }));

    setOriginalReceivedNoteList(tempReceivedNoteList);
    setReceivedNoteList(tempReceivedNoteList.filter((item) => item.balance > 0));
    setSelectedReceivedNote(tempReceivedNoteList[0]);
    setReceivedNoteDetailList(tempReceivedNoteDetailList);
  }, []);

  // useEffect(() => {
  //   if (saveObject.balance) setReceivedNoteList(originalReceivedNoteList);
  //   else setReceivedNoteList(originalReceivedNoteList.filter((item) => item.balance > 0));
  // }, [saveObject]);

  const searchCategory = {
    pageCode: 2207,
    dates: [
      {
        startDate: "1YearAgo",
        endDate: "today",
        labelOptions: ["전표일자", "만기일자", "입금일자"],
      },
    ],
    text: [],
    select: ["select1", "select2"],
    checkbox: ["잔액없음 포함"],
    detailedSearch: {
      isUse: true,
      detailList: {
        text: ["거래처", "발행인"],
        select: ["할인여부"],
        callList: ["어음종류", "어음처리"],
        dateText: [],
      },
    },
  };

  // TODO
  const handleAddOrEditBtn = (rowData, type) => {
    if (type === "list") {
      openDialog("DGNoteStatusEdit", {
        data: rowData,
        callback: (result) => {
          if (result) {
            setSelectedReceivedNote({
              ...selectedReceivedNote,
              status: result.status,
            });
          }
        },
      });
    } else {
      openDialog("PaymentPromiseForm2207", {
        data: rowData,
        callback: (result) => {
          console.log(result);
        },
      });
    }
  };

  const deleteBtn = (rowData) => {
    setReceivedNoteDetailList(
      receivedNoteDetailList.filter((item) => item.rowNum !== rowData.rowNum),
    );
  };

  const handleIssuerInfo = (rowData) => {
    openDialog("DGIssuerInfo", {
      data: rowData,
    });
  };

  const handleExcel = () => {
    showToast({
      severity: "info",
      summary: "알림",
      detail: "엑셀",
    });
  };

  const actionBodyTemplate = (rowData, type) => {
    const isDisabled = type === "detail" && rowData.planPrice;

    return (
      <div className="buttonSet" style={{ opacity: isDisabled ? 0.5 : 1 }}>
        <Button
          label="수정"
          outlined
          size="small"
          onClick={() => {
            handleAddOrEditBtn(rowData, type);
          }}
          disabled={isDisabled}
          className={isDisabled ? "disabled-button" : ""}
          style={
            isDisabled
              ? {
                  backgroundColor: "var(--gray-100)",
                  borderColor: "var(--gray-300)",
                  opacity: "0.6",
                  color: "var(--gray-500)",
                }
              : {}
          }
        />
        {type === "detail" && (
          <Button
            label="삭제"
            outlined
            size="small"
            severity="danger"
            onClick={() => deleteBtn(rowData)}
            disabled={isDisabled}
            className={isDisabled ? "disabled-button" : ""}
            style={
              isDisabled
                ? {
                    backgroundColor: "var(--gray-100)",
                    borderColor: "var(--gray-300)",
                    opacity: "0.6",
                    color: "var(--gray-500)",
                  }
                : {}
            }
          />
        )}
      </div>
    );
  };

  const publisherBtn = (rowData) => {
    if (rowData.isGrandTotal) return null;
    return (
      <Button
        label={`${rowData.publisher}`}
        outlined
        size="small"
        onClick={() => {
          handleIssuerInfo(rowData);
        }}
        style={{ width: "70px" }}
      />
    );
  };

  // 선택된 항목들의 합계 계산
  useEffect(() => {
    if (receivedNoteList.length > 0) {
      const total = receivedNoteList.reduce(
        (acc, item) => ({
          occurPrice: acc.occurPrice + item.occurPrice,
          totalPrice: acc.totalPrice + item.totalPrice,
          balance: acc.balance + item.balance,
        }),
        { occurPrice: 0, totalPrice: 0, balance: 0 },
      );
      setTotalAmount(total);
    } else {
      setTotalAmount({ occurPrice: 0, totalPrice: 0, balance: 0 });
    }
  }, [receivedNoteList]);

  // 합계 데이터 생성 함수
  const addGrandTotal = (data) => {
    const grandTotal = data.reduce(
      (acc, row) => ({
        occurPrice: (acc.occurPrice || 0) + row.occurPrice,
        totalPrice: (acc.totalPrice || 0) + row.totalPrice,
        balance: (acc.balance || 0) + row.balance,
      }),
      {},
    );

    return {
      isGrandTotal: true,
      ...grandTotal,
    };
  };

  // 합계가 포함된 데이터
  const grandTotalRow = useMemo(() => {
    return addGrandTotal(receivedNoteList);
  }, [receivedNoteList]);

  const valueEmptyCheck = (value) => {
    if (!value) return value;
    return formatNumberWithCommas(value);
  };

  // TODO
  const receivedNoteDetails = [
    [
      {
        label: "발행인",
        value: `${selectedReceivedNote?.customerName} ${selectedReceivedNote?.publisher}`,
      },
    ],
    [{ label: "전화번호", value: selectedReceivedNote?.phoneNumber }],
    [{ label: "팩스", value: selectedReceivedNote?.faxNumber }],
    [
      {
        label: "담당자",
        value: `${selectedReceivedNote?.managerCode} ${selectedReceivedNote?.managerName}`,
      },
    ],
    [{ label: "어음번호", value: selectedReceivedNote?.noteNum }],
    [{ label: "발행은행", value: selectedReceivedNote?.bankName }],
  ];

  // DataTable 스타일 추가
  const getRowClassName = (rowData) => {
    if (rowData.isGrandTotal) return "pivot-table-grandtotal-row";

    const today = new Date();
    const expireDate = new Date(rowData.expireDate);

    if (rowData.balance === 0) {
      return "text-blue-500";
    } else if (rowData.balance !== 0 && expireDate < today) {
      return "text-red-500";
    }
    return "";
  };

  return (
    <div id="SAContainer" className="has-abs-btns">
      <ComSearch searchCategory={searchCategory} setSaveObject={setSaveObject} />
      <div className="sa-half-con-ver2 datatable-con">
        <section className="datatable width-100">
          <div className="datatable__body mt-3">
            <DataTable
              emptyMessage="데이터가 없습니다."
              value={[...receivedNoteList, grandTotalRow]}
              selectionMode="single"
              selection={selectedReceivedNote}
              onSelectionChange={(e) => setSelectedReceivedNote(e.value)}
              dataKey="noteNum"
              showGridlines
              scrollable
              scrollHeight="flex"
              resizableColumns
              metaKeySelection={true}
              rowClassName={getRowClassName}
            >
              <Column field="rowNum" header="순번" className="text-center" />
              <Column
                body={(rowData) =>
                  rowData.isGrandTotal ? "합계" : actionBodyTemplate(rowData, "list")
                }
                header="수정"
                style={{ width: "90px" }}
                className="text-center"
              />
              <Column field="slipDate" header="전표일" />
              <Column field="customerName" header="거래처" />
              <Column field="depositDate" header="입금일" />
              <Column field="type" header="종류" />
              <Column field="status" header="현황" />
              <Column
                field="publisher"
                header="발행인"
                body={(rowData) => publisherBtn(rowData)}
                className="text-center"
              />
              <Column field="discount" header="할인" />
              <Column field="noteNum" header="어음번호" />
              <Column field="expireDate" header="만기일" />
              <Column
                field="occurPrice"
                header="발생금액"
                className="text-right"
                body={(rowData) => valueEmptyCheck(rowData.totalPrice)}
              />
              <Column
                field="totalPrice"
                header="입금총액"
                className="text-right"
                body={(rowData) => valueEmptyCheck(rowData.totalPrice)}
              />
              <Column
                field="balance"
                header="잔액"
                className="text-right"
                body={(rowData) => valueEmptyCheck(rowData.balance)}
              />
              <Column field="memo" header="메모" />
            </DataTable>
          </div>
        </section>
      </div>
      <section className="detail">
        <div className="con-body mt-5 flex justify-between">
          <div className="left-con" style={{ flex: "0.6" }}>
            {receivedNoteDetails.map((row, idx) => renderRow(row, idx))}
            <Panel header="메모" className="mt-6">
              <p className="memo">{selectedReceivedNote?.memo}</p>
            </Panel>
          </div>
          <div className="right-con flex-1 ml-3">
            <div className="text-right">
              <Button label="수금계획추가" onClick={() => handleAddOrEditBtn(null, "detail")} />
            </div>
            <div className="sa-half-con-ver2 mt-3">
              <DataTable
                emptyMessage="데이터가 없습니다."
                value={receivedNoteDetailList}
                dataKey="noteNum"
                showGridlines
                scrollable
                scrollHeight="flex"
                resizableColumns
                metaKeySelection={true}
                rowClassName={getRowClassName}
                className="width-100"
              >
                <Column field="appointDate" header="약속일자" />
                <Column field="planType" header="구분" />
                <Column
                  field="planPrice"
                  header="입금금액"
                  className="text-right"
                  body={(rowData) => valueEmptyCheck(rowData.planPrice)}
                />
                <Column field="planMemo" header="비고" />
                <Column
                  body={(rowData) => actionBodyTemplate(rowData, "detail")}
                  header="수정/삭제"
                  style={{ width: "150px" }}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </section>
      <div className="abs_btns">
        <Button label="엑셀" icon="pi pi-file-excel" onClick={handleExcel} />
      </div>
    </div>
  );
};

export default ReceivedNotePage;
