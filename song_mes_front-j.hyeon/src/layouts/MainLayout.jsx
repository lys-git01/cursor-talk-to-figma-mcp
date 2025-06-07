import React from "react";
import { useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import LeftMenu from "@/layouts/LeftMenu";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "primereact/button";
import { BreadCrumb } from "primereact/breadcrumb";
import DialogContainer from "@/dialog/DialogContainer";
import { Toast } from "primereact/toast";
import useToastStore from "@/store/toastStore";
import { ConfirmDialog } from "primereact/confirmdialog";
import { menuItems } from "@/config/menuItems";

const findMenuPath = (items, targetPath, path = []) => {
  for (const item of items) {
    if (item.path === targetPath) {
      return [...path, item];
    }
    if (item.children) {
      const found = findMenuPath(item.children, targetPath, [...path, item]);
      if (found) return found;
    }
  }
  return null;
};

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(true);
  const { userInfo } = useAuthStore();

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toastRef = useRef(null);
  const setToastRef = useToastStore((s) => s.setToastRef);
  useEffect(() => {
    setToastRef(toastRef.current);
  }, [setToastRef]);

  const getBreadcrumbItems = () => {
    const menuPath = findMenuPath(menuItems, location.pathname);
    if (menuPath) {
      return menuPath.map((item) => ({
        label: item.label,
        command: () => item.path && navigate(item.path),
      }));
    }
    return [];
  };

  const home = {
    icon: "pi pi-home",
    command: () => navigate("/"),
  };

  return (
    <div className="main-layout">
      <Toast ref={toastRef} position="top-right" />
      <DialogContainer />
      <ConfirmDialog />
      <LeftMenu isOpen={menuOpen} />
      <div className={`layout-content ${menuOpen ? "open" : "closed"}`}>
        <div className="layout-header">
          <div className="layout-header__left">
            <button className="menu-toggle" onClick={toggleMenu}>
              <i className="pi pi-align-justify"></i>
            </button>
            <BreadCrumb model={getBreadcrumbItems()} home={home} />
          </div>
          <div className="user-section">
            <span className="user-name">{userInfo?.name}</span>
            <Button outlined severity="danger" size="small">
              로그아웃
            </Button>
          </div>
        </div>

        <div className="layout-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
