// LeftMenu.jsx
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { menuItems } from "@/config/menuItems";

// API placeholder: implement real backend integration
const saveBookmarkToBackend = async (path) => {
  console.log(`Saving bookmark for ${path} to backend`);
};
const removeBookmarkFromBackend = async (path) => {
  console.log(`Removing bookmark for ${path} from backend`);
};

// Helper: flatten leaf items to map path -> label
const flattenMenu = (items, map = {}) => {
  items.forEach((item) => {
    if (item.path) map[item.path] = item.label;
    if (item.children) flattenMenu(item.children, map);
  });
  return map;
};
const pathLabelMap = flattenMenu(menuItems);

const LeftMenu = ({ isOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useAuthStore();
  const [openKeys, setOpenKeys] = useState([]);
  const [bookmarks, setBookmarks] = useState(["/creditEntry", "/userEntry"]); // 임시 데이터
  const [isAllMenu, setIsAllMenu] = useState(true);

  if (!userInfo) return null;

  const handleClick = (item, key, level) => {
    if (item.path) {
      navigate(item.path);
      // setOpenKeys([]);
      return;
    }
    setOpenKeys((prev) =>
      prev[level] === key ? prev.slice(0, level) : [...prev.slice(0, level), key],
    );
  };

  const toggleBookmark = async (path) => {
    if (bookmarks.includes(path)) {
      await removeBookmarkFromBackend(path);
      setBookmarks((prev) => prev.filter((p) => p !== path));
    } else {
      await saveBookmarkToBackend(path);
      setBookmarks((prev) => [...prev, path]);
    }
  };

  const renderMenu = (items, level = 0, parentKey = "") => (
    <ul className={`menu-level menu-level-${level}`}>
      {items.map((item) => {
        const key = parentKey ? `${parentKey}-${item.label}` : item.label;
        const isOpen = openKeys[level] === key;
        const hasChildren = Array.isArray(item.children);
        const isLeaf = !hasChildren && !!item.path;

        return (
          <li key={key} className={isLeaf ? "leaf-item" : ""}>
            <div
              className={`menu-item level-${level} ${
                hasChildren ? "has-children" : ""
              } ${isOpen ? "open" : ""} ${item.path === location.pathname ? "active" : ""}`}
              onClick={() => handleClick(item, key, level)}
            >
              {item.label}
              {isLeaf && (
                <button
                  className={`star-btn ${bookmarks.includes(item.path) ? "bookmarked" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(item.path);
                  }}
                >
                  <i className="pi pi-star-fill"></i>
                </button>
              )}
              {hasChildren && <i className="pi pi-chevron-right pointer"></i>}
            </div>
            {hasChildren && isOpen && renderMenu(item.children, level + 1, key)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className={`left-menu ${isOpen ? "open" : "closed"}`}>
      <div className="left-menu__header">
        <div>
          <h2>Smart Factory</h2>
          {isAllMenu ? <p>메뉴전체</p> : <p>즐겨찾기</p>}
        </div>
        <button
          onClick={() => setIsAllMenu(!isAllMenu)}
          className={`bookmark-btn ${isAllMenu && "isAllMenu"}`}
        >
          <i className="pi pi-bookmark-fill"></i>
        </button>
      </div>
      <nav className="left-menu__nav">
        {isAllMenu ? (
          renderMenu(menuItems)
        ) : (
          <div>
            {bookmarks.length ? (
              <ul className="menu-level">
                {bookmarks.map((path) => (
                  <li key={path} onClick={() => navigate(path)} className="leaf-item">
                    <div className="menu-item">
                      {pathLabelMap[path] || path}
                      <button
                        className={`star-btn ${bookmarks.includes(path) ? "bookmarked" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(path);
                        }}
                      >
                        <i className="pi pi-star-fill"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty">북마크된 페이지가 없습니다.</p>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default LeftMenu;
