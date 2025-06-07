import { lazy } from "react";

// 7.1 권한/사용자
export const UpdateRemark7101 = lazy(() => import("./AuthEntry/UpdateRemark7101"));
export const CopyMenu7101 = lazy(() => import("./AuthEntry/CopyMenu7101"));
export const AssigneeHis7102 = lazy(() => import("./CreditEntry/AssigneeHis7102"));
export const UpdateMemo7102 = lazy(() => import("./CreditEntry/UpdateMemo7102"));
export const AddCreditEntry7102 = lazy(() => import("./CreditEntry/AddCreditEntry7102"));
export const AddUserEntry7104 = lazy(() => import("./UserEntry/AddUserEntry7104"));

// 7.2 기초코드
export const LaminateForm7201 = lazy(() => import("./LaminateCode/LaminateForm7201"));
export const ProcessForm7202 = lazy(() => import("./ProcessCodeEntry/ProcessForm7202"));
export const DetailProcessForm7202 = lazy(() => import("./ProcessCodeEntry/DetailProcessForm7202"));
export const BillingCodeForm7203 = lazy(() => import("./BillingCodeForm7203"));
export const CommonCodeForm7204 = lazy(() => import("./CommonCodeForm7204"));
export const DeviceCodeForm7205 = lazy(() => import("./DeviceCode/DeviceCodeForm7205"));
export const IntegratedDeviceForm7205 = lazy(() => import("./DeviceCode/IntegratedDeviceForm7205"));
export const AutoProcessForm7208 = lazy(() => import("./AutoProcessForm7208"));
export const PaperPriceEntry7209 = lazy(() => import("./PaperPriceEntry/PaperPriceEntry7209"));
export const LaminateBillingForm7211 = lazy(() => import("./LaminateBillingForm7211"));

// 7.3 자재관리
export const BulkClientMgrForm7303 = lazy(() => import("./BulkClientMgrForm7303"));
export const MaterialGroupForm7304 = lazy(() => import("./MaterialGroupForm7304"));
export const MaterialEntryForm7305 = lazy(() => import("./MaterialEntryForm7305"));

// 7.4 마감관리
export const ClosingDateForm7408 = lazy(() => import("./ClosingDateForm7408"));
export const DeptForm7403 = lazy(() => import("./DeptEntry/DeptForm7403"));
export const DivisionForm7403 = lazy(() => import("./DeptEntry/DivisionForm7403"));
export const AccountTitleForm7406 = lazy(() => import("./AccountTitleForm7406"));
export const MgmtHistoryForm7405 = lazy(() => import("./MgmtHistory/MgmtHistoryForm7405"));
export const MgmtHistoryUpdate7405 = lazy(() => import("./MgmtHistory/MgmtHistoryUpdate7405"));
export const CostEntryPageForm7103 = lazy(() => import("./CostEntryPageForm7103"));
