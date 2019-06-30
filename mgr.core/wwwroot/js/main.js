//Vue实例
var app = new Vue({
    el: '#main',
    data: {
        isCollapse: false,
        currentTab: '首页',
        currentMenu: 'tabmain',
        mainTabs: [
            { id: 'tabmain', name: '首页', url: '/Home/DashBord' },
        ]
    },
    mounted() {

    },
    methods: {
        handleOpen(key, keyPath) {
            //console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            //console.log(key, keyPath);
        },
        toggleCallapse() {  //左侧菜单的展开和折叠
            this.isCollapse = !this.isCollapse;
        },
        addTab(id, tabname, url) {
            let newtab = this.mainTabs.find(t => t.id == id)
            if (newtab) {  //如果存在
                this.currentTab = newtab.name
                return
            }
            newtab = { id, name: tabname, url }
            this.mainTabs.push(newtab)
            //TODO: 去异步加载html渲染,   --没想出来怎么实现,只好用iframe实现加载
            this.currentTab = tabname
        },
        removeTab(targetName) {
            if (targetName == '首页') {   //首页不可关闭
                return;
            }
            let tabs = this.mainTabs
            let activeName = this.currentTab
            let activeMenu = this.currentMenu
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.name
                            activeMenu = nextTab.id
                        }
                    }
                });
            }

            this.currentTab = activeName
            this.currentMenu = activeMenu
            this.mainTabs = tabs.filter(tab => tab.name !== targetName)
        },
        clickTab(tab) {
            this.currentMenu = this.mainTabs[tab.index * 1].id
        },
        //退出登录
        logout: function () {
            var _this = this;
            console.log('退出登录事件')
            this.$confirm('确认退出吗?', '提示', {
                //type: 'warning'
            }).then(() => {
                axios.get('/mall/Home/LogOut?temp=' + (+new Date)).then(function (data) {
                    window.top.location.replace("login.html"); //避免点击浏览器的后退按钮时重新进入系统的问题，原理：用新页面的URL替换当前的历史纪录，这样浏览历史记录中就只有一个页面
                });
            }).catch(() => {
            });
        }
    },
    computed: {

    },
    watch: {

    }
});