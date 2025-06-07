/*  2.2.1.수금처리 : A6530, SA-2201 */

import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { Calendar } from "primereact/calendar";
import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { renderRow } from "@/utils/common";
import ComSearch from "@/components/ComSearch";
import { faker } from "@faker-js/faker";

const PaymentProcessPage = () => {
  const openDialog = useDialogStore((s) => s.openDialog);
  const showToast = useToastStore.getState().showToast;
  const [saveObject, setSaveObject] = useState({}); // 검색용
  const [paymentProcList, setPaymentProcList] = useState([]);
  const [selectedPaymentProc, setSelectedPaymentProc] = useState([]);
  const [detailData, setDetailData] = useState([]);
  const [paymentProcDtlList, setPaymentProcDtlList] = useState([]);
  const [selectedPaymentProcDtl, setSelectedPaymentProcDtl] = useState([]);
  const [slipDate, setSlipDate] = useState(null);

  // 임시 데이터 생성
  useEffect(() => {
    const tempPaymentProcs = Array.from({ length: 20 }, (_, i) => ({
      paymentNum: "RC25" + faker.number.int({ min: 0, max: 10000000 }),
      paymentDate: "2025-05-26",
      depositName: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
      manager: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
      paymentPoint: faker.helpers.arrayElement(["A기업", "B기업", "C기업"]),
      totalPrice: faker.number.int({ min: 1, max: 100 }),
      memo: `test ${i + 1}`,
      isSlipIssued: faker.datatype.boolean(),
      docuDt: "2025-05-26",
      docuNum: `${i + 1}`,
    }));
    setPaymentProcList(tempPaymentProcs);
    setSelectedPaymentProc(tempPaymentProcs[0]);
  }, []);

  // 상세 목록 데이터 생성 함수
  const generateDetailData = (paymentNum) => {
    return Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, (_, i) => ({
      rowNum: i + 1,
      paymentNum: paymentNum,
      paymentStatus: faker.helpers.arrayElement(["현금", "카드"]),
      manageNum: faker.number.int({ min: 1000, max: 9999 }),
      status: faker.helpers.arrayElement(["자수", "타수"]),
      paymentPrice: faker.number.int({ min: 1, max: 100 }),
      financialInst: faker.helpers.arrayElement(["A기업", "B기업", "C기업"]),
      dateOfIssue: "2025-05-26",
      endDate: "2025-05-26",
      detailMemo: `상세 ${i + 1}`,
    }));
  };

  useEffect(() => {
    if (selectedPaymentProc) {
      const detailList = generateDetailData(selectedPaymentProc.paymentNum);
      setPaymentProcDtlList(detailList);
      setSelectedPaymentProcDtl(null);
    }
  }, [selectedPaymentProc]);

  useEffect(() => {
    if (selectedPaymentProc) {
      if (selectedPaymentProc.isSlipIssued && selectedPaymentProc.docuDt) {
        const [dateStr] = selectedPaymentProc.docuDt.split(" : ");
        setSlipDate(new Date(dateStr));
      } else {
        setSlipDate(new Date(selectedPaymentProc.paymentDate));
      }
    }
  }, [selectedPaymentProc]);

  const searchCategory = {
    pageCode: 2201,
    dates: [
      {
        label: "조회기간",
        startDate: "1MonthAgo",
        endDate: "today",
      },
    ],

    select: ["select1"],
    detailedSearch: {
      isUse: true,
      detailList: {
        text: ["거래처"],
        select: [],
        callList: ["담당자"],
        dateText: ["입금번호"],
      },
    },
  };

  // TODO
  const paymentDetails = [
    [{ label: "수금번호", value: selectedPaymentProc?.paymentNum }],
    [{ label: "수금일자", value: selectedPaymentProc?.paymentDate }],
    [{ label: "수금처", value: selectedPaymentProc?.paymentPoint }],
    [{ label: "담당자", value: selectedPaymentProc?.manager }],
    [{ label: "비고", value: selectedPaymentProc?.memo, memo: true }],
    [{ label: "입금액", value: selectedPaymentProc?.totalPrice }],
  ];

  // TODO
  useEffect(() => {
    showToast({
      severity: "info",
      summary: "백엔드 api 데이터 호출",
      detail: `saveObject: ${JSON.stringify(saveObject)}`,
    });
  }, [saveObject]);

  // 전표 발행/취소 처리
  const handleSlip = () => {
    if (!selectedPaymentProc) return;

    const updatedList = paymentProcList.map((item, index) => {
      if (item.paymentNum === selectedPaymentProc.paymentNum) {
        if (item.isSlipIssued) {
          // 전표 취소
          return { ...item, isSlipIssued: false, docuDt: null };
        } else {
          // 전표 발행
          const formattedDate = slipDate
            ? `${slipDate.getFullYear()}-${String(slipDate.getMonth() + 1).padStart(2, "0")}-${String(slipDate.getDate()).padStart(2, "0")}`
            : selectedPaymentProc.paymentDate;

          const newdocuDt = `${formattedDate} : ${index + 1}`;

          return {
            ...item,
            isSlipIssued: true,
            docuDt: newdocuDt,
          };
        }
      }
      return item;
    });

    const updatedSelectedProc = updatedList.find(
      (item) => item.paymentNum === selectedPaymentProc.paymentNum,
    );

    setPaymentProcList(updatedList);
    setSelectedPaymentProc(updatedSelectedProc);
  };

  const actionBodyTemplate = (type, rowData) => {
    // 전표 발행 여부에 따른 버튼 비활성화 상태 설정
    const isDisabled = type === "list" ? rowData.isSlipIssued : selectedPaymentProc?.isSlipIssued;

    return (
      <div className="buttonSet">
        <Button
          label="수정"
          outlined
          size="small"
          onClick={() => handleAddOrEdit(type, rowData, "update")}
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
        <Button
          label="삭제"
          outlined
          size="small"
          severity="danger"
          onClick={() => handleDelete(type, rowData)}
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
      </div>
    );
  };

  const handleAddOrEdit = (type, rowData, action) => {
    // 전표 발행된 경우 수정 불가
    if (type === "list" && rowData.isSlipIssued) return;
    if (type === "detail" && selectedPaymentProc?.isSlipIssued) return;

    const state = `${type == "detail" ? "내역" : ""} ${action == "update" ? " 수정" : " 추가"}`;

    let formData = {};
    if (action === "update") {
      if (type === "list") {
        // 수금목록 수정 시 해당 행의 상세 데이터도 함께 전달
        const detailList = generateDetailData(rowData.paymentNum); // 임시로 생성된 데이터 사용
        formData = {
          ...rowData,
          detailList: detailList,
        };
      } else {
        // 상세목록 수정 시 해당 행의 데이터만 전달
        formData = { ...rowData };
      }
    }

    openDialog("PaymentProcessForm2201", {
      state: state,
      data: formData,
      processCode: type == "list" ? rowData.paymentNum : rowData.manageNum,
      onSuccess: (updatedData) => {
        if (type === "list") {
          // 수금목록 데이터 업데이트
          const updatedList = paymentProcList.map((item) =>
            item.paymentNum === updatedData.paymentNum ? updatedData : item,
          );
          setPaymentProcList(updatedList);
          setSelectedPaymentProc(updatedData);

          // 상세목록 데이터 업데이트
          if (updatedData.detailList) {
            setPaymentProcDtlList(updatedData.detailList);
          }
        } else {
          // 상세목록 데이터 업데이트
          const updatedDetailList = paymentProcDtlList.map((item) =>
            item.rowNum === updatedData.rowNum ? updatedData : item,
          );
          setPaymentProcDtlList(updatedDetailList);
        }

        showToast({
          severity: "success",
          summary: `수금 ${type == "detail" ? "내역" : ""} 수정`,
          detail: `수금 ${type == "detail" ? "내역" : ""}이 수정되었습니다.`,
          life: 3000,
        });
      },
    });
  };

  const handleDelete = (type, rowData) => {
    const num = type == "list" ? rowData.rowNum : rowData.paymentNum;
    confirmDialog({
      message: `수금 ${type == "list" ? "항목" : "내역"}을(를) 정말로 삭제하시겠습니까?`,
      header: "수금 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        setDetailData(detailData.filter((item) => item.code !== num));
        showToast({
          severity: "info",
          summary: "수금 삭제",
          detail: `수금 ${type == "list" ? "항목" : "내역"}이(가) 삭제되었습니다.`,
          life: 3000,
        });
      },
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  // DataTable 스타일 추가
  const getRowClassName = (rowData) => {
    let classes = [];
    if (rowData.isSlipIssued) {
      classes.push("issued-row");
    }
    return classes.join(" ");
  };

  return (
    <div id="SAContainer">
      <ComSearch searchCategory={searchCategory} setSaveObject={setSaveObject} />
      <div className="sa-half-con datatable-con flex gap-3 mt-3">
        <section className="datatable width-100">
          <div className="datatable__header">
            <h3>수금 목록</h3>
            <div className="con-header__btns">
              <Button label="추가" onClick={() => handleAddOrEdit("list", [], "add")} />
            </div>
          </div>
          <div className="datatable__body mt-3">
            <DataTable
              emptyMessage="기간 내 수금 목록이 없습니다."
              value={paymentProcList}
              selectionMode="single"
              selection={selectedPaymentProc}
              onSelectionChange={(e) => setSelectedPaymentProc(e.value)}
              dataKey="paymentNum"
              showGridlines
              scrollable
              scrollHeight="flex"
              resizableColumns
              metaKeySelection={true}
              rowClassName={getRowClassName}
              className="half-table"
            >
              <Column field="paymentNum" header="수금번호" />
              <Column field="paymentDate" header="수금일자" />
              <Column field="depositName" header="입금자명" />
              <Column field="totalPrice" header="총금액" />
              <Column field="memo" header="비고" />
              <Column
                body={(rowData) => actionBodyTemplate("list", rowData)}
                header="수정/삭제"
                style={{ width: "150px" }}
              />
            </DataTable>
          </div>
        </section>
        <section className="detail pt-2">
          <div className="con-header">
            <h4 className="con-header__title mb-1">수금 상세</h4>
          </div>
          <div className="con-body mt-6">
            {paymentDetails.map((row, idx) => renderRow(row, idx))}
          </div>
          <div className="slipDate" style={{ marginTop: "3.2rem" }}>
            <div className="flex">
              <span className="p-inputgroup-addon">전표일자</span>
              {selectedPaymentProc?.isSlipIssued ? (
                <div
                  className="p-inputtext p-component"
                  style={{
                    minWidth: "200px",
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "var(--gray-100)",
                    padding: "0.5rem",
                  }}
                >
                  {selectedPaymentProc?.docuDt || ""} : {selectedPaymentProc?.docuNum || ""}
                </div>
              ) : (
                <Calendar
                  value={slipDate}
                  onChange={(e) => setSlipDate(e.value)}
                  showIcon
                  dateFormat="yy-mm-dd"
                  placeholder="날짜를 선택하세요"
                />
              )}
              <div className="con-header__btns ml-4">
                <Button
                  label={selectedPaymentProc?.isSlipIssued ? "전표취소" : "전표발행"}
                  onClick={handleSlip}
                  className="p-button-sm"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="sa-half-con datatable-con">
        <section className="datatable mt-1 width-100">
          <div className="datatable__header">
            <h3>수금 상세 목록</h3>
            <div className="con-header__btns">
              <Button
                label="추가"
                onClick={() => handleAddOrEdit("detail", [], "add")}
                disabled={selectedPaymentProc?.isSlipIssued}
              />
            </div>
          </div>
          <div className="datatable__body mt-3">
            <DataTable
              emptyMessage="선택된 지급처의 지급 내역 목록이 없습니다."
              value={paymentProcDtlList}
              selectionMode="single"
              selection={selectedPaymentProcDtl}
              onSelectionChange={(e) => setSelectedPaymentProcDtl(e.value)}
              dataKey="rowNum"
              showGridlines
              scrollable
              scrollHeight="flex"
              resizableColumns
              metaKeySelection={true}
            >
              <Column field="rowNum" header="순번" />
              <Column field="paymentStatus" header="수금구분" />
              <Column field="manageNum" header="관리번호" />
              <Column field="status" header="자/타" />
              <Column field="paymentPrice" header="수금액" className="text-right" />
              <Column field="financialInst" header="금융기관" />
              <Column field="dateOfIssue" header="발행일자" />
              <Column field="endDate" header="만기/약정" />
              <Column field="detailMemo" header="비고" />
              <Column
                body={(rowData) => actionBodyTemplate("detail", rowData)}
                header="수정/삭제"
                style={{ width: "150px" }}
              />
            </DataTable>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PaymentProcessPage;
