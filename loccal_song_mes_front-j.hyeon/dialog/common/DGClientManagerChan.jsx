/** 거래처 담당자 변경 L3007 DG-clientManagerChan DG-25 */

import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { faker } from "@faker-js/faker";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

// 날짜 포맷팅 함수
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 임시 데이터 생성
const tempClientManagerChan = () =>
  Array.from({ length: 3 }, () => ({
    id: faker.string.uuid(),
    prevManager: faker.person.fullName(),
    chanManager: faker.person.fullName(),
    reason: faker.lorem.sentence(),
    updater: faker.person.fullName(),
    updateDate: formatDate(faker.date.recent()),
  }));

const DGClientManagerChan = ({ data, onCloseFn }) => {
  const toast = useRef(null);
  const [tableData, setTableData] = useState(tempClientManagerChan());
  const [editingRows, setEditingRows] = useState({});

  // 마지막 담당자 확인
  const isLastManager = (rowData) => {
    const lastIndex = tableData.length - 1;
    return tableData.indexOf(rowData) === lastIndex;
  };

  // 수정 완료 처리
  const onRowEditComplete = (e) => {
    const { newData, index } = e;

    if (!newData.reason.trim()) {
      toast.current.show({
        severity: "error",
        summary: "오류",
        detail: "사유를 입력해주세요.",
      });
      return;
    }

    const updated = [...tableData];
    updated[index] = {
      ...newData,
      updateDate: formatDate(new Date()),
    };

    setTableData(updated);
    setEditingRows({});
    toast.current.show({
      severity: "success",
      summary: "성공",
      detail: "사유가 변경되었습니다.",
    });
  };

  // 입력 에디터
  const textEditor = (options) => (
    <InputText
      type="text"
      value={options.value}
      onChange={(e) => options.editorCallback(e.target.value)}
      className="w-full"
      autoFocus
    />
  );

  // 수정 버튼 커스터마이징
  const rowEditorTemplate = (options) => {
    const { rowData, editing, editor } = options;
    const isLast = isLastManager(rowData);

    if (!isLast) {
      return <Button label="수정" size="small" disabled outlined />;
    }

    return editing ? (
      <Button label="저장" size="small" onClick={editor.saveRow} />
    ) : (
      <Button label="수정" size="small" outlined onClick={editor.initRowEdit} />
    );
  };

  return (
    <Dialog
      header="거래처 담당자 변경"
      visible
      onHide={() => onCloseFn(null)}
      className="DGClientManagerChan"
      style={{ width: "50vw" }}
    >
      <Toast ref={toast} />

      <div className="Dialog-container form-list pivot-table-wrapper">
        <div className="form__input">
          <p>거래처명</p>
          <span className="flex-1">
            {data?.customerCode} | {data?.customerName}
          </span>
        </div>
        <div className="form__input">
          <p>현재 거래처 담당자</p>
          <span className="flex-1">{data?.manager}</span>
        </div>

        <DataTable
          value={tableData}
          dataKey="id"
          editMode="row"
          onRowEditComplete={onRowEditComplete}
          editingRows={editingRows}
          onRowEditInit={(e) => setEditingRows({ [e.data.id]: true })}
          onRowEditCancel={() => setEditingRows({})}
          emptyMessage="내역이 없습니다."
        >
          <Column field="prevManager" header="이전담당자" />
          <Column field="chanManager" header="변경담당" />
          <Column
            field="reason"
            header="사유"
            editor={textEditor}
            body={(rowData) => rowData.reason || "-"}
          />
          <Column field="updater" header="수정자" />
          <Column field="updateDate" header="수정일" className="text-right" />
          <Column
            rowEditor
            header={"수정"}
            style={{ width: "100px" }}
            body={(rowData, options) => (
              <>
                {options.rowEditor?.editing ? (
                  <Button
                    label="저장"
                    onClick={(e) =>
                      options.rowEditor?.onSaveClick && options.rowEditor?.onSaveClick(e)
                    }
                  />
                ) : (
                  <Button
                    label="수정"
                    onClick={(e) =>
                      options.rowEditor?.onInitClick && options.rowEditor?.onInitClick(e)
                    }
                    outlined
                    disabled={!isLastManager(rowData)}
                  />
                )}
              </>
            )}
          ></Column>
        </DataTable>
      </div>
      <div className="Dialog__btns">
        <Button label="닫기" severity="secondary" onClick={() => onCloseFn(null)} />
      </div>
    </Dialog>
  );
};

export default DGClientManagerChan;
