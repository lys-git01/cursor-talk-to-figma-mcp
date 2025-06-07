// DialogContainer.jsx
import React, { Suspense } from "react";
import useDialogStore from "@/store/dialogStore";
import { ADialog, BDialog, CDialog } from "@/dialog/DialogSample";
import { ProgressSpinner } from "primereact/progressspinner";

// 공통
import { DGManager } from "@/dialog/common/DGManager";
import { DGClientSelect1 } from "@/dialog/common/DGClientSelect1";
import DGClientInfo from "@/dialog/common/DGClientInfo";
import DGClaimListManage from "@/dialog/common/DGClaimListManage";
import DGCommonCode1 from "@/dialog/common/DGCommonCode1";
import DGCommonCode2 from "@/dialog/common/DGCommonCode2";
import DGImageViewer from "@/dialog/common/DGImageViewer";
import DGBillingCode from "@/dialog/common/DGBillingCode";
import DGWorkSummaryCode from "@/dialog/common/DGWorkSummaryCode";
import DGMachineList from "@/dialog/common/DGMachineList";
import DGProcessCode from "@/dialog/common/DGProcessCode";
import DGItemCodeList from "@/dialog/common/DGItemCodeList";
import DGSalesLookup from "@/dialog/common/DGSalesLookup";
import DGClientManagerChan from "@/dialog/common/DGClientManagerChan";
import DGBadClaimHistory from "@/dialog/common/DGBadClaimHistory";
import DGNoteStatusEdit from "@/dialog/common/DGNoteStatusEdit";
import DGIssuerInfo from "@/dialog/common/DGIssuerInfo";

// 2-SA
import PaymentProcessForm2201 from "@/dialog/2-SA/PaymentProcessForm2201";
import PaymentResonForm from "@/dialog/2-SA/PaymentResonForm2203-4";
import BadClaimConfirmedOrNot2205 from "@/dialog/2-SA/BadClaimConfirmedOrNot2205";
import PaymentPromiseForm2207 from "@/dialog/2-SA/PaymentPromiseForm2207";
import BouncedNoteForm2208 from "@/dialog/2-SA/BouncedNoteForm2208";
import CollectHistoryForm2208 from "@/dialog/2-SA/CollectHistoryForm2208";

// 7-BM
import {
  // 7.1 권한/사용자
  UpdateRemark7101,
  CopyMenu7101,
  AssigneeHis7102,
  UpdateMemo7102,
  AddCreditEntry7102,
  AddUserEntry7104,
  // 7.2 기초코드
  LaminateForm7201,
  ProcessForm7202,
  DetailProcessForm7202,
  BillingCodeForm7203,
  CommonCodeForm7204,
  DeviceCodeForm7205,
  IntegratedDeviceForm7205,
  AutoProcessForm7208,
  PaperPriceEntry7209,
  LaminateBillingForm7211,
  // 7.3 자재관리
  BulkClientMgrForm7303,
  MaterialGroupForm7304,
  MaterialEntryForm7305,
  // 7.4 마감관리
  ClosingDateForm7408,
  DeptForm7403,
  DivisionForm7403,
  AccountTitleForm7406,
  // 7.5 관리내역
  MgmtHistoryForm7405,
  MgmtHistoryUpdate7405,
  CostEntryPageForm7103,
} from "@/dialog/7-BM";

// 다이얼로그 매핑 객체
const DIALOG_COMPONENTS = {
  // 예시
  A: ADialog,
  B: BDialog,
  C: CDialog,

  // 공통
  DGManager,
  DGImageViewer,
  DGCommonCode1,
  DGClientInfo,
  DGClaimListManage,
  DGClientSelect1,
  DGBillingCode,
  DGWorkSummaryCode,
  DGMachineList,
  DGProcessCode,
  DGItemCodeList,
  DGSalesLookup,
  DGClientManagerChan,
  DGBadClaimHistory,
  DGNoteStatusEdit,
  DGIssuerInfo,

  // 2-SA
  PaymentProcessForm2201,
  PaymentResonForm,
  DGCommonCode2,
  BadClaimConfirmedOrNot2205,
  PaymentPromiseForm2207,
  BouncedNoteForm2208,
  CollectHistoryForm2208,

  // 7-BM
  AssigneeHis7102,
  UpdateMemo7102,
  AddCreditEntry7102,
  PaperPriceEntry7209,
  AddUserEntry7104,
  UpdateRemark7101,
  CopyMenu7101,
  LaminateForm7201,
  ProcessForm7202,
  DetailProcessForm7202,
  BillingCodeForm7203,
  CommonCodeForm7204,
  DeviceCodeForm7205,
  IntegratedDeviceForm7205,
  AutoProcessForm7208,
  LaminateBillingForm7211,
  ClosingDateForm7408,
  BulkClientMgrForm7303,
  MaterialGroupForm7304,
  MaterialEntryForm7305,
  DeptForm7403,
  DivisionForm7403,
  AccountTitleForm7406,
  MgmtHistoryForm7405,
  MgmtHistoryUpdate7405,
  CostEntryPageForm7103,
};

const DialogContainer = () => {
  const dialogs = useDialogStore((s) => s.dialogs);
  const closeDialog = useDialogStore((s) => s.closeDialog);
  if (dialogs.length === 0) return null;

  return (
    <>
      {dialogs.map(({ id, type, props }) => {
        const DialogComponent = DIALOG_COMPONENTS[type];
        if (!DialogComponent) return null;

        const handleClose = (data) => {
          if (typeof props.onClose === "function") {
            props.onClose(data);
          }
          closeDialog(id);
        };

        return (
          <Suspense
            key={id}
            fallback={
              <div className="dialog-loading">
                <ProgressSpinner />
              </div>
            }
          >
            <DialogComponent onCloseFn={handleClose} {...props} />
          </Suspense>
        );
      })}
    </>
  );
};

export default DialogContainer;
