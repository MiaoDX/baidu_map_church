// Query baidu map http://developer.baidu.com/map/jsdemo.htm#i1_4
// Localsearch

// Ref:
// http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/LocalSearch
// http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/LocalSearchOptions
// http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/LocalResult

// Get all results: http://blog.csdn.net/nocky/article/details/8172203

function get_church(){
	// 百度地图API功能
	var map = new BMap.Map("l-map");        
	map.centerAndZoom("天津");
    document.getElementById("r-result").innerHTML += "title,address,lon,lat" + "<br>";  //set header of csv
	var options = {
        
		onSearchComplete: function(results){
            var s = [];
			// 判断状态是否正确
			if (local.getStatus() == BMAP_STATUS_SUCCESS){
				
                                                                  	
                //s.push("now page:",results.getPageIndex());
                for (var i = 0; i < results.getCurrentNumPois(); i ++){
// {"title":"法国教堂","uid":"6bcc439e93b8139eb6f42fd2","point":{"lng":117.200765,"lat":39.12413},"url":"http://map.baidu.com/?s=inf%26uid%3D6bcc439e93b8139eb6f42fd2%26c%3D332&i=0&sr=1","detailUrl":"http://api.map.baidu.com/place/detail?uid=6bcc439e93b8139eb6f42fd2&output=html&source=jsapi","address":"和平区西宁道9号(近国际商场)","city":"天津市","province":"天津市","phoneNumber":"(022)27811929","type":0,"isAccurate":false,"tags":["旅游景点"]}
                    var poi = results.getPoi(i);
                    s.push(poi.title + "," + poi.address + "," + poi.point.lng + "," + poi.point.lat);
                    //s.push(JSON.stringify(results.getPoi(i)));
                }

  	             // http://blog.csdn.net/nocky/article/details/8172203
                 // 判断是否到最后一页，如果是则不再搜索
                if (results.getPageIndex() < results.getNumPages() - 1){
                    local.gotoPage(results.getPageIndex() + 1);
                    s.push(""); //to avoid same line has two church info
                }
                    				
				document.getElementById("r-result").innerHTML += s.join("<br/>");                                
			}
		}
	};
    
    
	var local = new BMap.LocalSearch(map);    
	local.search("教堂");
    
    local.setSearchCompleteCallback(options.onSearchComplete);
}
