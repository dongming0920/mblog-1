layui.use(['form', 'layer','table'], function () {
    var form = layui.form,
        layer = parent.layer === undefined ? layui.layer : top.layer,
        $ = layui.jquery,
        table = layui.table;

//新闻列表
    var category = document.getElementById('ca').value;
    var tableIns = table.render({
        elem: '#blogList',
        url: category === ' ' ? '/admin/getBlog' : '/admin/getBlog?category=' + category,
        cellMinWidth: 95,
        //page: true,
        height: 'full-125',
        //limit: 10,
        //limits: [10, 15, 20, 25],
        id: "blogListTable",
        cols: [[
           /* {type: "checkbox", fixed: "left",width:'3%'},*/
            {type: 'numbers',width :'4%',title: '序号'},
            {field: 'articleId', title: 'ID',  align: "center",width:'14%'},
            {field: 'articleTitle', title: '文章标题', align:"center",width:'33%'},
            {field: 'author', title: '作者', align: 'center',width:'11%'},
            {field: 'publishTime', title: '发布时间', align:'center',width:'14%', templet:function(d){
                    return d.publishTime.replace("T", " ");
                }},
            {
                field: 'status',title: '是否展示',align: 'center',width:'10%', templet: function (d) {
                    var s = d.status === 1 ? "checked" : "";
                    return '<input type="checkbox" id = ' + d.articleId + ' name="show" lay-filter="show" lay-skin="switch" lay-text="是|否" ' + s + '>'
                }
            },

            {title: '操作',  templet: '#blogListBar', fixed: "right", align: "center",width:'15%'}
        ]]
    });

    //是否展示
    form.on('switch(show)', function (obj) {
        var index = layer.msg('修改中，请稍候', {icon: 16, time: false, shade: 0.8});
        var id = obj.elem.id
        setTimeout(function () {
            layer.close(index);
            if (obj.elem.checked) {
                $.get("/admin/showBlog",{
                    articleId : id  //将需要删除的newsId作为参数传入
                },function(data){
                    if (data === "success"){
                        layer.msg("展示成功")
                    }
                })
            } else {
                $.get("/admin/hideBlog",{
                    articleId : id  //将需要删除的newsId作为参数传入
                },function(data){
                    if (data === "success"){
                        layer.msg("取消展示成功")
                    }
                })
            }
        }, 500);
    })

    form.on('select(chooseCategory)', function(data){
        if(data.value === ''){
            window.location.href = "/admin/blogList";
        }else
            window.location.href = "/admin/blogList?category=" + data.value;

    })

    //搜索【此功能需要后台配合，所以暂时没有动态效果演示】
    $(".search_btn").on("click", function () {
        if ($(".searchVal").val() != '') {
            table.reload("newsListTable", {
                page: {
                    curr: 1 //重新从第 1 页开始
                },
                where: {
                    key: $(".searchVal").val()  //搜索的关键字
                }
            })
        } else {
            layer.msg("请输入搜索的内容");
        }
    });


    $(".addNews_btn").click(function(){
        parent.addTab($(this));
    })

    //批量删除
    /*$(".delAll_btn").click(function () {
        var checkStatus = table.checkStatus('newsListTable'),
            data = checkStatus.data,
            newsId = [];
        if (data.length > 0) {
            for (var i in data) {
                newsId.push(data[i].newsId);
            }
            layer.confirm('确定删除选中的文章？', {icon: 3, title: '提示信息'}, function (index) {
                // $.get("删除文章接口",{
                //     newsId : newsId  //将需要删除的newsId作为参数传入
                // },function(data){
                tableIns.reload();
                layer.close(index);
                // })
            })
        } else {
            layer.msg("请选择需要删除的文章");
        }
    })
*/
    //列表操作
    table.on('tool(blogList)', function (obj) {
        var layEvent = obj.event,
            data = obj.data;
        if (layEvent === 'edit') { //编辑
            addNews(data);
        } else if (layEvent === 'del') { //删除
            layer.confirm('确定删除此文章？', {icon: 3, title: '提示信息'}, function (index) {
                $.get("/admin/deleteBlog",{
                     articleId : data.articleId  //将需要删除的newsId作为参数传入
                },function(data){
                    if(data === "success"){
                        tableIns.reload();
                        layer.close(index);
                    }
                 })
            });
        } else if (layEvent === 'look') { //预览
            var t = window.location.href.split("admin/")[0]
            layer.open({
                type: 2,
                title: '预览',
                shade: false,
                area: ['500px','600px'],
                maxmin: false,
                content: t + 'blog/' + data.articleId,
                zIndex: layer.zIndex, //重点1
                success: function(layero){
                    layer.setTop(layero); //重点2
                }
            });
        }
    });




});


