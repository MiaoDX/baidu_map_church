# 可视分析课程作业

## 缘由

看到了 d3 中有力导向图（Force-Directed Graph），比如说 http://jsfiddle.net/DEeNB/100/ ，想使用一下。另外，之前也没怎么调用过别人的开放 API，这一次也能使用个够 -.-

## 数据来源

[百度地图](http://lbsyun.baidu.com/index.php)

使用的 API：

1. `LocalSearch` 获取地点的经纬度坐标
2. `transit.search` 获取两个经纬度坐标点间的路程，可选的交通工具种类：TransitRoute,DrivingRoute,WalkingRoute
3. 在 [geojson.io](http://geojson.io) 上可以转变一下格式为 geojson 在 d3 上展示

## 目标

找出天津市所有的“教堂”并展示其中的关系。（关系的说法确实是非常模糊，因为找好了数据之后才发现除了展示在地图上没有太多很好的使用方式，最终也是凑活着使用力导向图来展示了一下）。

## 细节

Javascript 的异步调用还是很不习惯的，特别是使用百度地图的 API 来获取数据之时充满了艰辛，最终是很好的学习了 `promise` 的用法。

1. `[LocalSearch](http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/LocalSearch)` 获取数据时并不能一次获取所有目标点（教堂数目目前查询结果是 104 个），即便是使用 `setPageCapacity` 也不够（文档号称是`取值范围：1 - 100`，实际使用时发现最多只有 50 个），所以需要进行分页查询。而事实是每次发送获取数据命令均会触发 函数，这对存储数据造成了一些麻烦，最终的解决方案看起来也是比较清晰的：

``` javascript
     // http://blog.csdn.net/nocky/article/details/8172203
     // 判断是否到最后一页，如果是则不再搜索
    if (results.getPageIndex() < results.getNumPages() - 1){
        local.gotoPage(results.getPageIndex() + 1);
        s.push(""); //to avoid same line has two church info
    }
```

也就是添加到达到最后一页与否的判断。

**因为没有找到很有效的在浏览器内写本地文件的方法所以是将结果输出到 html 页面上，下面也都是用的这种方式，比较 ugly，有待改善**

2. 读取 cvs 文件

正常读取 cvs 文件是很简单的（目前是使用的 d3 中的方法），但是将数据用到其他地方便没那么直观了。


2. `[transit.search](http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/TransitRoute)` 对路径规划的查询与上面有类似的挑战

## 数据展示

找到了一个不错的展示方式 [http://www.cnblogs.com/xcxcxcxc/p/5900444.html](http://www.cnblogs.com/xcxcxcxc/p/5900444.html)，算是一个小结吧，具体地，参见[d3_distance_result.html](d3_distance_result.html)。

## More

在地图应用上有很多不错的组织与公司的，我们上面主要使用了 百度地图 来获取数据，他们的 API 还是不错的，毕竟是免费啊。上面提到的 geojson.io 也是来自于一个看起来很 Nice 的公司，因为对开发者看起来很友好：[https://www.mapbox.com/developers/](https://www.mapbox.com/developers/)。