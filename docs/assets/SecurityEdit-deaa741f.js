import{_ as m,r as c,s as v,l as n,o as h,c as f,m as r,a as l,d as b,f as y,t as S}from"./index-05809435.js";import{F as g,N as C,_ as x}from"./sidebar-79652a8d.js";import{C as d}from"./ckeditor-c277b8db.js";const N={components:{Footer:g,Navbar:C,Sidebar:x},setup(){const e=c(`<h2>資訊安全政策</h2>
<p>智慧健康管理平台致力於保護所有使用者的資訊安全，我們採用最高標準的安全措施，確保您的資料受到完善的保護。</p>

<h3>資訊安全管理架構</h3>
<p>本平台建立完整的資訊安全管理制度：</p>
<ul>
    <li>設立資訊安全委員會</li>
    <li>定期進行資安風險評估</li>
    <li>制定資安事件應變計畫</li>
    <li>執行持續性的資安監控</li>
</ul>

<h3>系統安全防護</h3>
<p>我們採用多層次的安全防護機制：</p>
<ol>
    <li>防火牆系統
        <ul>
            <li>建置多重防火牆</li>
            <li>即時入侵偵測</li>
            <li>異常流量監控</li>
        </ul>
    </li>
    <li>加密機制
        <ul>
            <li>SSL/TLS 加密傳輸</li>
            <li>資料庫加密存儲</li>
            <li>端對端加密通訊</li>
        </ul>
    </li>
</ol>

<h3>存取控制</h3>
<p>嚴格的存取權限管理：</p>
<ul>
    <li>角色基礎存取控制（RBAC）</li>
    <li>最小權限原則</li>
    <li>定期權限稽核</li>
    <li>異常登入監控</li>
</ul>

<h3>資料備份</h3>
<p>完整的資料備份機制：</p>
<ul>
    <li>即時資料鏡像</li>
    <li>定期完整備份</li>
    <li>異地備援機制</li>
    <li>災難復原演練</li>
</ul>

<h3>安全認證與稽核</h3>
<p>本平台通過多項安全認證：</p>
<ul>
    <li>ISO 27001資訊安全認證</li>
    <li>HIPAA合規認證</li>
    <li>定期第三方資安稽核</li>
    <li>滲透測試與弱點掃描</li>
</ul>`),i=d,t=c(!1),o=async()=>{t.value=!0;try{console.log("保存內容:",e.value)}catch(s){console.error("保存失敗:",s)}finally{t.value=!1}};return v(async()=>{i.value=await d.create(document.querySelector("#editor")).catch(s=>{console.error(s)})}),{content:e,editor:i,isLoading:t,saveContent:o}}},w={class:"main-wrapper"},L={class:"page-wrapper"},B={class:"page-content"},F={class:"row"},k={class:"col-md-12 grid-margin stretch-card"},A={class:"card"},E={class:"card-body"},V={class:"mt-3"},D={class:"mb-3"},I={class:"d-flex justify-content-end"},M=["disabled"];function T(e,i,t,o,s,j){const _=n("Navbar"),p=n("Sidebar"),u=n("Footer");return h(),f("div",w,[r(_),r(p),l("div",L,[l("div",B,[l("div",F,[l("div",k,[l("div",A,[l("div",E,[i[3]||(i[3]=l("h6",{class:"card-title"},"資安政策編輯",-1)),l("div",V,[l("div",D,[i[2]||(i[2]=l("label",{class:"form-label"},"內容",-1)),b(l("textarea",{id:"editor","onUpdate:modelValue":i[0]||(i[0]=a=>o.content=a)},null,512),[[y,o.content]])]),l("div",I,[l("button",{class:"btn btn-primary",onClick:i[1]||(i[1]=(...a)=>o.saveContent&&o.saveContent(...a)),disabled:o.isLoading},S(o.isLoading?"儲存中...":"儲存"),9,M)])])])])])])]),r(u)])])}const P=m(N,[["render",T]]);export{P as default};
