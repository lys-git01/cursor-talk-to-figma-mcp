/**
 * 부도어음관리 - 부도어음 내역
 */

import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { formatNumberWithCommas, renderRow } from "@/utils/common";
import { faker } from "@faker-js/faker";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { confirmDialog } from "primereact/confirmdialog";
import { useEffect, useMemo, useState } from "react";

const DTBouncedNoteDetail = ({ setSelectedCustomerName, pageCode }) => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((state) => state.openDialog);

  const [saveObject, setSaveObject] = useState({}); // 검색용
  const [bouncedNoteList, setBouncedNoteList] = useState([]);
  const [selectedBouncedNote, setSelectedBouncedNote] = useState(null);
  const [bouncedNoteDetailList, setBouncedNoteDetailList] = useState([]);
  const [totalAmount, setTotalAmount] = useState({
    bankruptcyPrice: 0,
    collectPrice: 0,
    balance: 0,
  });
  const [originalBouncedNoteList, setOriginalBouncedNoteList] = useState([]);

  // 임시 데이터 생성
  useEffect(() => {
    const tempBouncedNoteDetailList = Array.from({ length: 20 }, (_, i) => ({
      rowNum: i + 1,
      id: faker.helpers.arrayElement(["1001", "1002", "1003"]),
      customerName: faker.helpers.arrayElement(["A기업", "B기업", "C기업"]),
      managerCode: faker.helpers.arrayElement(["1001", "1002", "1003"]),
      managerName: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
      bankruptcyDate: "2025-06-05",
      type: faker.helpers.arrayElement(["약속어음", "당좌수표", "문방어음", "전자어음"]),
      billSt: faker.helpers.arrayElement([1, 2, 3, 4]),
      // billSt: faker.helpers.arrayElement(["전체", "진행중", "대손처리", "회수완료"]),
      expireDate: "2025-06-04",
      depositDate: "2025-06-04",
      bankruptcyPrice: faker.number.int({ min: 1000, max: 1000000 }),
      collectPrice: faker.number.int({ min: 1000, max: 1000000 }),
      balance: faker.number.int({ min: 0, max: 1000000 }),
      promiseDate: "2025-06-04",
      memo: `test ${i + 1}`,
      // 상세목록
      originLocation: "당사보관",
      publisher: faker.helpers.arrayElement(["A기업", "B기업", "C기업"]),
      noteNum: faker.string.uuid(),
    }));

    // 상세목록 테이블 데이터 생성
    const tempReceivedNoteDetailList = Array.from({ length: 20 }, (_, i) => ({
      promiseDate: "2025-06-04",
      reason: faker.lorem.sentence(),
      collectPrice: faker.number.int({ min: 0, max: 1000000 }),
    }));

    setOriginalBouncedNoteList(tempBouncedNoteDetailList);
    setBouncedNoteList(tempBouncedNoteDetailList.filter((item) => item.balance > 0));
    setSelectedBouncedNote(tempBouncedNoteDetailList[0]);
    setBouncedNoteDetailList(tempReceivedNoteDetailList);
    setSelectedCustomerName(tempBouncedNoteDetailList[0].customerName);
  }, []);

  // TODO
  const handleAddOrEdit = (rowData) => {
    openDialog("BouncedNoteForm2208", {
      data: rowData,
      callback: (result) => {
        if (result) {
          setSelectedBouncedNote({
            ...selectedBouncedNote,
            status: result.status,
          });
        }
      },
    });
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `부도어음 내역을(를) 정말로 삭제하시겠습니까?`,
      header: "부도어음 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        setBouncedNoteList(bouncedNoteList.filter((item) => item.id !== rowData.id));
        showToast({
          severity: "info",
          summary: "부도어음 삭제",
          detail: `부도어음 내역이(가) 삭제되었습니다.`,
          life: 3000,
        });
      },
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="buttonSet">
        <Button
          label="수정"
          outlined
          size="small"
          onClick={() => {
            handleAddOrEdit(rowData);
          }}
        />
        <Button
          label="삭제"
          outlined
          size="small"
          severity="danger"
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  // TODO
  const showImageBtn = () => {
    openDialog("DGImageViewer", {
      company: selectedBouncedNote?.customerName || "거래처명",
      title: "사업자 등록증 확인",
      print: false,
    });
  };

  // 선택된 항목들의 합계 계산
  useEffect(() => {
    if (bouncedNoteList.length > 0) {
      const total = bouncedNoteList.reduce(
        (acc, item) => ({
          bankruptcyPrice: acc.bankruptcyPrice + item.bankruptcyPrice,
          collectPrice: acc.collectPrice + item.collectPrice,
          balance: acc.balance + item.balance,
        }),
        { bankruptcyPrice: 0, collectPrice: 0, balance: 0 },
      );
      setTotalAmount(total);
    } else {
      setTotalAmount({ bankruptcyPrice: 0, collectPrice: 0, balance: 0 });
    }
  }, [bouncedNoteList]);

  // 합계 데이터 생성 함수
  const addGrandTotal = (data) => {
    const grandTotal = data.reduce(
      (acc, row) => ({
        bankruptcyPrice: (acc.bankruptcyPrice || 0) + row.bankruptcyPrice,
        collectPrice: (acc.collectPrice || 0) + row.collectPrice,
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
    return addGrandTotal(bouncedNoteList);
  }, [bouncedNoteList]);

  const valueEmptyCheck = (value) => {
    if (!value) return value;
    return formatNumberWithCommas(value);
  };

  // TODO
  const bouncedNoteDetails = [
    [
      {
        label: "담당자",
        value: `${selectedBouncedNote?.managerCode} | ${selectedBouncedNote?.managerName}`,
      },
    ],
    [{ label: "원본위치", value: selectedBouncedNote?.originLocation }],
    [{ label: "어음번호", value: selectedBouncedNote?.noteNum }],
    [
      {
        label: "발행처",
        value: `${selectedBouncedNote?.id} | ${selectedBouncedNote?.customerName}`,
      },
    ],
    [{ label: "발행일", value: selectedBouncedNote?.bankruptcyDate }],
    [{ label: "비고", value: selectedBouncedNote?.memo }],
    [{ label: "최종 입금 일자", value: selectedBouncedNote?.depositDate }],
    [{ label: "총 회수 금액", value: valueEmptyCheck(selectedBouncedNote?.collectPrice) }],
    [{ label: "잔액", value: valueEmptyCheck(selectedBouncedNote?.balance) }],
  ];

  // DataTable 스타일 추가
  const getRowClassName = (rowData) => {
    if (rowData.isGrandTotal) return "pivot-table-grandtotal-row";

    if (rowData.billSt === 2) {
      return "text-red-500";
    } else if (rowData.billSt === 3) {
      return "text-blue-500";
    }
    return "";
  };

  return (
    <div id="SAContainer">
      <div className="sa-half-con-ver2 datatable-con">
        <section className="datatable width-100">
          <div className="datatable__header">
            <h3>부도어음 목록</h3>
            <div className="con-header__btns">
              <Button label="추가" onClick={() => handleAddOrEdit(null, "add")} />
            </div>
          </div>
          <div className="datatable__body mt-3">
            <DataTable
              emptyMessage="데이터가 없습니다."
              value={[...bouncedNoteList, grandTotalRow]}
              selectionMode="single"
              selection={selectedBouncedNote}
              onSelectionChange={(e) => setSelectedBouncedNote(e.value)}
              dataKey="noteNum"
              showGridlines
              scrollable
              scrollHeight="flex"
              resizableColumns
              metaKeySelection={true}
              rowClassName={getRowClassName}
            >
              <Column field="rowNum" header="순번" className="text-center" />
              <Column field="customerName" header="거래처" />
              <Column field="managerName" header="담당자" />
              <Column field="bankruptcyDate" header="부도일" />
              <Column field="type" header="종류" />
              <Column field="expireDate" header="만기일" />
              <Column field="depositDate" header="최종입금일" />
              <Column
                field="bankruptcyPrice"
                header="부도금액"
                className="text-right"
                body={(rowData) => valueEmptyCheck(rowData.bankruptcyPrice)}
              />
              <Column
                field="collectPrice"
                header="회수금액"
                className="text-right"
                body={(rowData) => valueEmptyCheck(rowData.collectPrice)}
              />
              <Column
                field="balance"
                header="잔액"
                className="text-right"
                body={(rowData) => valueEmptyCheck(rowData.balance)}
              />
              <Column field="promiseDate" header="약속일" />
              <Column field="memo" header="비고" />
              <Column
                body={(rowData) => actionBodyTemplate(rowData, "edit")}
                header="수정/삭제"
                style={{ width: "150px" }}
              />
            </DataTable>
          </div>
        </section>
      </div>
      <section className="detail pt-5 mt-6">
        <div className="con-body mt-5 flex justify-between">
          <div className="left-con" style={{ flex: "0.6" }}>
            {bouncedNoteDetails.map((row, idx) => renderRow(row, idx))}
            <Button label="이미지 보기" className="width-100 mt-6" onClick={showImageBtn} />
          </div>
          <div className="right-con flex-1 ml-3">
            <div className="sa-half-con-ver3 mt-3">
              <DataTable
                emptyMessage="데이터가 없습니다."
                value={bouncedNoteDetailList}
                dataKey="noteNum"
                showGridlines
                scrollable
                scrollHeight="flex"
                resizableColumns
                metaKeySelection={true}
                rowClassName={getRowClassName}
                className="width-100"
              >
                <Column field="promiseDate" header="약속일자" />
                <Column field="reason" header="사유" />
                <Column
                  field="collectPrice"
                  header="회수금액"
                  className="text-right"
                  body={(rowData) => valueEmptyCheck(rowData.collectPrice)}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { DTBouncedNoteDetail };
