// 7.4.5.관리내역등록		mgmtHistory	BM-7405
import { Button } from "primereact/button";
import useDialogStore from "@/store/dialogStore";
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import { faker } from "@faker-js/faker";
import { InputText } from "primereact/inputtext";
import useToastStore from "@/store/toastStore";
import { confirmDialog } from "primereact/confirmdialog";

// 샘플 데이터 생성 함수
const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    code: `MGMT${1000 + index}`,
    name: faker.person.fullName(),
    status: Math.random() < 0.8 ? "0-공통" : "1-회계",
    type: Math.random() < 0.7 ? "변경가능" : "변경불가능", // 구분
    canModifySub: Math.random() < 0.5, // 하위항목 변경가능 여부
    bigo: faker.lorem.sentence(), // 비고 필드 추가
  }));
};

const generateDetailList = (code, count = 20) => {
  return Array.from({ length: count }, (_, index) => ({
    code: `CLI${1000 + index}`,
    name: faker.company.name(),
    isUse: Math.random() < 0.5 ? "사용" : "미사용", // 사용 필드 추가
    type: Math.random() < 0.7 ? "변경가능" : "변경불가능", // 구분
    bigo: faker.lorem.sentence(), // 비고 필드 추가
    parentCode: code,
  }));
};

const sampleList = generateSampleList(30);
// 각 관리내역별 상세 목록 생성
const allDetailLists = sampleList.reduce((acc, mgmt) => {
  acc[mgmt.code] = generateDetailList(mgmt.code, 10);
  return acc;
}, {});

