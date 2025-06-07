import useToastStore from "@/store/toastStore";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState, useEffect } from "react";
import { menuItems as menuItemsConfig } from "@/config/menuItems";

const UpdateRemark7101 = ({ onCloseFn, remarkList, selectedMenu }) => {
  const showToast = useToastStore.getState().showToast;
  const [menuOptions, setMenuOptions] = useState([]);
  const [form, setForm] = useState({
    selectMenu: null,
    remark: "",
  });

  useEffect(() => {
    // 최하위 메뉴 아이템만 추출하는 함수
    const extractLeafMenus = (items) => {
      const result = [];

      const traverse = (menuItems, parentPath = "") => {
        menuItems.forEach((item) => {
          if (item.children) {
            traverse(item.children, `${parentPath}${item.label}`);
          } else {
            result.push({
              label: item.label,
              value: item.path.substring(1), // Remove leading slash
              path: item.path,
            });
          }
        });
      };

      traverse(items);
      return result;
    };

    const options = extractLeafMenus(menuItemsConfig);
    setMenuOptions(options);

    // 초기 선택된 메뉴 설정
    if (selectedMenu?.path) {
      setForm({
        selectMenu: selectedMenu.path,
        remark: selectedMenu.remark || "",
      });
    }
  }, [selectedMenu]);

  // Dropdown 선택 변경 시 해당하는 remark 설정
  const handleMenuChange = (e) => {
    const selectedPath = e.value;
    const selectedRemark = remarkList.find((item) => item.path === selectedPath)?.remark || "";

    setForm({
      selectMenu: selectedPath,
      remark: selectedRemark,
    });
  };

  const updateMeno = () => {
    showToast({
      severity: "info",
      summary: "메모 수정",
      detail: "메모 수정",
    });
    onCloseFn();
  };

  return (
    <Dialog
      header="메뉴 비고수정"
      visible
      tyle={{ width: "50vw" }}
      onHide={onCloseFn}
      style={{ maxWidth: "1000px" }}
    >
      <div className="Dialog-container form-list">
        <div className="form__input">
          <p>메뉴선택</p>
          <Dropdown
            value={form.selectMenu}
            onChange={handleMenuChange}
            options={menuOptions}
            optionLabel="label"
            optionValue="value"
            placeholder="메뉴를 선택하세요"
          />
        </div>
        <div className="form__input">
          <p>비고</p>
          <InputTextarea
            autoResize
            value={form.remark}
            onChange={(e) => setForm({ ...form, remark: e.target.value })}
            rows={1}
            cols={30}
            style={{ minWidth: "600px" }}
            placeholder="비고를 입력하세요."
          />
        </div>
      </div>
      <div className="Dialog__btns">
        <Button label="취소" severity="secondary" onClick={onCloseFn}></Button>
        <Button label="수정" onClick={updateMeno}></Button>
      </div>
    </Dialog>
  );
};

export default UpdateRemark7101;
