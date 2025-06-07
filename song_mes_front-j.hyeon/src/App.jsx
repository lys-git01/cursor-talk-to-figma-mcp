import { useEffect, Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import MainLayout from "@/layouts/MainLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { registerKoLocale } from "@/utils/locale-ko";

// Lazy loaded components
const LoginPage = lazy(() => import("@/pages/0-main/LoginPage"));
const ChangePWPage = lazy(() => import("@/pages/0-main/ChangePWPage"));
const MainPage = lazy(() => import("@/pages/0-main/MainPage"));
const StyleGuide = lazy(() => import("@/pages/99-StyleGuide/StyleGuide"));

// 2.2. 수금관리 (Payment Mng)
const PaymentProcessPage = lazy(() => import("@/pages/2-SA/2.2.paymentMng/PaymentProcessPage"));
const PaymentStatusPage = lazy(() => import("@/pages/2-SA/2.2.paymentMng/PaymentStatusPage"));
const ClaimStatusPage = lazy(() => import("@/pages/2-SA/2.2.paymentMng/ClaimStatusPage"));
const OldClaim2020Page = lazy(() => import("@/pages/2-SA/2.2.paymentMng/OldClaim2020Page"));
const BadClaimEntryPage = lazy(() => import("@/pages/2-SA/2.2.paymentMng/BadClaimEntryPage"));
const BadClaimEntryFormPage = lazy(
  () => import("@/pages/2-SA/2.2.paymentMng/BadClaimEntryFormPage"),
);
const BadClaimStatusPage = lazy(() => import("@/pages/2-SA/2.2.paymentMng/BadClaimStatusPage"));
const ReceivedNotePage = lazy(() => import("@/pages/2-SA/2.2.paymentMng/ReceivedNotePage"));
const BouncedNotePage = lazy(() => import("@/pages/2-SA/2.2.paymentMng/BouncedNotePage"));

// 7.1. 공통코드 (Common Code)
const CreditEntryPage = lazy(() => import("@/pages/7-BM/7.1.commonCode/CreditEntryPage"));
const AuthEntryPage = lazy(() => import("@/pages/7-BM/7.1.commonCode/AuthEntryPage"));
const CostEntryPage = lazy(() => import("@/pages/7-BM/7.1.commonCode/CostEntryPage"));
const UserEntryPage = lazy(() => import("@/pages/7-BM/7.1.commonCode/UserEntryPage"));
const CreditEntryFormPage = lazy(() => import("@/pages/7-BM/7.1.commonCode/CreditEntryFormPage"));

// 7.2. 생산코드 (Production Code)
const PaperPriceEntryPage = lazy(() => import("@/pages/7-BM/7.2.prodCode/PaperPriceEntryPage"));
const LaminateCodePage = lazy(() => import("@/pages/7-BM/7.2.prodCode/LaminateCodePage"));
const ProcessCodeEntryPage = lazy(() => import("@/pages/7-BM/7.2.prodCode/ProcessCodeEntryPage"));
const BillingCodeEntryPage = lazy(() => import("@/pages/7-BM/7.2.prodCode/BillingCodeEntryPage"));
const CommonCodePage = lazy(() => import("@/pages/7-BM/7.2.prodCode/CommonCodePage"));
const DeviceCodePage = lazy(() => import("@/pages/7-BM/7.2.prodCode/DeviceCodePage"));
const CutImageEntryPage = lazy(() => import("@/pages/7-BM/7.2.prodCode/CutImageEntryPage"));
const CutImageEntryFormPage = lazy(() => import("@/pages/7-BM/7.2.prodCode/CutImageEntryFormPage"));
const AutoProcessCodePage = lazy(() => import("@/pages/7-BM/7.2.prodCode/AutoProcessCodePage"));
const WorkTypeEntryPage = lazy(() => import("@/pages/7-BM/7.2.prodCode/WorkTypeEntryPage"));
const LaminateBillingPage = lazy(() => import("@/pages/7-BM/7.2.prodCode/LaminateBillingPage"));
const StandardProductPage = lazy(() => import("@/pages/7-BM/7.2.prodCode/StandardProductPage"));
// 7.3. 기초정보관리 (Master Data)
const GeneralClientPage = lazy(() => import("@/pages/7-BM/7.3.MasterData/GeneralClientPage"));
const FinanceClientPage = lazy(() => import("@/pages/7-BM/7.3.MasterData/FinanceClientPage"));
const FinanceClientFormPage = lazy(
  () => import("@/pages/7-BM/7.3.MasterData/FinanceClientFormPage"),
);
const BulkClientMgrPage = lazy(() => import("@/pages/7-BM/7.3.MasterData/BulkClientMgrPage"));
const MaterialGroupPage = lazy(() => import("@/pages/7-BM/7.3.MasterData/MaterialGroupPage"));
const MaterialEntryPage = lazy(() => import("@/pages/7-BM/7.3.MasterData/MaterialEntryPage"));
const MachineManagerPage = lazy(() => import("@/pages/7-BM/7.3.MasterData/MachineManagerPage"));

// 7.4. 시스템관리 (System)
const ClosingDatePage = lazy(() => import("@/pages/7-BM/7.4.system/ClosingDatePage"));
const CompanyEntryPage = lazy(() => import("@/pages/7-BM/7.4.system/CompanyEntryPage"));
const CompanyEntryFormPage = lazy(() => import("@/pages/7-BM/7.4.system/CompanyEntryFormPage"));
const SiteEntryPage = lazy(() => import("@/pages/7-BM/7.4.system/SiteEntryPage"));
const SiteEntryFormPage = lazy(() => import("@/pages/7-BM/7.4.system/SiteEntryFormPage"));
const DeptEntryPage = lazy(() => import("@/pages/7-BM/7.4.system/DeptEntryPage"));
const SystemConfigPage = lazy(() => import("@/pages/7-BM/7.4.system/SystemConfigPage"));
const MgmtHistoryPage = lazy(() => import("@/pages/7-BM/7.4.system/MgmtHistoryPage"));
const AccountTitlePage = lazy(() => import("@/pages/7-BM/7.4.system/AccountTitlePage"));
const MenuMgmtPage = lazy(() => import("@/pages/7-BM/7.4.system/MenuMgmtPage"));

function App() {
  registerKoLocale(); // 날짜 선택시 언어 초기세팅
  const { userInfo, isAuthLoaded, loadUserInfo } = useAuthStore();

  useEffect(() => {
    loadUserInfo(); // 상태 초기화
  }, []);

  // 로딩 중이면 렌더링하지 않음 (또는 로딩 화면 표시 가능)
  if (!isAuthLoaded) {
    return <ProgressSpinner />;
  }

  return (
    <Suspense
      fallback={
        <div className="screen-spinner">
          <ProgressSpinner />
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/changePW" element={<ChangePWPage />} />
        <Route path="/styleGuide" element={<StyleGuide />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={userInfo ? <MainPage /> : <Navigate to="/login" replace />} />
          {/* 2.2. 영업부 (Sales) */}
          <Route path="/paymentProcess" element={<PaymentProcessPage />} />
          <Route path="/paymentStatus" element={<PaymentStatusPage />} />
          <Route path="/claimStatus" element={<ClaimStatusPage />} />
          <Route path="/oldClaim2020" element={<OldClaim2020Page />} />
          <Route path="/badClaimEntry" element={<BadClaimEntryPage />} />
          <Route path="/badClaimEntry/new" element={<BadClaimEntryFormPage />} />
          <Route path="/badClaimEntry/:id/edit" element={<BadClaimEntryFormPage />} />
          <Route path="/badClaimStatus" element={<BadClaimStatusPage />} />
          <Route path="/receivedNote" element={<ReceivedNotePage />} />
          <Route path="/bouncedNote" element={<BouncedNotePage />} />
          {/* 7.1. 공통코드 (Common Code) */}
          <Route path="/authEntry" element={<AuthEntryPage />} />
          <Route path="/creditEntry" element={<CreditEntryPage />} />
          <Route path="/creditEntry/new" element={<CreditEntryFormPage />} />
          <Route path="/creditEntry/:id/edit" element={<CreditEntryFormPage />} />
          <Route path="/costEntry" element={<CostEntryPage />} />
          <Route path="/userEntry" element={<UserEntryPage />} />
          {/* 7.2. 생산코드 (Production Code) */}
          <Route path="/laminateCode" element={<LaminateCodePage />} />
          <Route path="/processCodeEntry" element={<ProcessCodeEntryPage />} />
          <Route path="/billingCodeEntry" element={<BillingCodeEntryPage />} />
          <Route path="/commonCode" element={<CommonCodePage />} />
          <Route path="/deviceCode" element={<DeviceCodePage />} />
          <Route path="/cutImageEntry" element={<CutImageEntryPage />} />
          <Route path="/cutImageEntry/new" element={<CutImageEntryFormPage />} />
          <Route path="/cutImageEntry/:id/edit" element={<CutImageEntryFormPage />} />
          <Route path="/workTypeEntry" element={<WorkTypeEntryPage />} />
          <Route path="/autoProcessCode" element={<AutoProcessCodePage />} />
          <Route path="/paperPriceEntry" element={<PaperPriceEntryPage />} />
          <Route path="/laminateBilling" element={<LaminateBillingPage />} />
          <Route path="/standardProduct" element={<StandardProductPage />} />
          {/* 7.3. 기초정보관리 (Master Data) */}
          <Route path="/generalClient" element={<GeneralClientPage />} /> {/* A0100, BM-7301 */}
          <Route path="/financeClient" element={<FinanceClientPage />} /> {/* A0110, BM-7302 */}
          <Route path="/financeClient/new" element={<FinanceClientFormPage />} />{" "}
          {/* A0110, BM-7302 */}
          <Route path="/financeClient/:id/edit" element={<FinanceClientFormPage />} />{" "}
          {/* A0110, BM-7302 */}
          <Route path="/bulkClientMgr" element={<BulkClientMgrPage />} /> {/* A0120, BM-7303 */}
          <Route path="/materialGroup" element={<MaterialGroupPage />} /> {/* A0210, BM-7304 */}
          <Route path="/materialEntry" element={<MaterialEntryPage />} /> {/* A0200, BM-7305 */}
          <Route path="/machineManager" element={<MachineManagerPage />} /> {/* F1126, BM-7306 */}
          {/* 7.4. 시스템관리 (System) */}
          <Route path="/closingDate" element={<ClosingDatePage />} />
          <Route path="/companyEntry" element={<CompanyEntryPage />} /> {/* A0010, BM-7401 */}
          <Route path="/companyEntry/new" element={<CompanyEntryFormPage />} />{" "}
          {/* A0010, BM-7401 */}
          <Route path="/companyEntry/:id/edit" element={<CompanyEntryFormPage />} />{" "}
          {/* A0010, BM-7401 */}
          <Route path="/siteEntry" element={<SiteEntryPage />} /> {/* A0015, BM-7402 */}
          <Route path="/siteEntry/new" element={<SiteEntryFormPage />} />
          <Route path="/siteEntry/:id/edit" element={<SiteEntryFormPage />} />
          <Route path="/deptEntry" element={<DeptEntryPage />} /> {/* A0020, BM-7403 */}
          <Route path="/systemConfig" element={<SystemConfigPage />} /> {/* A0025, BM-7404 */}
          <Route path="/mgmtHistory" element={<MgmtHistoryPage />} /> {/* A0030, BM-7405 */}
          <Route path="/accountTitle" element={<AccountTitlePage />} /> {/* A0035, BM-7406 */}
          <Route path="/menuMgmt" element={<MenuMgmtPage />} /> {/* A0040, BM-7407 */}
        </Route>
        {/* Error Pages */}
        <Route path="/500" element={<ErrorPage type="500" />} />
        <Route path="*" element={<ErrorPage type="404" />} />
      </Routes>
    </Suspense>
  );
}

export default App;

const ErrorPage = ({ type }) => {
  return (
    <div className="flex justify-center items-center" style={{ height: "100vh" }}>
      Error: {type}
    </div>
  );
};

// {/* GA: 총무부 (General Affairs) */}
// <Route path="/incidentEntry" element={<IncidentEntryPage />} />         {/* C1004, GA-1101 */}
// <Route path="/incidentIndiv" element={<IncidentIndivPage />} />         {/* C1002, GA-1102 */}
// <Route path="/incidentSummary" element={<IncidentSummaryPage />} />     {/* C1003, GA-1103 */}
// <Route path="/designDiscard1" element={<DesignDiscard1Page />} />       {/* C1005, GA-1104 */}
// <Route path="/discardStatus" element={<DiscardStatusPage />} />         {/* C1007, GA-1305 */}

// <Route path="/attendance" element={<AttendancePage />} />               {/* C2030, GA-1201 */}
// <Route path="/workSummary" element={<WorkSummaryPage />} />             {/* C2035, GA-1202 */}
// <Route path="/requestStatus" element={<RequestStatusPage />} />         {/* C2040, GA-1203 */}
// <Route path="/leaveRemain" element={<LeaveRemainPage />} />             {/* C2055, GA-1205 */}

// <Route path="/noticeEntry" element={<NoticeEntryPage />} />             {/* C2012, GA-1302 */}
// <Route path="/dailyReport" element={<DailyReportPage />} />             {/* C2020, GA-1303 */}
// <Route path="/dailyApproval" element={<DailyApprovalPage />} />         {/* C2021, GA-1304 */}
// <Route path="/dailyPrint" element={<DailyPrintPage />} />               {/* C2022, GA-1305 */}
// <Route path="/purchaseIssue1" element={<PurchaseIssue1Page />} />       {/* C2013, GA-1306 */}
// <Route path="/buyerChange" element={<BuyerChangePage />} />             {/* C2045, GA-1307 */}
// <Route path="/vehicleMgmt" element={<VehicleMgmtPage />} />             {/* C2060, GA-1309 */}

// {/* SA: 영업부 (Sales) */}
// <Route path="/quoteEntry" element={<QuoteEntryPage />} />               {/* Y1002, SA-2101 */}
// <Route path="/quoteStatus" element={<QuoteStatusPage />} />             {/* Y1003, SA-2102 */}

// <Route path="/noteIssuer" element={<NoteIssuerPage />} />               {/* A9801, SA-2209 */}

// <Route path="/itemEntry" element={<ItemEntryPage />} />                 {/* F1510, SA-2301 */}
// <Route path="/itemStock" element={<ItemStockPage />} />                 {/* F1514, SA-2302 */}
// <Route path="/itemSaleEntry" element={<ItemSaleEntryPage />} />         {/* F1511, SA-2303 */}
// <Route path="/itemRental" element={<ItemRentalPage />} />               {/* F1513, SA-2304 */}
// <Route path="/itemSales" element={<ItemSalesPage />} />                 {/* F1512, SA-2305 */}

// <Route path="/generalSales" element={<GeneralSalesPage />} />           {/* J3010, SA-2401 */}
// <Route path="/salesClose" element={<SalesClosePage />} />               {/* J3020, SA-2402 */}
// <Route path="/salesCloseDate" element={<SalesCloseDatePage />} />       {/* H1110, SA-2403 */}

// {/* PR: 생산관리부 (Production) */}
// <Route path="/orderEntry" element={<OrderEntryPage />} />               {/* F1001, PR-3101 */}
// <Route path="/orderLookup" element={<OrderLookupPage />} />             {/* F1003, PR-3102 */}
// <Route path="/cfCompany" element={<CfCompanyPage />} />                 {/* F1015, PR-3103 */}
// <Route path="/newSalesStatus" element={<NewSalesStatusPage />} />       {/* F1013, PR-3105 */}
// <Route path="/pendingQty" element={<PendingQtyPage />} />               {/* F1005, PR-3106 */}
// <Route path="/calendarReserve" element={<CalendarReservePage />} />     {/* F1008, PR-3107 */}
// <Route path="/cuttingCalc" element={<CuttingCalcPage />} />             {/* F1026, PR-3108 */}
// <Route path="/machineSpecs" element={<MachineSpecsPage />} />           {/* F1027, PR-3109 */}
// <Route path="/defectMgmt" element={<DefectMgmtPage />} />               {/* F1009, PR-3110 */}
// <Route path="/prodMoveLabel" element={<ProdMoveLabelPage />} />         {/* F1028, PR-3111 */}

// <Route path="/scheduleMgmt" element={<ScheduleMgmtPage />} />           {/* F1046, PR-3201 */}
// <Route path="/coverAssignStatus" element={<CoverAssignStatusPage />} /> {/* F1048, PR-3202 */}
// <Route path="/processStatus" element={<ProcessStatusPage />} />         {/* F1057, PR-3203 */}
// <Route path="/materialStatus" element={<MaterialStatusPage />} />       {/* H1010, PR-3204 */}
// <Route path="/resvMatMgmt" element={<ResvMatMgmtPage />} />             {/* H1010, PR-3205 */}
// <Route path="/posDieRequest" element={<PosDieRequestPage />} />         {/* F1160, PR-3206 */}
// <Route path="/surplusItemSet" element={<SurplusItemSetPage />} />       {/* F1029, PR-3207 */}
// <Route path="/surplusMaterial" element={<SurplusMaterialPage />} />     {/* F1058, PR-3208 */}
// <Route path="/surplusCodeEntry" element={<SurplusCodeEntryPage />} />   {/* F1032, PR-3209 */}
// <Route path="/surplusCodeLink" element={<SurplusCodeLinkPage />} />     {/* F1034, PR-3210 */}
// <Route path="/inspectionMgmt" element={<InspectionMgmtPage />} />       {/* F1059, PR-3211 */}
// <Route path="/printAuditMgmt" element={<PrintAuditMgmtPage />} />       {/* F1040, PR-3212 */}

// <Route path="/layoutEntry" element={<LayoutEntryPage />} />             {/* H2020, PR-3213 */}
// <Route path="/rubberPlateStatus" element={<RubberPlateStatusPage />} /> {/* H2030, PR-3214 */}

// <Route path="/dailyWorkLog" element={<DailyWorkLogPage />} />           {/* F1114, PR-3301 */}
// <Route path="/workCostLog" element={<WorkCostLogPage />} />             {/* F1130, PR-3302 */}
// <Route path="/workMemo" element={<WorkMemoPage />} />                   {/* F1120, PR-3303 */}
// <Route path="/inkUsage" element={<InkUsagePage />} />                   {/* F1125, PR-3304 */}
// <Route path="/workLogMgmt" element={<WorkLogMgmtPage />} />             {/* F1115, PR-3305 */}
// <Route path="/supervisorCheck" element={<SupervisorCheckPage />} />     {/* F1135, PR-3306 */}
// <Route path="/machineLog" element={<MachineLogPage />} />               {/* F1119, PR-3307 */}
// <Route path="/workAnalysis" element={<WorkAnalysisPage />} />           {/* F1116, PR-3308 */}
// <Route path="/workAnalysisPeriod" element={<WorkAnalysisPeriodPage />} />{/* F1118, PR-3309 */}
// <Route path="/manualCostOrder" element={<ManualCostOrderPage />} />     {/* F1117, PR-3310 */}
// <Route path="/dashboard" element={<DashboardPage />} />                 {/* F2012, PR-3311 */}
// <Route path="/posScreen" element={<PosScreenPage />} />                 {/* F1150, PR-3312 */}

// <Route path="/workloadView" element={<WorkloadViewPage />} />           {/* F1113, PR-3401 */}
// <Route path="/invoiceIssue" element={<InvoiceIssuePage />} />           {/* F1090, PR-3402 */}
// <Route path="/orderClose" element={<OrderClosePage />} />               {/* F1091, PR-3403 */}
// <Route path="/profitAnalysisIndiv" element={<ProfitAnalysisIndivPage />} />{/* F1301, PR-3404 */}
// <Route path="/profitAnalysisAll" element={<ProfitAnalysisAllPage />} /> {/* F1052, PR-3405 */}
// <Route path="/stdProfitIndiv" element={<StdProfitIndivPage />} />       {/* F1303, PR-3406 */}
// <Route path="/stdProfitAll" element={<StdProfitAllPage />} />           {/* F1053, PR-3407 */}
// <Route path="/salesSummary" element={<SalesSummaryPage />} />           {/* F1302, PR-3408 */}
// <Route path="/discardOverview" element={<DiscardOverviewPage />} />     {/* C1006, PR-3411 */}

// {/* MT: 자재입출고 (Material) */}
// <Route path="/orderSheetEntry" element={<OrderSheetEntryPage />} />     {/* J2002, MT-4101 */}
// <Route path="/orderStatus" element={<OrderStatusPage />} />             {/* J2003, MT-4102 */}
// <Route path="/pendingOrders" element={<PendingOrdersPage />} />         {/* J2004, MT-4103 */}

// <Route path="/receiptProcess" element={<ReceiptProcessPage />} />       {/* J1005, MT-4201 */}
// <Route path="/unconfirmedReceipt" element={<UnconfirmedReceiptPage />} / >{/* J1002, MT-4202 */}
// <Route path="/receiptStatus" element={<ReceiptStatusPage />} />         {/* J1003, MT-4203 */}
// <Route path="/creditPurchases" element={<CreditPurchasesPage />} />     {/* Y1025, MT-4204 */}
// <Route path="/oldCreditPurchases" element={<OldCreditPurchasesPage />} />{/* Y1020, MT-4205 */}
// <Route path="/purchaseCloseStatus" element={<PurchaseCloseStatusPage />} />{/* Y1021, MT-4206 */}
// <Route path="/receiptLabel" element={<ReceiptLabelPage />} />           {/* J1010, MT-4207 */}

// <Route path="/shipmentEntry" element={<ShipmentEntryPage />} />         {/* F1060, MT-4301 */}
// <Route path="/shipmentStatus" element={<ShipmentStatusPage />} />       {/* F1061, MT-4302 */}

// <Route path="/generalPurchase" element={<GeneralPurchasePage />} />     {/* J2010, MT-4401 */}
// <Route path="/purchaseClose" element={<PurchaseClosePage />} />         {/* J2020, MT-4402 */}
// <Route path="/purchaseAccounting" element={<PurchaseAccountingPage />} / >{/* J2030, MT-4403 */}
// <Route path="/purchaseCloseDate" element={<PurchaseCloseDatePage />} /> {/* H1150, MT-4404 */}

// <Route path="/paymentProcessOut" element={<PaymentProcessOutPage />} /> {/* A6540, MT-4501 */}
// <Route path="/paymentStatusOut" element={<PaymentStatusOutPage />} />   {/* A6545, MT-4502 */}

// {/* 5.1. 회계관리부 (Accounting) */}
// <Route path="/voucherMgmt" element={<VoucherMgmtPage />} />            {/* A1000, AC-5101 */}
// <Route path="/dailyCashStatus" element={<DailyCashStatusPage />} />    {/* A6520, AC-5201 */}

// {/* 6. 판매관리부 (Sales Management) */}
// <Route path="/salesMgmt" element={<SalesMgmtPage />} />                {/* J3030, CO-6201 */}

//   {/* 8. 기타관리부 (Legacy & Extensions) */}
// <Route path="/oldIncidentEntry" element={<OldIncidentEntryPage />} />  {/* C1001, OL-8101 */}
// <Route path="/manualReceipt" element={<ManualReceiptPage />} />        {/* J1006, OL-8201 */}
// <Route path="/oldReceipt2020" element={<OldReceipt2020Page />} />      {/* J1004, OL-8202 */}
// <Route path="/sensorIntegration" element={<SensorIntegrationPage />} />{/* EX-01 */}
// <Route path="/robot" element={<RobotPage />} />                        {/* EX-02 */}
