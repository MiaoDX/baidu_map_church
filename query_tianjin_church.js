// Query baidu map http://developer.baidu.com/map/jsdemo.htm#i1_4
// Localsearch

// Ref:
// http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/LocalSearch
// http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/LocalSearchOptions
// http://developer.baidu.com/map/reference/index.php?title=Class:%E6%9C%8D%E5%8A%A1%E7%B1%BB/LocalResult

function get_church(){
	// 百度地图API功能
	var map = new BMap.Map("l-map");        
	map.centerAndZoom("天津");

	var options = {
		onSearchComplete: function(results){
			// 判断状态是否正确
			if (local.getStatus() == BMAP_STATUS_SUCCESS){
				var s = [];
              	s.push(results.getNumPois());
              	s.push(results.getCurrentNumPois());
                //s.push(JSON.stringify(results));
              
				for (var i = 0; i < results.getCurrentNumPois(); i ++){
				    s.push(results.getPoi(i).title + ", " + results.getPoi(i).address);
                    s.push(JSON.stringify(results.getPoi(i)));
				}
				document.getElementById("r-result").innerHTML = s.join("<br/>");
			}
		}
	};
	var local = new BMap.LocalSearch(map, options);
  	local.setPageCapacity(99);
    
	local.search("教堂");
  //local.gotoPage(5);
}