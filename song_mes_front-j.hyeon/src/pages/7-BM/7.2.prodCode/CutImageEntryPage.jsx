/* 7.2.6.절수이미지등록 H2010, BM-7206 */
import useToastStore from "@/store/toastStore";
import { faker } from "@faker-js/faker";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import React, { useEffect, useState, useRef } from "react";
import { Galleria } from "primereact/galleria";
import { useNavigate } from "react-router-dom";

const generateImage = () => {
  const img = faker.image.url({ width: 700, height: 700 });
  return {
    itemImageSrc: img,
    thumbnailImageSrc: img,
  };
};

const generateSampleList = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    code: (1000 + index).toString(),
    name: faker.company.name(),
    Imgs: [
      {
        title: faker.company.name(),
        ...generateImage(),
        alt: faker.company.name(),
      },
      {
        title: faker.company.name(),
        ...generateImage(),
        alt: faker.company.name(),
      },
      {
        title: faker.company.name(),
        ...generateImage(),
        alt: faker.company.name(),
      },
    ],
  }));
};

const sampleList = generateSampleList(30);

const CutImageEntryPage = () => {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedRow, setSelectedRow] = useState(null);
  const [form, setForm] = useState({
    useOperationSearch: "코드 검색",
    searchText: "",
  });
  const showToast = useToastStore.getState().showToast;
  const navigate = useNavigate();
  const galleriaRef = useRef(null);

  useEffect(() => {
    setData(sampleList);
    setSelectedRow(sampleList[0]);
  }, []);

  const handleSearch = () => {
    const filteredData = sampleList.filter((item) => {
      if (form.useOperationSearch === "코드 검색") {
        return item.code.includes(form.searchText);
      } else {
        return item.name.includes(form.searchText);
      }
    });
    setData(filteredData);
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDelete = () => {
    console.log("삭제");
    setData(data.filter((item) => item.code !== selectedRow.code));
    setSelectedRow(data[0]);
    showToast({
      severity: "info",
      summary: "삭제 완료",
      detail: "이미지가 삭제되었습니다.",
      life: 3000,
    });
  };
  // TODO 백엔드 호출 상세 데이터 교체
  const onRowSelect = (event) => {
    showToast({
      severity: "info",
      summary: "행이 선택 되었습니다.",
      detail: `Name: ${event.data.name}`,
      life: 3000,
    });
  };
  const responsiveOptions = [
    {
      breakpoint: "991px",
      numVisible: 4,
    },
    {
      breakpoint: "767px",
      numVisible: 3,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
    },
  ];
  const itemTemplate = (item) => {
    return (
      <div className="CutImageEntry-img">
        <img src={item.itemImageSrc} alt={item.alt} style={{ width: "100%" }} />
      </div>
    );
  };

  const thumbnailTemplate = (item) => {
    return (
      <div className="CutImageEntry-thumbnail">
        <img src={item.thumbnailImageSrc} alt={item.alt} />
      </div>
    );
  };
  const printImg = () => {
    // TODO 이미지 출력 기능 구현
    showToast({
      severity: "info",
      summary: "이미지 출력",
      detail: `Name: ${selectedRow.name}`,
      life: 3000,
    });
  };
  return (
    <div id="CutImageEntry" className="CutImageEntry">
      <div className="CutImageEntry-left">
        <div className="common-search">
          <div className="form__input">
            <p>검색기준</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center mr-2 my-1">
                <RadioButton
                  inputId="code"
                  name="useOperationSearch"
                  value="코드 검색"
                  onChange={handleFormChange}
                  checked={form.useOperationSearch === "코드 검색"}
                />
                <label htmlFor="code" className="ml-2">
                  코드 검색
                </label>
              </div>
              <div className="flex items-center">
                <RadioButton
                  inputId="name"
                  name="useOperationSearch"
                  value="이미지명 검색"
                  onChange={handleFormChange}
                  checked={form.useOperationSearch === "이미지명 검색"}
                />
                <label htmlFor="name" className="ml-2">
                  이미지명 검색
                </label>
              </div>
            </div>
            <InputText
              placeholder="검색어"
              value={form.searchText}
              onChange={(e) => setForm((prev) => ({ ...prev, searchText: e.target.value }))}
            />
          </div>
          <Button label="검색" onClick={handleSearch} />
        </div>
        <div className="datatable">
          <div className="datatable__header">
            <h3>절수이미지 목록</h3>
            <div className="datatable__btns">
              <Button
                label="삭제"
                severity="danger"
                size="small"
                icon="pi pi-times"
                onClick={handleDelete}
              />
              <Button
                label="추가"
                size="small"
                icon="pi pi-plus"
                onClick={() => navigate("/cutImageEntry/new")}
              />
            </div>
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
          >
            <Column header="순번" body={(_, options) => options.rowIndex + 1} />
            <Column field="code" header="코드"></Column>
            <Column field="name" header="이미지명"></Column>
          </DataTable>
        </div>
      </div>
      <div className="detail">
        <div className="con-header">
          <h4 className="con-header__title">절수이미지 상세</h4>
          <div className="con-header__btns">
            <Button
              label="수정"
              onClick={() => navigate(`/cutImageEntry/${selectedRow?.code}/edit`)}
            />
          </div>
        </div>
        <div className="con-body">
          <div className="con-body__data">
            <p>절수코드</p>
            <span>{selectedRow?.code}</span>
          </div>
          <div className="con-body__data">
            <p>절수명</p>
            <span>{selectedRow?.name}</span>
          </div>

          <div className="CutImageEntry-btns">
            <Button label="이미지 출력" onClick={printImg} />
            <Button
              label="이미지 확대"
              onClick={() => {
                setActiveIndex(0);
                galleriaRef.current.show();
              }}
            />
          </div>

          {/* 일반 보기용 Galleria */}
          <div className="mt-3">
            <Galleria
              value={selectedRow?.Imgs}
              responsiveOptions={responsiveOptions}
              numVisible={5}
              item={itemTemplate}
              onItemChange={(e) => setActiveIndex(e.index)}
              thumbnail={thumbnailTemplate}
              activeIndex={activeIndex}
              showThumbnails={true}
              showItemNavigators={true}
              circular={true}
              style={{ maxWidth: "100%" }}
            />
          </div>

          {/* 전체화면용 Galleria */}
          <Galleria
            ref={galleriaRef}
            value={selectedRow?.Imgs}
            responsiveOptions={responsiveOptions}
            numVisible={7}
            item={itemTemplate}
            onItemChange={(e) => setActiveIndex(e.index)}
            thumbnail={thumbnailTemplate}
            activeIndex={activeIndex}
            fullScreen
            showItemNavigators
            showThumbnails={false}
            circular
          />
        </div>
      </div>
    </div>
  );
};

export default CutImageEntryPage;
