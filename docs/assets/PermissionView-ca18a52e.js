import{_ as S,p as w,r as v,q as x,i as g,j as l,o as t,c as s,k as d,b as e,y as C,F as _,f as u,l as f,t as F}from"./index-08106b89.js";import{F as D,N as V,_ as B,a as T}from"./sidebar-83774af4.js";const $={components:{Footer:D,Navbar:V,Sidebar:B},setup(){w();const p=v([]),a=v(0),y=()=>{i()},r=()=>{Object.keys(searchForm).forEach(n=>{searchForm[n]=""}),i()},k=x([{key:"id",label:"編號"},{key:"name",label:"名稱"},{key:"actions",label:"操作"}]),i=async(n=1,b=10,m="")=>{try{const o=await T.getPermissions({page:n,pageSize:b,search:m});p.value=o.data,a.value=o.recordsTotal}catch(o){console.error("Failed to fetch permission data:",o)}};return g(()=>{i()}),{tableData:p,tableColumns:k,handleSearch:y,resetSearch:r}}},j={class:"main-wrapper"},E={class:"page-wrapper"},P={class:"page-content"},R={class:"row mb-3"},q={class:"col-12 text-end"},L={class:"row"},M={class:"col-12 stretch-card"},O={class:"card"},z={class:"card-body"},A={class:"table-responsive"},G={class:"table"},H=["href"];function I(p,a,y,r,k,i){const n=l("Sidebar"),b=l("Navbar"),m=l("router-link"),o=l("Footer");return t(),s("div",j,[d(n),e("div",E,[d(b),e("div",P,[e("div",R,[e("div",q,[d(m,{to:"/permission/add",class:"btn btn-primary"},{default:C(()=>a[0]||(a[0]=[f("新增權限")])),_:1})])]),e("div",L,[e("div",M,[e("div",O,[e("div",z,[a[2]||(a[2]=e("h6",{class:"card-title"},"權限列表",-1)),e("div",A,[e("table",G,[e("thead",null,[e("tr",null,[(t(!0),s(_,null,u(r.tableColumns,c=>(t(),s("th",{key:c.key},F(c.label),1))),128))])]),e("tbody",null,[(t(!0),s(_,null,u(r.tableData,(c,N)=>(t(),s("tr",{key:N},[(t(!0),s(_,null,u(r.tableColumns,h=>(t(),s("td",{key:h.key},[h.key==="actions"?(t(),s("a",{key:0,href:`/permission/edit/${c.id}`,class:"btn btn-link p-0"},a[1]||(a[1]=[e("i",{class:"material-icons"},"edit",-1)]),8,H)):(t(),s(_,{key:1},[f(F(c[h.key]),1)],64))]))),128))]))),128))])])])])])])])]),d(o)])])}const Q=S($,[["render",I]]);export{Q as default};
