import{F as m,N as v,_ as u}from"./sidebar-79652a8d.js";import{C as h}from"./ckeditor-c277b8db.js";import{_ as b,r as n,s as f,l as i,o as g,c as y,m as r,a as o,t as C}from"./index-05809435.js";const N={components:{Footer:m,Navbar:v,Sidebar:u},setup(){const a=n(`<h2>智慧健康管理平台計劃緣起</h2>
<p>隨著科技的快速發展和人口高齡化的趨勢，智慧健康管理已成為現代醫療照護體系中不可或缺的一環。本計劃旨在建立一個整合性的智慧健康管理平台，結合最新的資訊科技與醫療專業知識，為使用者提供全方位的健康管理服務。</p>

<h3>計劃目標</h3>
<ul>
    <li>建立個人化健康管理系統</li>
    <li>提供即時健康數據分析</li>
    <li>促進醫療資源有效利用</li>
    <li>提升整體醫療照護品質</li>
</ul>

<h3>預期效益</h3>
<p>透過本平台的建置，我們期望能：</p>
<ol>
    <li>提升民眾自主健康管理意識</li>
    <li>降低醫療資源使用成本</li>
    <li>建立完整的健康管理生態系統</li>
    <li>促進產業創新與發展</li>
</ol>

<h3>實施策略</h3>
<p>本計劃將分階段實施，包含：</p>
<ul>
    <li>第一階段：基礎平台建置</li>
    <li>第二階段：功能擴充與優化</li>
    <li>第三階段：生態系統整合</li>
    <li>第四階段：永續營運規劃</li>
</ul>`),t=n(null),l=n(!1),e=async()=>{l.value=!0;try{console.log("保存內容:",a.value)}catch(s){console.error("保存失敗:",s)}finally{l.value=!1}};return f(async()=>{try{t.value=await h.create(document.querySelector("#editor")).then(s=>(s.setData(a.value),s.model.document.on("change:data",()=>{a.value=s.getData()}),s))}catch(s){console.error("編輯器初始化失敗:",s)}}),{content:a,editor:t,isLoading:l,saveContent:e}}},x={class:"main-wrapper"},S={class:"page-wrapper"},w={class:"page-content"},F={class:"row"},k={class:"col-md-12 grid-margin stretch-card"},B={class:"card"},D={class:"card-body"},E={class:"mt-3"},L={class:"d-flex justify-content-end"},V=["disabled"];function j(a,t,l,e,s,q){const c=i("Navbar"),d=i("Sidebar"),_=i("Footer");return g(),y("div",x,[r(c),r(d),o("div",S,[o("div",w,[o("div",F,[o("div",k,[o("div",B,[o("div",D,[t[2]||(t[2]=o("h6",{class:"card-title"},"計劃緣起編輯",-1)),o("div",E,[t[1]||(t[1]=o("div",{class:"mb-3"},[o("label",{class:"form-label"},"內容"),o("textarea",{id:"editor"})],-1)),o("div",L,[o("button",{class:"btn btn-primary",onClick:t[0]||(t[0]=(...p)=>e.saveContent&&e.saveContent(...p)),disabled:e.isLoading},C(e.isLoading?"儲存中...":"儲存"),9,V)])])])])])])]),r(_)])])}const z=b(N,[["render",j]]);export{z as default};
