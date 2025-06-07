// pages/StyleGuide.tsx
import { Toast } from "primereact/toast";
import { TabPanel, TabView } from "primereact/tabview";
import StyleGuideTab1 from "@/pages/99-StyleGuide/StyleGuideTab1";
import StyleGuideTab2 from "@/pages/99-StyleGuide/StyleGuideTab2";
import StyleGuideTab3 from "@/pages/99-StyleGuide/StyleGuideTab3";
const StyleGuide = () => {
  return (
    <div className="style-guide">
      <Toast />
      <TabView>
        <TabPanel header="기본사항">
          <StyleGuideTab1 />
        </TabPanel>
        <TabPanel header="컴포넌트">
          <StyleGuideTab2 />
        </TabPanel>
        <TabPanel header="데이터 테이블">
          <StyleGuideTab3 />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default StyleGuide;
