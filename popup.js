/*retrieve the tabs from the url's. Host permissions 
correspond to the url's below*/
//the following code should group all tabs regardless of url
//especially important for displaying all url's
//to ensure the user knows what exactly is open (Baddely 2007; Kofler et al. 2011 p. 1) 

const AllOpenTabs = await chrome.tabs.query({});
/* The above links will be group into box at
the side. This includes all articles within the sites */

  const collator = new Intl.Collator();
AllOpenTabs.sort((a, b) => collator.compare(a.title, b.title));

const template = document.getElementById("li_template");
const elements = new Set();
for (const tab of AllOpenTabs) {
  const element = template.content.firstElementChild.cloneNode(true);

  const title = tab.title.split("-")[0].trim();
  const pathname = new URL(tab.url).pathname.slice("/docs".length);

  element.querySelector(".title").textContent = title;
  element.querySelector(".pathname").textContent = pathname;
  element.querySelector("a").addEventListener("click", async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}
document.querySelector("ul").append(...elements);

//This function takes an array of tabs as an argument 
//and groups them into a new tab group with the title "TAB BOX".
const groupTabsIntoNewGroup = async (tabs) => {
  const tabIds = tabs.map(({ id }) => id);
  const group = await chrome.tabs.group({ tabIds });
  await chrome.tabGroups.update(group, { title: "TAB BOX" });
};

//call in chrome.tabs.query({}) inside the button click event listener 
//which makes sure that we retrieve the most up-to-date list of tabs
// when the button is clicked. This ensures that the user
// is presented with an accurate list of tabs to group.
const button = document.querySelector("button");
button.addEventListener("click", async () => {
  const tabs = await chrome.tabs.query({});
  await groupTabsIntoNewGroup(tabs);
});


/*Adapted from - GOOGLE, 2022. Manage Tabs. 
[online]. Available at: 
https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-tabs-manager/ 
[Accessed: 03 March 2023].*/