const MgmtHistoryPage = () => {
  const [data, setData] = useState(sampleList);
  const [detailData, setDetailData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const openDialog = useDialogStore((s) => s.openDialog);
  const [filterType, setFilterType] = useState("0-공통");
  const showToast = useToastStore.getState().showToast;
  const [searchItem, setSearchItem] = useState("");

  // 첫 로드시 첫 번째 거래담당자 선택
  useEffect(() => {
    if (data.length > 0 && !selectedRow) {
      const firstData = data[0];
      setSelectedRow(firstData);
      setDetailData(allDetailLists[firstData.code]);
    }
  }, [data]);

  const onRowSelect = (event) => {
    setSelectedRow(event.data);
    // 선택된 관리내역의 상세 목록을 가져오는 로직
    setDetailData(allDetailLists[event.data.code]);
  };

  useEffect(() => {
    if (filterType === "전체") {
      setData(sampleList);
    } else {
      const filtered = sampleList.filter((item) => item.status === filterType);
      setData(filtered);
    }
  }, [filterType]);

  const handleSearch = () => {
    if (!searchItem.trim()) {
      setDetailData(allDetailLists[selectedRow.code]);
      return;
    }
    const filtered = allDetailLists[selectedRow.code].filter((item) =>
      item.name.toLowerCase().includes(searchItem.toLowerCase()),
    );
    setDetailData(filtered);
  };

  const handleDetailEdit = (rowData) => {
    openDialog("MgmtHistoryForm7405", {
      state: "수정",
      data: rowData,
      processCode: selectedRow.code,
      onClose: (updatedData) => {
        setDetailData(
          detailData.map((item) => (item.code === updatedData.code ? updatedData : item)),
        );
      },
    });
  };

  const handleDetailDelete = (rowData) => {
    confirmDialog({
      message: `${rowData.code}을(를) 정말로 삭제하시겠습니까?`,
      header: "관리항목 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        setDetailData(detailData.filter((item) => item.code !== rowData.code));
        showToast({
          severity: "info",
          summary: "관리항목 삭제",
          detail: `${rowData.code}이(가) 삭제되었습니다.`,
          life: 3000,
        });
      },
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };

  const handleAddDetail = () => {
    openDialog("MgmtHistoryForm7405", {
      state: "추가",
      onClose: (newData) => {
        setDetailData([...detailData, newData]);
        showToast({
          severity: "success",
          summary: "관리항목 추가",
          detail: "관리항목이 추가되었습니다.",
          life: 3000,
        });
      },
    });
  };

  const actionBodyTemplate = (rowData, disabled = false) => {
    return (
      <div className="buttonSet">
        <Button
          label="삭제"
          outlined
          size="small"
          severity="danger"
          onClick={() => handleDetailDelete(rowData)}
          disabled={disabled}
        />
        <Button
          label="수정"
          outlined
          size="small"
          onClick={() => handleDetailEdit(rowData)}
          disabled={disabled}
        />
      </div>
    );
  };

  const codeBodyTemplate = (rowData) => {
    return <span className={rowData.isUse === "미사용" ? "red-500" : ""}>{rowData.code}</span>;
  };

  const isUseBodyTemplate = (rowData) => {
    return <span className={rowData.isUse === "미사용" ? "red-500" : ""}>{rowData.isUse}</span>;
  };
  const onDelete = () => {
    confirmDialog({
      message: `${selectedRow?.name} 관리내역을 삭제하시겠습니까?`,
      header: "관리내역 삭제",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => {
        // TODO 백엔드 호출
        console.log("삭제");
      },
      acceptLabel: "삭제",
      rejectLabel: "취소",
    });
  };
  const onEdit = () => {
    openDialog("MgmtHistoryUpdate7405", {
      data: selectedRow,
      onClose: (value) => {
        if (value) {
          setData((prev) => {
            const index = prev.findIndex((item) => item.code === value.code);
            if (index !== -1) {
              prev[index] = value;
            }
            return [...prev];
          });
        }
      },
    });
  };
  return (
    <div id="MgmtHistory">
      <div className="MgmtHistory-con content-box">
        <section className="datatable">
          <div className="common-search">
            <div className="common-search__input">
              <label htmlFor="filterType">조회구분</label>
              <Dropdown
                value={filterType}
                options={["0-공통", "1-회계"]}
                onChange={(e) => setFilterType(e.value)}
                placeholder="선택"
              />
            </div>
          </div>
          <div className="datatable__header">
            <h3>관리내역 목록</h3>
            {selectedRow?.type === "변경가능" && (
              <div className="datatable__btns">
                <Button
                  size="small"
                  label="삭제"
                  severity="danger"
                  icon="pi pi-times"
                  onClick={onDelete}
                />
                <Button size="small" label="수정" onClick={onEdit} />
              </div>
            )}
          </div>

          <DataTable
            emptyMessage="데이터가 없습니다."
            value={data}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => setSelectedRow(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            resizableColumns
            scrollHeight="flex"
            rowClassName={(rowData) => (rowData.type === "변경가능" ? "blue-500" : "")}
          >
            <Column field="code" header="코드"></Column>
            <Column field="name" header="관리내역"></Column>
            <Column field="type" header="구분"></Column>
          </DataTable>
        </section>

        <section className="datatable detail">
          <div className="common-search">
            <div className="common-search__input">
              <label htmlFor="filterType">환경요소</label>
              <InputText
                placeholder="관리항목 검색"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
              />
            </div>
            <div className="common-search-btns">
              <Button label="검색" icon="pi pi-search" iconPos="right" onClick={handleSearch} />
            </div>
          </div>

          <div className="datatable__header">
            <h3>관리항목 상세목록</h3>
            <div className="datatable__btns">
              <Button size="small" label="관리항목 추가" onClick={handleAddDetail} />
            </div>
          </div>

          <DataTable
            emptyMessage="데이터가 없습니다."
            value={detailData}
            showGridlines
            scrollable
            resizableColumns
            scrollHeight="flex"
            rowClassName={(rowData) => (rowData.type === "변경가능" ? "blue-500" : "")}
          >
            <Column field="code" header="코드" body={codeBodyTemplate}></Column>
            <Column field="name" header="관리항목"></Column>
            <Column field="isUse" header="사용" body={isUseBodyTemplate}></Column>
            <Column field="bigo" header="비고"></Column>
            <Column
              body={(rowData) =>
                actionBodyTemplate(rowData, rowData.type === "변경가능" ? false : true)
              }
              header="수정 / 삭제"
              style={{ width: "150px" }}
            ></Column>
          </DataTable>
        </section>
      </div>
    </div>
  );
};

export default MgmtHistoryPage;
