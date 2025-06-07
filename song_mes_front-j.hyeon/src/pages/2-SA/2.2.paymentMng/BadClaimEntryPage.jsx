/* 2.2.5.악성채권전환등록 : C1020, SA-2205 */

import { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";

const BadClaimEntryPage = () => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((state) => state.openDialog);
  const navigate = useNavigate();

  const [badClaimEntryList, setBadClaimEntryList] = useState([]);
  const [selectedBadClaimEntry, setSelectedBadClaimEntry] = useState(null);

  // 임시 데이터 생성
  useEffect(() => {
    const tempBadClaimEntryList = Array.from({ length: 20 }, (_, i) => ({
      rowNum: i + 1,
      conversionNumber: "DE" + faker.number.int({ min: 0, max: 10000000 }),
      id: faker.helpers.arrayElement(["1001", "1002", "1003"]),
      customerName: faker.helpers.arrayElement(["A기업", "B기업", "C기업"]),
      conversionDate: "2025-06-04",
      reportDate: "2025-06-04",
      reportManagerCode: faker.helpers.arrayElement(["1001", "1002", "1003"]),
      reportManager: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
      totalPrice: faker.number.int({ min: 1, max: 100 }),
      accidentPrice: faker.number.int({ min: 1, max: 100 }),
      occurType: "발생유형",
      briefReason: `test ${i + 1}`,
      significant: `significant ${i + 1}`,
      confirmDate: faker.helpers.arrayElement(["2025-06-04", ""]),
      previousManagerCode: faker.helpers.arrayElement(["1001", "1002", "1003"]),
      previousManager: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
      currentManagerCode: faker.helpers.arrayElement(["1001", "1002", "1003"]),
      currentManager: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
      responsibleEmployee1Code: faker.helpers.arrayElement(["1001", "1002", "1003"]),
      responsibleEmployee1: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
      rate1: faker.number.int({ min: 1, max: 100 }),
      responsibleEmployee2Code: faker.helpers.arrayElement(["1001", "1002", "1003"]),
      responsibleEmployee2: faker.helpers.arrayElement(["홍길동", "아무개", "심청"]),
      rate2: faker.number.int({ min: 1, max: 100 }),
      causeAndContent: `causeAndContent ${i + 1}`,
      preventiveMeasure: `preventiveMeasure ${i + 1}`,
    }));
    setBadClaimEntryList(tempBadClaimEntryList);
    setSelectedBadClaimEntry(tempBadClaimEntryList[0]);
  }, []);

  const searchCategory = {
    pageCode: 2205,
    dates: [
      {
        label: "조회기간",
        startDate: "1YearAgo",
        endDate: "today",
      },
    ],
    text: ["간략사유"],
    select: [],
    detailedSearch: {
      isUse: true,
      detailList: {
        text: ["거래처"],
        select: [],
        callList: ["담당자"],
        dateText: ["전환번호"],
      },
    },
  };

  // TODO
  const addBtn = () => {
    navigate("/badClaimEntry/new");
  };

  // TODO
  const editBtn = () => {
    if (!selectedBadClaimEntry) {
      showToast({
        severity: "warn",
        summary: "알림",
        detail: "수정할 데이터를 선택해주세요.",
      });
      return;
    }

    // 선택된 데이터를 폼에 맞는 형태로 변환
    const formData = {
      거래처: { ID: selectedBadClaimEntry.id, name: selectedBadClaimEntry.customerName },
      전환일자: new Date(selectedBadClaimEntry.conversionDate),
      보고일자: new Date(selectedBadClaimEntry.reportDate),
      보고자: {
        ID: selectedBadClaimEntry.reportManagerCode,
        name: selectedBadClaimEntry.reportManager,
      },
      전담당자: {
        ID: selectedBadClaimEntry.previousManagerCode,
        name: selectedBadClaimEntry.previousManager,
      },
      현담당자: {
        ID: selectedBadClaimEntry.currentManagerCode,
        name: selectedBadClaimEntry.currentManager,
      },
      책임사원1: {
        ID: selectedBadClaimEntry.responsibleEmployee1Code,
        name: selectedBadClaimEntry.responsibleEmployee1,
      },
      책임사원2: {
        ID: selectedBadClaimEntry.responsibleEmployee2Code,
        name: selectedBadClaimEntry.responsibleEmployee2,
      },
      발생유형: selectedBadClaimEntry.occurType,
      간략내용: selectedBadClaimEntry.briefReason,
      특이사항: selectedBadClaimEntry.significant,
      총채권금액: selectedBadClaimEntry.totalPrice,
      악성전환금액: selectedBadClaimEntry.accidentPrice,
      요율1: selectedBadClaimEntry.rate1,
      요율2: selectedBadClaimEntry.rate2,
      원인및내용: selectedBadClaimEntry.causeAndContent,
      재발방지대책: selectedBadClaimEntry.preventiveMeasure,
    };

    // 데이터를 state로 전달하면서 페이지 이동
    navigate(`/badClaimEntry/${selectedBadClaimEntry.id}/edit`, {
      state: { formData },
    });
  };

  const deleteBtn = () => {
    confirmDialog({
      message: `악성채권전환을(를) 정말로 삭제하시겠습니까?`,
      header: "악성채권전환 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept,
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const accept = () => {
    showToast({
      severity: "info",
      summary: "악성채권전환 삭제",
      detail: "악성채권전환이 삭제되었습니다.",
      life: 3000,
    });
  };

  const handleConfirm = () => {
    if (!selectedBadClaimEntry) {
      showToast({
        severity: "warn",
        summary: "알림",
        detail: "선택된 데이터가 없습니다.",
      });
      return;
    }

    openDialog("BadClaimConfirmedOrNot2205", {
      data: selectedBadClaimEntry,
      callback: (result) => {
        if (result) {
          // 확정/취소 처리
          const updatedList = badClaimEntryList.map((item) => {
            if (item.conversionNumber === selectedBadClaimEntry.conversionNumber) {
              return {
                ...item,
                confirmDate: item.confirmDate ? null : new Date().toISOString().split("T")[0],
              };
            }
            return item;
          });
          setBadClaimEntryList(updatedList);

          // 선택된 항목 업데이트
          setSelectedBadClaimEntry({
            ...selectedBadClaimEntry,
            confirmDate: selectedBadClaimEntry.confirmDate
              ? null
              : new Date().toISOString().split("T")[0],
          });

          showToast({
            severity: "success",
            summary: "알림",
            detail: selectedBadClaimEntry.confirmDate
              ? "확정이 취소되었습니다."
              : "확정되었습니다.",
          });
        }
      },
    });
  };

  const handlePrint = () => {
    showToast({
      severity: "info",
      summary: "알림",
      detail: "출력",
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
            setSelectedBadClaimEntry(rowData);
            editBtn();
          }}
        />
        <Button label="삭제" outlined size="small" severity="danger" onClick={() => deleteBtn()} />
      </div>
    );
  };

  const valueEmptyCheck = (value) => {
    if (!value) return value;
    return formatNumberWithCommas(value);
  };

  // TODO
  const badClaimEntryDetails = [
    [{ label: "전환번호", value: selectedBadClaimEntry?.conversionNumber }],
    [
      {
        label: "거래처명",
        value: `${selectedBadClaimEntry?.id} ${selectedBadClaimEntry?.customerName}`,
      },
    ],
    [{ label: "전환일자", value: selectedBadClaimEntry?.conversionDate }],
    [{ label: "보고일자", value: selectedBadClaimEntry?.reportDate }],
    [
      {
        label: "보고자",
        value: `${selectedBadClaimEntry?.reportManagerCode} ${selectedBadClaimEntry?.reportManager}`,
      },
    ],
    [{ label: "발생유형", value: selectedBadClaimEntry?.occurType }],
    [{ label: "간략사유", value: selectedBadClaimEntry?.briefReason }],
    [{ label: "특이사항", value: selectedBadClaimEntry?.significant }],
    [
      {
        label: "이전담당",
        value: `${selectedBadClaimEntry?.previousManagerCode} ${selectedBadClaimEntry?.previousManager}`,
      },
      {
        label: "현담당",
        value: `${selectedBadClaimEntry?.currentManagerCode} ${selectedBadClaimEntry?.currentManager}`,
      },
    ],
    [
      {
        label: "총채권금액",
        value: valueEmptyCheck(selectedBadClaimEntry?.totalPrice),
        colorSet: true,
      },
    ],
    [
      {
        label: "악성전환금액",
        value: valueEmptyCheck(selectedBadClaimEntry?.accidentPrice),
        colorSet: true,
      },
    ],
    [
      {
        label: "책임사원1",
        value: `${selectedBadClaimEntry?.responsibleEmployee1Code} ${selectedBadClaimEntry?.responsibleEmployee1}`,
      },
      {
        label: "요율",
        value: `${selectedBadClaimEntry?.rate1}% | ${Math.floor((selectedBadClaimEntry?.rate1 / 100) * selectedBadClaimEntry?.totalPrice)}원`,
      },
    ],
    [
      {
        label: "책임사원2",
        value: `${selectedBadClaimEntry?.responsibleEmployee2Code} ${selectedBadClaimEntry?.responsibleEmployee2}`,
      },
      {
        label: "요율",
        value: `${selectedBadClaimEntry?.rate2}% | ${Math.floor((selectedBadClaimEntry?.rate2 / 100) * selectedBadClaimEntry?.totalPrice)}원`,
      },
    ],
  ];

  // DataTable 스타일 추가
  const getRowClassName = (rowData) => {
    let classes = [];
    if (rowData.confirmDate) {
      classes.push("text-blue-500");
    }
    return classes.join(" ");
  };

  return (
    <div id="SAContainer" className="has-abs-btns">
      <ComSearch searchCategory={searchCategory} />
      <div className="sa-half-con datatable-con">
        <section className="datatable mt-3 width-100">
          <div className="datatable__header">
            <h3>악성채권목록</h3>
            <div className="con-header__btns">
              <Button label="추가" onClick={() => addBtn("detail", [], "add")} />
            </div>
          </div>
          <div className="datatable__body mt-3">
            <DataTable
              emptyMessage="데이터가 없습니다."
              value={badClaimEntryList}
              selectionMode="single"
              selection={selectedBadClaimEntry}
              onSelectionChange={(e) => setSelectedBadClaimEntry(e.value)}
              dataKey="conversionNumber"
              showGridlines
              scrollable
              scrollHeight="flex"
              resizableColumns
              metaKeySelection={true}
              rowClassName={getRowClassName}
            >
              <Column field="rowNum" header="순번" />
              <Column field="conversionNumber" header="전환번호" />
              <Column field="customerName" header="거래처명" />
              <Column field="conversionDate" header="전환일" />
              <Column field="reportDate" header="보고일" />
              <Column field="reportManager" header="보고자" />
              <Column
                field="totalPrice"
                header="총채권금액"
                className="text-right"
                body={(rowData) => valueEmptyCheck(rowData.totalPrice)}
              />
              <Column
                field="accidentPrice"
                header="악성전환금액"
                className="text-right"
                body={(rowData) => valueEmptyCheck(rowData.accidentPrice)}
              />
              <Column field="occurType" header="발생유형" />
              <Column field="briefReason" header="간략사유" />
              <Column field="currentManager" header="현담당" />
              <Column field="confirmDate" header="확정" />
              <Column
                body={(rowData) => actionBodyTemplate(rowData)}
                header="수정/삭제"
                style={{ width: "150px" }}
              />
            </DataTable>
          </div>
        </section>
      </div>
      <section className="detail pt-2 mt-3">
        <div className="con-header">
          <h4 className="con-header__title mb-1">채권 상세</h4>
        </div>
        <div className="con-body mt-5 flex justify-between">
          <div className="left-con" style={{ flex: "0.6" }}>
            {badClaimEntryDetails.map((row, idx) => renderRow(row, idx))}
          </div>
          <div className="right-con flex-1">
            <Panel header="원인 및 내용">
              <p className="causeAndContent">{selectedBadClaimEntry?.causeAndContent}</p>
            </Panel>
            <Panel header="재발 방지 대책" className="mt-3">
              <p className="preventiveMeasure">{selectedBadClaimEntry?.preventiveMeasure}</p>
            </Panel>
          </div>
        </div>
      </section>
      <div className="abs_btns">
        <Button
          label={selectedBadClaimEntry?.confirmDate ? "확정취소" : "확정하기"}
          onClick={handleConfirm}
          className="p-button-sm"
        />
        <Button label="출력" icon="pi pi-print" onClick={handlePrint} />
      </div>
    </div>
  );
};

export default BadClaimEntryPage;
