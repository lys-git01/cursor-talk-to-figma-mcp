// 사용기계리스트	L3021	DG-machineList	DG-33

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import useToastStore from "@/store/toastStore";
import { Checkbox } from "primereact/checkbox";
const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    code: (1000 + index).toString(),
    name: `Name${index + 1}`,
    isChecked: false,
    disabled: true,
  }));
};
const sampleList = generateSampleList(30);

const DGMachineList = ({ onCloseFn }) => {
  const [checked, setChecked] = useState(false);
  const [mainMachine, setMainMachine] = useState(null);
  const showToast = useToastStore.getState().showToast;
  const [machineList, setMachineList] = useState([]);
  const [selectedMachineList, setSelectedMachineList] = useState([]);

  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "선택 완료",
      detail: `기계명: ${event.data.name}`,
      life: 3000,
    });
  };

  useEffect(() => {
    // TODO
    showToast({
      severity: "info",
      summary: "백엔드 api 호출",
      detail: "백엔드 api 호출",
    });
    setMachineList(sampleList);
  }, []);

  // 선택된 기계만 보기 필터링 로직 개선
  const filteredMachineList = checked
    ? machineList.filter((machine) =>
        selectedMachineList.some((selected) => selected.code === machine.code),
      )
    : machineList;

  const selectedItemsBtn = () => {
    if (!mainMachine) {
      showToast({
        severity: "warn",
        summary: "메인 기계 선택 필요",
        detail: "메인 기계를 선택해주세요.",
        life: 3000,
      });
      return;
    }
    let selectedList = selectedMachineList;
    if (!selectedMachineList.some((machine) => machine.code === mainMachine.code)) {
      selectedList = [...selectedList, mainMachine];
    }
    onCloseFn({ mainMachine, selectedList });
  };

  return (
    <Dialog
      header="사용기계목록 선택"
      visible
      modal={false}
      onHide={() => onCloseFn([])}
      className="DGMachineList"
    >
      <div className="DGMachineList-search">
        <div className="common-search__input">
          <Checkbox
            inputId="binary"
            name="binary"
            checked={checked}
            onChange={(e) => setChecked(e.checked)}
          />
          <label htmlFor="binary">선택된 기계만 보기</label>
        </div>
      </div>
      <div className="Dialog-container">
        <div className="DGMachineList-info">
          <p>메인기계</p>
          <span className={mainMachine ? "selected-machine" : ""}>
            {mainMachine?.name ?? "선택된 기계가 없습니다."}
          </span>
        </div>
        <div className="DGMachineList-table">
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={filteredMachineList}
            selectionMode={"checkbox"}
            selection={selectedMachineList}
            onSelectionChange={(e) => setSelectedMachineList(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="code"
            showGridlines
            scrollable
            size="small"
            scrollHeight="calc(60vh - 240px)"
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
            <Column field="code" header="코드"></Column>
            <Column field="name" header="기계명"></Column>
            <Column
              header="메인 선택"
              body={(rowData) => (
                <Button
                  label={"선택"}
                  severity={"secondary"}
                  onClick={() => setMainMachine(rowData)}
                />
              )}
            ></Column>
          </DataTable>
        </div>
      </div>

      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={() => onCloseFn([])}></Button>
        <Button label="선택" onClick={selectedItemsBtn}></Button>
      </div>
    </Dialog>
  );
};

export default DGMachineList;
