const $siteList = $(".siteList");
const $lastLi = $siteList.find("li.last");
const x = localStorage.getItem("x"); //没有则null
const xObject = JSON.parse(x); //如果没有则null
const hashMap = xObject || [
  { logo: "A", url: "https://www.acfun.cn" },
  { logo: "B", url: "https://www.bilibili.com" },
];

const simplifyUrl = (url) => {
  return url.replace("https://", "").replace("http://", "").replace("www.", "");
};

//重写所有站点(除了添加框)
const render = () => {
  $siteList.find("li:not(.last)").remove(); //除了最后一个都移除
  //对网页按logo进行排序
  hashMap.sort((a, b) => {
    if (a.logo > b.logo) {
      return 1;
    } else if (a.logo < b.logo) {
      return -1;
    } else {
      return 0;
    }
  });
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
    //事件监听
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
  let url = window.prompt("请输入你要添加的网址"); //弹窗并获得用户输入内容
  while (url === "") {
    //输入不为空才添加
    url = window.prompt("不能为空哦，请再次输入"); //点击“取消”返回的是null
  }
  if (url !== null) {
    if (url.indexOf("http") != 0) {
      url = "https://" + url;
    }
    let logo = simplifyUrl(url)[0].toUpperCase();
    let flag = true; //是否push的标志位
    for (let i = 0; i < hashMap.length; i++) {
      if (
        hashMap[i].logo === logo &&
        simplifyUrl(hashMap[i].url).toLowerCase() ===
          simplifyUrl(url).toLowerCase()
      ) {
        flag = false;
      }
    }
    if (flag) {
      hashMap.push({
        logo: logo,
        url: url,
      });
      render();
    }
  }
});

// 即将关闭数据保存;
window.onbeforeunload = () => {
  const string = JSON.stringify(hashMap); //对象变字符串，localStorage只能存字符串
  window.localStorage.setItem("x", string);
};

$(document).on("keypress", (e) => {
  const key = e.key;
  for (let i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) {
      window.open(hashMap[i].url);
    }
  }
});
