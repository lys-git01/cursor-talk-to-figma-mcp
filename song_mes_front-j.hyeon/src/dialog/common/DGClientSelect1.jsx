// L4004 / DG-70

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { RadioButton } from "primereact/radiobutton";
import { useEffect, useState } from "react";
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `${index + 1}`,
    clientName: `거래처명${index + 1}`,
    bizNumber: `123-45-67${index}`,
    account: `12345678${index}`,
    ceo: `대표자${index + 1}`,
    isUse: faker.datatype.boolean(),
  }));
};
const sampleList = generateSampleList(30);

export const DGClientSelect1 = ({ onCloseFn }) => {
  const showToast = useToastStore.getState().showToast;
  const [allClients, setAllClients] = useState([]);
  const [clients, setClients] = useState();
  const [selectedClients, setSelectedClients] = useState(null);
  const [form, setForm] = useState({
    searchField: "clientName",
    keyword: "",
    includeQuit: false,
  });

  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "거래처 선택",
      detail: `거래처명: ${event.data.clientName}`,
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
    const filtered = allClients.filter((client) => {
      // 미사용 여부 필터링
      if (!form.includeQuit && !client.isUse) {
        return false;
      }

      const searchValue = form.keyword.toLowerCase();
      const field = form.searchField;

      if (field === "clientName") {
        return client.clientName.toLowerCase().includes(searchValue);
      } else if (field === "id") {
        return client.id.toLowerCase().includes(searchValue);
      } else if (field === "bizNumber") {
        return client.bizNumber.toLowerCase().includes(searchValue);
      } else if (field === "ceo") {
        return client.ceo.toLowerCase().includes(searchValue);
      }
      return true;
    });

    setClients(filtered);

    showToast({
      severity: "info",
      summary: "검색 완료",
      detail: `${filtered.length}건 검색됨`,
    });
  };

  useEffect(() => {
    // 실제 API 호출 시에는 아래 주석을 해제하고 사용
    // const fetchClients = async () => {
    //   try {
    //     const response = await fetch('/api/clients');
    //     const data = await response.json();
    //     setClients(data);
    //     setAllClients(data);
    //   } catch (error) {
    //     showToast({
    //       severity: "error",
    //       summary: "오류 발생",
    //       detail: "거래처 목록을 불러오는데 실패했습니다.",
    //     });
    //   }
    // };
    // fetchClients();

    // 임시로 샘플 데이터 사용
    const filteredList = sampleList.filter((client) => client.isUse);
    setClients(filteredList);
    setAllClients(sampleList);
    setSelectedClients(filteredList[0]);
  }, []);

  const selectedItemsBtn = () => {
    if (selectedClients) {
      console.log("## 선택된 값 확인:", selectedClients);
      onCloseFn(selectedClients);
    }
  };

  return (
    <Dialog
      header="거래처 검색"
      visible
      modal={false}
      className="DialogClients"
      onHide={() => onCloseFn(null)}
    >
      <div className="Dialog-container">
        {/* 검색 영역 */}
        <div className="DialogClients-search search-bar">
          <span className="search-label">검색기준</span>
          {["clientName", "id", "bizNumber", "ceo"].map((field) => (
            <div key={field} className="flex">
              <RadioButton
                inputId={field}
                name="searchField"
                value={field}
                onChange={handleChange}
                checked={form.searchField === field}
              />
              <label htmlFor={field} className="ml-2">
                {field === "clientName"
                  ? "거래처명"
                  : field === "id"
                    ? "코드"
                    : field === "bizNumber"
                      ? "사업자번호"
                      : "대표자명"}
              </label>
            </div>
          ))}

          <div className="common-search__input">
            <span className="search-label">미사용여부</span>
            <Checkbox
              inputId="includeQuit"
              name="includeQuit"
              checked={form.includeQuit}
              onChange={handleChange}
            />
            <label htmlFor="includeQuit" className="ml-2">
              미사용 포함
            </label>
          </div>
          <InputText
            name="keyword"
            value={form.keyword}
            onChange={handleChange}
            placeholder="입력해주세요"
          />
          <Button label="검색" onClick={clickSearchBtn} />
        </div>

        {/* 테이블 영역 */}
        <div className="DialogClients-table mt-3">
          <DataTable
            emptyMessage="데이터가 없습니다."
            value={clients}
            selectionMode="single"
            selection={selectedClients}
            onSelectionChange={(e) => setSelectedClients(e.value)}
            onRowSelect={onRowSelect}
            dataKey="id"
            scrollable
            metaKeySelection={true}
            scrollHeight="flex"
            size="small"
          >
            <Column header="순번" body={(_, options) => options.rowIndex + 1} />
            <Column field="clientName" header="거래처" />
            <Column field="bizNumber" header="사업자번호" />
            <Column field="account" header="계좌번호" />
            <Column field="ceo" header="대표자명" />
          </DataTable>
        </div>
      </div>

      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={() => onCloseFn(null)} />
        <Button label="선택" onClick={selectedItemsBtn} />
      </div>
    </Dialog>
  );
};
