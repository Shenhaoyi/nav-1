const $siteList = $(".siteList");
const $lastLi = $siteList.find("li.last");
const x = localStorage.getItem("x");
const xObject = JSON.parse(x);
const hashMap = xObject || [
  { logo: "A", url: "https://www.acfun.cn" },
  { logo: "B", url: "https://www.bilibili.com" },
];

const simplifyUrl = (url) => {
  return url.replace("https://", "").replace("http://").replace("www.", "");
};

//重写所有站点
const render = () => {
  $siteList.find("li:not(.last)").remove(); //不要最后一个
  hashMap.forEach((node, index) => {
    const $li = $(
      `<li>          
        <div class="site">
            <div class="logo">${node.logo}</div>
            <div class="link">${simplifyUrl(node.url)}</div>
            <div class="close">
              <svg class="icon">
                  <use xlink:href="#icon-close"></use>
              </svg>
            </div>
        </div>
      </li>`
    ).insertBefore($lastLi);
    $li.on("click", (e) => {
      window.open(node.url);
    });
    $li.on("click", ".close", (e) => {
      e.stopPropagation(); //阻止冒泡
      hashMap.splice(index, 1);
      render();
    });
  });
};
render();

//点击添加站点
$(".addButton").on("click", () => {
  let url = window.prompt("请问你要添加网址是啥"); //弹窗并获得用户输入内容
  if (url.indexOf("http") != 0) {
    url = "https://" + url;
  }
  console.log(url);
  hashMap.push({
    logo: simplifyUrl(url)[0], //.toUpperCase(),
    logoType: "text",
    url: url,
  });
  render();
});

//即将关闭数据保存
// window.onbeforeunload = () => {
//   const string = JSON.stringify(hashMap); //对象变字符串，localStorage只能存字符串
//   window.localStorage.setItem("x", string);
// };

$(document).on("keypress", (e) => {
  const key = e.key;
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});
