var vm = new Vue();
Vue.component('f-table', {
    template: `
        <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column v-for="item in columns" :key="item.text" :prop="item.prop" :label="item.name"> </el-table-column>
            <el-table-column v-if="opt" label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" v-if="edit" v-on:click="tableHandleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="mini" v-if="del" type="danger" v-on:click="tableHandleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>`,
    data: function () {
        return {
            tableData: [],
            columns: [],
            opt: false,
            edit: false,
            del: false,
            url: ""
        }
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2 == 0) {
                return 'success-row';
            } else {
                return 'warning-row';
            }
            return '';
        },
        tableHandleEdit(index, row) {
            vm.$emit('openDialog', "编辑", "Edit", row)
        },
        tableHandleDelete(index, row) { },
        tableHandleSubmit() {}
    },
    created: function () {
        var tableParam = initTable();
        this.columns = tableParam.columns;
        if (this.$attrs.opt != undefined)
            this.opt = this.$attrs.opt;
        if (this.$attrs.edit != undefined)
            this.edit = this.$attrs.edit;
        if (this.$attrs.del != undefined)
            this.del = this.$attrs.del;
        if (this.$attrs.url != undefined)
            this.url = this.$attrs.url;
        this.tableHandleDelete = tableParam.tableHandleDelete;
        this.tableHandleSubmit = tableParam.tableHandleSubmit;
        var that = this;
        axios.post(this.url)
            .then(function (response) {
                if (!response || !response.data)
                    return;
                that.tableData = response.data.Data;
            })
            .catch(function (error) {
                console.log(error);
            });
        vm.$on('tableHandleSubmit', (type,data) => {
            this.tableHandleSubmit(type,data);
        });
    }
});

Vue.component('f-dialog', {
    template: `
        <el-dialog :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <slot></slot>
            <span slot="footer" class="dialog-footer">
                <el-button v-on:click="dialogHandleClose">取 消</el-button>
                <el-button type="primary" v-on:click="dialogHandleSubmit">确 定</el-button>
            </span>
        </el-dialog>`,
    data: function () {
        return {
            title: "",
            dialogVisible: false,
            dialogData: {},
            dialogType: ""
        }
    },
    methods: {
        dialogHandleSubmit() {
            vm.$emit('tableHandleSubmit', this.dialogType,this.dialogData);
        },
        dialogHandleClose() {
            this.dialogVisible = false;
            this.title = "";
            this.dialogType = "";
            this.dialogData = {};
        }
    },
    created: function () {
        vm.$on('openDialog', (title, type, row) => {
            this.dialogVisible = true;
            this.title = title;
            this.dialogType = type;
            this.dialogData = row;
        })
    }
});

Vue.component('f-addbtn', {
    template: `<el-button type="primary" v-on:click="tableHandleAdd">新增</el-button>`,
    data: function () {
        return {
        }
    },
    methods: {
        tableHandleAdd() {
            vm.$emit('openDialog', "新增", "Add")
        }
    },
    created: function () {
    }
});