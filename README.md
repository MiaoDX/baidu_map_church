# 可视分析课程作业

## 缘由

看到了 d3 中有力导向图（Force-Directed Graph），比如说 http://jsfiddle.net/DEeNB/100/ ，想使用一下。另外，之前也没怎么调用过别人的开放 API，这一次也能使用个够 -.-

## 数据来源

[百度地图](http://lbsyun.baidu.com/index.php)

使用的 API：

1.`LocalSearch` 获取地点的经纬度坐标
2.`transit.search` 获取两个经纬度坐标点间的路程，可选的交通工具种类：TransitRoute,DrivingRoute,WalkingRoute
3.在 [geojson.io](http://geojson.io) 上可以转变一下格式为 geojson 在 d3 上展示

## 目标

找出天津市所有的“教堂”并展示其中的关系。（关系的说法确实是非常模糊，因为找好了数据之后才发现除了展示在地图上没有太多很好的使用方式，最终也是凑活着使用力导向图来展示了一下）。

## 细节

Javascript 的异步调用还是很不习惯的，特别是使用百度地图的 API 来获取数据之时充满了艰辛，最终是很好的学习了 `promise` 的用法。

1.[`LocalSearch`](http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/LocalSearch)获取数据时并不能一次获取所有目标点（教堂数目目前查询结果是 104 个），即便是使用 `setPageCapacity` 也不够（文档号称是`取值范围：1 - 100`，实际使用时发现最多只有 50 个），所以需要进行分页查询。而事实是每次发送获取数据命令均会触发 函数，这对存储数据造成了一些麻烦，最终的解决方案看起来也是比较清晰的：

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

从 html 中复制出的 csv 文件见 [data/church_copy_and_paste.csv](data/church_copy_and_paste.csv)，进一步地，由 [geojson.io](http://geojson.io) 转化得到的 `geojson` 格式文件见 [data/church_copy_and_paste_geojson_io_generate_map.geojson](data/church_copy_and_paste_geojson_io_generate_map.geojson)。

2.读取 cvs 文件

正常读取 cvs 文件是很简单的（目前是使用的 d3 中的方法），但是将数据用到其他地方便没那么直观了。最终找到的方法是返回一个 `promise` 供外部调用，仍旧给一个简单的代码片段：

``` javascript
function read_data_from_csv_with_promise(csvFileName = "../data/church_copy_and_paste.csv"){
    return new Promise(function(resolve,reject){
        var stops = [];    
        // title, address, lon,lat
        d3.csv(csvFileName, function(error, links) {
                        
            for(var i = 0; i < links.length; i ++){
                church = links[i];                            
                l = [i.toString(), church.title, church.lon, church.lat];
                stops.push(new Stop(l));                
            }

            //return stops;
            resolve( stops );
        })        
    } );
}
```

其中 `resolve( stops )` 是将结果传递出去，这样在别处便可以使用了，只要对此 `promise` 设置 `.then` 方法即可。


3.[`transit.search`](http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/TransitRoute)对路径规划的查询与上面有类似的挑战，我们把查询方法变为 `promise`，在 `searchComplete` 中将结果返回，在这里给出代码片段：

``` javascript
    var plan = results.getPlan(0);
    var duration = plan.getDuration();  //获取时间
    var distance = plan.getDistance();  //获取距离

    if(duration != "" && distance != ""){
        resolve([duration, distance]);
    }
```

前面说过每次新的查询都会调用 `searchComplete` 方法，所以上面的代码片段共会执行三次（每个赋值操作均调用了 API 一次），而三次的执行顺序是不太容易确定的，所以判断同时非空并及时返回是很有必要的。 ~~不然若没有此判断，会在调用 `var plan = results.getPlan(0);` 对应的 `searchComplete` 方法时直接返回，此时两个值均为空。~~ 很奇怪，去掉判断是可用的，虽然确实调用了三次 API。

为下面展示起见，我们只计算前 10 个教堂的路径规划（太多了展示不开，因为对每两个坐标点均进行了计算），得到的结果见 [data/calc_time_result.csv](data/calc_time_result.csv)。

## 数据展示

找到了一个不错的展示方式 [http://www.cnblogs.com/xcxcxcxc/p/5900444.html](http://www.cnblogs.com/xcxcxcxc/p/5900444.html)，算是一个小结吧，具体地，参见[d3_distance_result.html](d3_distance_result.html)。

输入数据即为上面获取的数据的整合，首先是 经纬度坐标，然后是对每两个坐标求取其行程规划，并借助 d3 的力导向图进行展示。

## More

在地图应用上有很多不错的组织与公司的，我们上面主要使用了 百度地图 来获取数据，他们的 API 还是不错的，毕竟是免费啊。上面提到的 geojson.io 也是来自于一个看起来很 Nice 的公司，因为对开发者看起来很友好：[https://www.mapbox.com/developers/](https://www.mapbox.com/developers/)。

## TODO

1. 上面的展示结果是有些牵强的，没有太多实际意义
2. `promise` 的优美使用
3. ...


## Good Luck & Have Fun!