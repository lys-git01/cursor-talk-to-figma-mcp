// 담당자	L1015	DG-06

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect, useState } from "react";
import { faker } from "@faker-js/faker";
import useToastStore from "@/store/toastStore";

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    ID: (1000 + index).toString(),
    name: `Name${index + 1}`,
    quit: faker.datatype.boolean(),
  }));
};
const sampleList = generateSampleList(30);

export const DGManager = ({ onCloseFn, isMultiple }) => {
  const showToast = useToastStore.getState().showToast;
  const [allUsers, setAllUsers] = useState([]); // 원본 데이터
  const [users, setUsers] = useState();
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [form, setForm] = useState({ name: "", checkbox: "" });

  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "Product Selected",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
  };

  const handleChange = (e) => {
    const { type, name, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const clickSearchBtn = () => {
    // TODO
    const filtered = allUsers.filter((user) => {
      const nameMatch = user.name.toLowerCase().includes(form.name.toLowerCase());
      const quitMatch = form.checkbox ? true : !user.quit; // 체크 안 하면 quit=false만 보기
      return nameMatch && quitMatch;
    });

    setUsers(filtered);

    showToast({
      severity: "info",
      summary: "검색 완료",
      detail: `${filtered.length}건 검색됨`,
    });
  };

  useEffect(() => {
    // TODO
    showToast({
      severity: "info",
      summary: "백엔드 api 호출",
      detail: "백엔드 api 호출",
    });
    const filtered = sampleList.filter((item) => item.quit === false);
    setUsers(filtered);
    setAllUsers(sampleList);
  }, []);

  const selectedItemsBtn = () => {
    onCloseFn(selectedUsers);
  };
  return (
    <Dialog
      header="담당자 선택"
      visible
      modal={false}
      tyle={{ width: "50vw" }}
      onHide={() => onCloseFn([])}
      className="DialogUsers"
    >
      <div className="Dialog-container">
        <div className="DialogUsers-search">
          <div>
            <div className="common-search__input">
              <label htmlFor="DialogUsers1">이름</label>
              <InputText placeholder="이름" name="name" id="DialogUsers1" onChange={handleChange} />
            </div>

            <div className="common-search__input mt-2">
              <Checkbox
                inputId="DialogUsers2"
                name="checkbox"
                onChange={handleChange}
                checked={form.checkbox}
              />
              <label htmlFor="DialogUsers2">퇴사자 포함</label>
            </div>
          </div>
          <Button label="검색" onClick={clickSearchBtn}></Button>
        </div>

        <div className="DialogUsers-table">
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={users}
            selectionMode={isMultiple ? "checkbox" : "single"}
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            onRowSelect={onRowSelect}
            metaKeySelection={true}
            dataKey="ID"
            showGridlines
            scrollable
            size="small"
            scrollHeight="calc(60vh - 240px)"
            // virtualScrollerOptions={{ itemSize: 43 }}
            // resizableColumns
            rowClassName={(rowData) => (rowData.quit ? "allRed" : "")}
          >
            {isMultiple && (
              <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
            )}
            <Column field="ID" header="ID"></Column>
            <Column field="name" header="상호"></Column>
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
