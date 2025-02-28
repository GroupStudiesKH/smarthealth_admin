import{F as m,N as v,_ as h}from"./sidebar-79652a8d.js";import{C as u}from"./ckeditor-c277b8db.js";import{_ as f,r as i,s as b,l as n,o as g,c as y,m as r,a as o,t as C}from"./index-05809435.js";const N={components:{Footer:m,Navbar:v,Sidebar:h},setup(){const e=i(`<h2>隱私權政策</h2>
<p>智慧健康管理平台（以下簡稱「本平台」）非常重視您的隱私權保護，為了讓您能夠安心的使用本平台的各項服務，特此向您說明本平台的隱私權保護政策。</p>

<h3>個人資料蒐集</h3>
<p>當您使用本平台服務時，我們可能會收集以下個人資料：</p>
<ul>
    <li>基本資料：姓名、出生年月日、性別、聯絡方式等</li>
    <li>健康資料：身高、體重、血壓、血糖等健康指標</li>
    <li>醫療紀錄：就醫紀錄、用藥紀錄、過敏史等</li>
    <li>使用紀錄：登入時間、使用功能、瀏覽紀錄等</li>
</ul>

<h3>個人資料使用目的</h3>
<p>您的個人資料將用於：</p>
<ol>
    <li>提供個人化健康管理服務</li>
    <li>健康風險評估與預警</li>
    <li>醫療諮詢服務</li>
    <li>系統功能優化與改善</li>
    <li>統計分析（去識別化後）</li>
</ol>

<h3>資料保護措施</h3>
<p>為保護您的個人資料，本平台採取以下措施：</p>
<ul>
    <li>資料加密儲存與傳輸</li>
    <li>存取權限控管</li>
    <li>定期資安稽核</li>
    <li>人員保密訓練</li>
</ul>

<h3>資料保存期限</h3>
<p>除法律另有規定外，您的個人資料將於會員服務終止後保存5年。期限屆滿後，本平台將主動刪除或匿名化處理相關資料。</p>

<h3>您的權利</h3>
<p>依據個人資料保護法，您就您的個人資料享有以下權利：</p>
<ul>
    <li>查詢或請求閱覽</li>
    <li>請求製給複製本</li>
    <li>請求補充或更正</li>
    <li>請求停止蒐集、處理或利用</li>
    <li>請求刪除</li>
</ul>`),s=i(null),a=i(!1),l=async()=>{a.value=!0;try{console.log("保存內容:",e.value)}catch(t){console.error("保存失敗:",t)}finally{a.value=!1}};return b(async()=>{try{s.value=await u.create(document.querySelector("#editor")).then(t=>(t.setData(e.value),t.model.document.on("change:data",()=>{e.value=t.getData()}),t))}catch(t){console.error("編輯器初始化失敗:",t)}}),{content:e,editor:s,isLoading:a,saveContent:l}}},x={class:"main-wrapper"},S={class:"page-wrapper"},w={class:"page-content"},F={class:"row"},k={class:"col-md-12 grid-margin stretch-card"},B={class:"card"},D={class:"card-body"},E={class:"mt-3"},L={class:"d-flex justify-content-end"},V=["disabled"];function j(e,s,a,l,t,q){const c=n("Navbar"),d=n("Sidebar"),p=n("Footer");return g(),y("div",x,[r(c),r(d),o("div",S,[o("div",w,[o("div",F,[o("div",k,[o("div",B,[o("div",D,[s[2]||(s[2]=o("h6",{class:"card-title"},"隱私權政策編輯",-1)),o("div",E,[s[1]||(s[1]=o("div",{class:"mb-3"},[o("label",{class:"form-label"},"內容"),o("textarea",{id:"editor"})],-1)),o("div",L,[o("button",{class:"btn btn-primary",onClick:s[0]||(s[0]=(..._)=>l.saveContent&&l.saveContent(..._)),disabled:l.isLoading},C(l.isLoading?"儲存中...":"儲存"),9,V)])])])])])])]),r(p)])])}const z=f(N,[["render",j]]);export{z as default};
