function initTable() {
    var tableParam = {
        columns: [{
            name: "序号",
            prop: "Tid"
        }, {
            name: "名称",
            prop: "name"
        }, {
            name: "父ID",
            prop: "ParentTid"
        }, {
            name: "资源路径",
            prop: "Url"
        }, {
            name: "排序",
            prop: "OrderRule"
        }],
        tableHandleDelete: function (index, row) {
            console.log("删除")
        },
        tableHandleSubmit: function (type, data) {
            if (type == "Add") {
                console.log("add")
            } else {
                console.log("edit")
            }
        }
    }
    return tableParam;
}