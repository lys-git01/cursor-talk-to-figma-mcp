/* 어음현황 수정 L5001 DG-noteStatusEdit DG-72 */

import useDialogStore from "@/store/dialogStore";
import useToastStore from "@/store/toastStore";
import { formatNumberWithCommas } from "@/utils/common";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const DGNoteStatusEdit = ({ onCloseFn, data }) => {
  const toast = useRef(null);
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);

  const handleSelectedIssuer = () => {
    openDialog("DGIssuerInfo", {
      data: data?.id,
    });
  };

  const valueFormat = (value) => {
    if (!value) return;
    return formatNumberWithCommas(value);
  };

  // 검색 버튼이 있는 입력 필드 컴포넌트
  const SearchInput = ({ label, value, onSearch, type }) => (
    <div className="form__input common-search__input">
      <p>{label}</p>
      <span className="callList" style={{ width: "90px" }}>
        {value}
      </span>
      <Button label="찾기" size="small" onClick={() => onSearch(type, label)} />
    </div>
  );

  const basicInfoRows = [
    [
      { label: "발행전표", value: data?.slipDate },
      { label: "번호", value: 100 },
      { label: "라인", value: 10 },
    ],
    [{ label: "어음번호", value: data?.noteNum }],
    [{ label: "거래처", value: `${data?.id} | ${data?.customerName}` }],
    [{ label: "발생금액", value: valueFormat(data?.occurPrice) }],
  ];

  return (
    <Dialog
      header={`어음현황 수정`}
      visible
      onHide={() => onCloseFn(null)}
      className="DGNoteStatusEdit"
      style={{ width: "35vw" }}
    >
      <Toast ref={toast} />
      <div className="Dialog-container form-list">
        {basicInfoRows.map((row, idx) => (
          <div key={idx} className="form__input">
            {row.map((item, itemIdx) => (
              <div key={itemIdx} className="flex items-center" style={{ marginRight: "1rem" }}>
                <p>{item.label}</p>
                <div className="flex items-center justify-between" style={{ width: "100%" }}>
                  {item.isAddress ? (
                    <div>
                      <span>{item.value[0]}</span>
                      <br />
                      <span style={{ marginTop: "0.5rem", display: "block" }}>{item.value[1]}</span>
                    </div>
                  ) : (
                    <>
                      <span>{item.value}</span>
                      {item.button}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        <Divider />
        <div className="form__input">
          <p>어음종류</p>
          <Dropdown value={"전자"} options={["전자"]} />
          <p>어음현황</p>
          <Dropdown value={"보유"} options={["보유"]} />
          <p>할인여부</p>
          <Dropdown value={"불가능"} options={["불가능"]} />
        </div>
        <div className="form__input">
          <SearchInput label="발행인" value={data?.publisher} onSearch={handleSelectedIssuer} />
        </div>
        <div className="form__input">
          <p>은행명</p>
          <Dropdown value={"지정안됨"} options={["지정안됨"]} />
          <InputText value={data?.memo} placeholder={"비고"} className="width-100" />
        </div>
        <div className="form__input">
          <p>비고</p>
          <InputText value={data?.memo} placeholder={"비고"} className="width-100" />
        </div>
      </div>
      <div className="Dialog__btns">
        <Button label="닫기" severity="secondary" onClick={() => onCloseFn(null)} />
      </div>
    </Dialog>
  );
};

export default DGNoteStatusEdit;
