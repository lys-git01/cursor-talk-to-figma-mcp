/** 수금 처리 등록 및 수정 팝업 */

import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";
import { Column } from "primereact/column";
import { confirmDialog } from "primereact/confirmdialog";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { faker } from "@faker-js/faker";
import { formatDates } from "@/utils/common";
import useToastStore from "@/store/toastStore";
import useDialogStore from "@/store/dialogStore";

const PaymentProcessForm2201 = ({ onCloseFn, data, state }) => {
  const showToast = useToastStore.getState().showToast;
  const openDialog = useDialogStore((s) => s.openDialog);
  const [paymentProcList, setPaymentProcList] = useState([]);
  const [selectedDetailRow, setSelectedDetailRow] = useState(null);
  const [isDetailEdit, setIsDetailEdit] = useState(false);

  const toast = useRef(null);

  const initialDetailForm = {
    paymentStatus: "",
    manageNum: "",
    status: "",
    financialInst: "",
    dateOfIssue: null,
    endDate: null,
    detailMemo: "",
    paymentPrice: null,
    isNoDateOfIssue: true,
    isNoEndDate: true,
  };

  const initialForm = {
    paymentNum: data?.paymentNum ?? null,
    paymentDate: data?.paymentDate ? new Date(data.paymentDate) : formatDates("today"),
    paymentPoint: data?.paymentPoint ?? "",
    depositName: data?.depositName ?? "",
    manager: data?.manager ?? "",
    totalPrice: data?.totalPrice ?? null,
    memo: data?.memo ?? "",
    ...initialDetailForm,
  };
  const [form, setForm] = useState(initialForm);

  // 수금목록 수정 시 상세목록 데이터 설정
  useEffect(() => {
    if (data?.detailList && !state.includes("내역")) {
      setPaymentProcList(data.detailList);
    }
  }, [data, state]);

  // 공통 입력 필드 렌더링 함수
  const validateForm = () => {
    let errorType = "";

    if (state.includes("내역")) {
      errorType = !form.financialInst ? "금융기관" : "";
    } else {
      errorType = !form.paymentPoint ? "지급처" : !form.manager ? "담당자" : "";
    }

    if (errorType) {
      toast.current.show({
        severity: "error",
        summary: "오류",
        detail: `${errorType}을 입력해주세요.`,
      });
      return false;
    }

    return true;
  };

  const saveData = () => {
    if (!validateForm()) return;

    const formData = {
      ...form,
      paymentDate: form.paymentDate ? form.paymentDate.toISOString().split("T")[0] : null,
      dateOfIssue: form.dateOfIssue ? form.dateOfIssue.toISOString().split("T")[0] : null,
      endDate: form.endDate ? form.endDate.toISOString().split("T")[0] : null,
    };

    // 수금목록 수정 시 상세목록 데이터도 함께 전달
    if (!state.includes("내역")) {
      formData.detailList = paymentProcList;
    }

    onCloseFn(formData);
  };

  const clientSearchBtn = () => {
    openDialog("DGClientSelect1", {
      title: "거래처검색",
      onClose: (selectedClient) => {
        if (!selectedClient) return;
        setForm((prev) => ({
          ...prev,
          clientName: selectedClient.clientName,
        }));
      },
    });
  };

  const findList = (index) => {
    openDialog("DGManager", {
      onClose: (data) => {
        setCopyUser(
          copyUser.map((item, i) => {
            if (i === index) {
              return { name: data.name, id: data.id };
            }
            return item;
          }),
        );
      },
    });
  };

  const findComonList = (type, field) => {
    let state = field === "은행" ? "bank" : "salearea";
    openDialog(type, {
      onClose: (selectedItems) => {
        setFormData((prev) => ({
          ...prev,
          [field]: selectedItems,
        }));
      },
      state: state,
    });
  };

  const onChange = (field) => (e) => {
    const value = e.target ? e.target.value : e.value;

    const isCodeField = field === "code";
    const isValidCode = /^\d{0,2}$/.test(value);

    if (!isCodeField || isValidCode) {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleCheckboxChange = (field) => (e) => {
    const isChecked = e.checked;
    if (field === "isNoDateOfIssue") {
      setForm({
        ...form,
        isNoDateOfIssue: isChecked,
        dateOfIssue: isChecked ? null : form.dateOfIssue,
      });
    } else if (field === "isNoEndDate") {
      setForm({
        ...form,
        isNoEndDate: isChecked,
        endDate: isChecked ? null : form.endDate,
      });
    }
  };

  const handleDetailEdit = (rowData) => {
    setSelectedDetailRow(rowData);
    setIsDetailEdit(true);
    setForm({
      ...form,
      paymentStatus: rowData.paymentStatus,
      manageNum: rowData.manageNum,
      status: rowData.status,
      financialInst: rowData.financialInst,
      dateOfIssue: rowData.dateOfIssue ? new Date(rowData.dateOfIssue) : null,
      endDate: rowData.endDate ? new Date(rowData.endDate) : null,
      detailMemo: rowData.detailMemo,
      paymentPrice: rowData.paymentPrice,
      isNoDateOfIssue: !rowData.dateOfIssue,
      isNoEndDate: !rowData.endDate,
    });
  };

  const handleDetailDelete = (rowData) => {
    const updatedList = paymentProcList.filter((item) => item.rowNum !== rowData.rowNum);
    setPaymentProcList(updatedList);
  };

  const resetDetailForm = () => {
    setForm({
      ...form,
      ...initialDetailForm,
    });
    setSelectedDetailRow(null);
  };

  const handleDetailSave = () => {
    // 필수 입력값 검증
    if (!form.financialInst) {
      showToast({
        severity: "error",
        summary: "입력 오류",
        detail: "금융기관을 입력해주세요.",
        life: 3000,
      });
      return;
    }

    if (selectedDetailRow) {
      // 수정
      const updatedList = paymentProcList.map((item) =>
        item.rowNum === selectedDetailRow.rowNum
          ? {
              ...item,
              paymentStatus: form.paymentStatus,
              manageNum: form.manageNum,
              status: form.status,
              financialInst: form.financialInst,
              dateOfIssue: !form.isNoDateOfIssue
                ? form.dateOfIssue
                  ? form.dateOfIssue.toISOString().split("T")[0]
                  : null
                : null,
              endDate: !form.isNoEndDate
                ? form.endDate
                  ? form.endDate.toISOString().split("T")[0]
                  : null
                : null,
              detailMemo: form.detailMemo,
              paymentPrice: form.paymentPrice,
            }
          : item,
      );
      setPaymentProcList(updatedList);
    } else {
      // 새로운 항목 추가
      const newDetail = {
        rowNum: paymentProcList.length + 1,
        paymentStatus: form.paymentStatus,
        manageNum: form.manageNum,
        status: form.status,
        financialInst: form.financialInst,
        dateOfIssue: !form.isNoDateOfIssue
          ? form.dateOfIssue
            ? form.dateOfIssue.toISOString().split("T")[0]
            : null
          : null,
        endDate: !form.isNoEndDate
          ? form.endDate
            ? form.endDate.toISOString().split("T")[0]
            : null
          : null,
        detailMemo: form.detailMemo,
        paymentPrice: form.paymentPrice,
      };
      setPaymentProcList([...paymentProcList, newDetail]);
    }

    // 폼 초기화
    resetDetailForm();

    showToast({
      severity: "success",
      summary: "저장 완료",
      detail: "수금 상세 내역이 저장되었습니다.",
      life: 3000,
    });
  };

  const actionBodyTemplate = (type, rowData) => {
    return (
      <div className="buttonSet">
        <Button label="수정" outlined size="small" onClick={() => handleDetailEdit(rowData)} />
        <Button
          label="삭제"
          outlined
          size="small"
          severity="danger"
          onClick={() => handleDetailDelete(rowData)}
        />
      </div>
    );
  };

  // 상세 목록 테이블 렌더링
  const renderDetailTable = () => {
    return (
      <div className="datatable__body mt-3">
        <DataTable
          emptyMessage="수금 상세 내역이 없습니다."
          value={paymentProcList}
          dataKey="rowNum"
          showGridlines
          scrollable
          scrollHeight="200px"
          className="payment-table"
        >
          <Column field="paymentStatus" header="수금구분" />
          <Column field="manageNum" header="관리번호" />
          <Column field="status" header="자/타" />
          <Column field="paymentPrice" header="수금액" />
          <Column field="financialInst" header="금융기관" />
          <Column field="dateOfIssue" header="발행일자" />
          <Column field="endDate" header="만기/약정" />
          <Column field="detailMemo" header="비고" />
          <Column
            body={(rowData) => actionBodyTemplate("list", rowData)}
            header="수정/삭제"
            style={{ width: "150px" }}
          />
        </DataTable>
      </div>
    );
  };

  return (
    <Dialog
      header={`수금 ${state}`}
      visible
      onHide={() => {
        resetDetailForm();
        onCloseFn(null);
      }}
      className="PaymentProcessForm2201"
      modal
      style={{ width: "53vw" }}
    >
      <Toast ref={toast} />
      <div className="payment-form Dialog-container">
        {!state.includes("내역") && (
          <>
            <div className="list-action-form mb-5">
              <div className="form-row">
                <div className="form-group">
                  <label>수금일자</label>
                  <Calendar
                    value={form.paymentDate}
                    onChange={(e) => setForm({ ...form, paymentDate: e.value })}
                    showIcon
                    dateFormat="yy-mm-dd"
                  />
                </div>
                <div className="form-group">
                  <label>지급처*</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={form.paymentPoint}
                      onChange={(e) => setForm({ ...form, paymentPoint: e.target.value })}
                    />
                    <Button className="p-button-sch" label="찾기" onClick={clientSearchBtn} />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>비고</label>
                  <InputTextarea
                    value={form.memo}
                    onChange={(e) => setForm({ ...form, memo: e.target.value })}
                    rows={1}
                  />
                </div>
                <div className="form-group">
                  <label>담당자*</label>
                  <div className="p-inputgroup">
                    <InputText
                      value={form.manager}
                      onChange={(e) => setForm({ ...form, manager: e.target.value })}
                    />
                    <Button className="p-button-sch" label="찾기" onClick={findList} />
                  </div>
                </div>
              </div>

              <h4 className="mt-4 mb-2">수금 상세 내역</h4>
              {renderDetailTable()}
            </div>
          </>
        )}

        <section className="detail-form">
          <div className="form-row">
            <div className="form-group">
              <label>수금구분</label>
              <Dropdown
                value={form.paymentStatus}
                onChange={onChange("paymentStatus")}
                options={["현금", "카드"]}
                placeholder="사용여부"
              />
            </div>
            <div className="form-group">
              <label>자수/타수</label>
              <div className="p-inputgroup">
                <Dropdown
                  value={form.status}
                  onChange={onChange("status")}
                  options={["없음", "자수", "타수"]}
                  placeholder="사용여부"
                />
              </div>
            </div>
          </div>

          <div className="form-row half-width-row">
            <div className="form-group">
              <label>관리번호</label>
              <InputText
                value={form.manageNum}
                onChange={(e) => setForm({ ...form, manageNum: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row half-width-row">
            <div className="form-group">
              <label>금융기관*</label>
              <div className="p-inputgroup">
                <InputText
                  value={form.financialInst}
                  onChange={(e) => setForm({ ...form, financialInst: e.target.value })}
                />
                <Button
                  className="p-button-sch"
                  label="찾기"
                  onClick={() => findComonList("DGCommonCode1", "은행")}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>금액</label>
              <InputNumber
                value={form.paymentPrice}
                onChange={(e) => setForm({ ...form, paymentPrice: e.value })}
                rows={1}
              />
            </div>
            <div className="form-group">
              <label>발생일</label>
              <div className="payment-date-form">
                <Calendar
                  value={form.dateOfIssue}
                  onChange={(e) => setForm({ ...form, dateOfIssue: e.value })}
                  showIcon
                  dateFormat="yy-mm-dd"
                  disabled={form.isNoDateOfIssue}
                />
                <label className="flex items-center">
                  <Checkbox
                    checked={form.isNoDateOfIssue}
                    onChange={handleCheckboxChange("isNoDateOfIssue")}
                    className="mr-2"
                  />
                  없음
                </label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>비고</label>
              <InputTextarea
                value={form.detailMemo}
                onChange={(e) => setForm({ ...form, detailMemo: e.target.value })}
                rows={1}
              />
            </div>
            <div className="form-group">
              <label>만기/약정일</label>
              <div className="payment-date-form">
                <Calendar
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.value })}
                  showIcon
                  dateFormat="yy-mm-dd"
                  disabled={form.isNoEndDate}
                />
                <label className="flex items-center">
                  <Checkbox
                    checked={form.isNoEndDate}
                    onChange={handleCheckboxChange("isNoEndDate")}
                    className="mr-2"
                  />
                  없음
                </label>
              </div>
            </div>
          </div>
          {!state.includes("내역") && (
            <Button
              className="width-100"
              label="수금내역 저장"
              severity="secondary"
              onClick={handleDetailSave}
            />
          )}
        </section>

        <div className="Dialog__btns">
          <Button label="취소" severity="secondary" onClick={() => onCloseFn(null)} />
          <Button label="저장" onClick={saveData} />
        </div>
      </div>
    </Dialog>
  );
};

export default PaymentProcessForm2201;
