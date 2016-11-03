//var map = new BMap.Map("l-map");            
//map.centerAndZoom("天津");

// 获取坐标点之间的路径规划

//$(document).ready(function(){
////do something
//    var map = new BMap.Map("l-map");            
//	map.centerAndZoom("天津");
//})

//var resultMap = new Map();


function calc_time_with_promise(p_1, p_2){
    return new Promise(function(resolve,reject){
           // 百度地图API功能

            //nowPair = [p_1,p_2];

            var output = "从 A 到 B 时间";
            var searchComplete = function (results){
                if (transit.getStatus() != BMAP_STATUS_SUCCESS){
                    return ;
                }
                    var plan = results.getPlan(0);
//                    var duration = plan.getDuration(true);  //获取时间
//                    var distance = plan.getDistance(true);  //获取距离
                    var duration = plan.getDuration();  //获取时间
                    var distance = plan.getDistance();  //获取距离

                console.log("duration", duration);
                console.log("distance", distance);

                //nowData = resultMap.get(nowPair);

                if(duration != "" && distance != ""){
                    //resultMap.set(nowPair, [duration, distance]);
                    resolve([duration, distance]);
                }

                var makeup = "1,"+"2,"+duration+","+distance;

               //document.getElementById("r-result").innerHTML += makeup;//r.join("<br/>");
            }

            // Transport types: TransitRoute,DrivingRoute,WalkingRoute
            var transit = new BMap.WalkingRoute(map, {renderOptions: {map: map},
                onSearchComplete: searchComplete,
                onPolylinesSet: function(){                       
                    //setTimeout(function(){alert(output)},"1000");
                }});
            transit.search(p_1, p_2);
    })
}


function test(){
    var map = new BMap.Map("l-map");            
    map.centerAndZoom("天津");
    var p1 = new BMap.Point(117.200765,39.12413);
    var p2 = new BMap.Point(117.199517,39.129259);
    calc_time(p1, p2);
    var p3 = new BMap.Point(117.220074,39.124793);
    // calc_time(map, p1, p3);
}


function read_data_and_do_the_trick(){
    var ss = read_data_from_csv_with_promise("church_only_ten.csv")
    Promise.resolve(ss)
    .then(function(stops){
        //console.log( v );   // 21
        
        
        for(var via = 0; via < stops.length-1; via ++){
            for(var to = via+1; to < stops.length; to ++){
                var viaStop = stops[via];
                var toStop = stops[to];
                
                var p_1 = new BMap.Point(viaStop.stop_lon,viaStop.stop_lat);
                var p_2 = new BMap.Point(to.stop_lon,to.stop_lat);
                
                Promise.resolve(calc_time_with_promise(p_1, p_2) )
                .then(function(v){
                    console.log( "haha2",v );   // 21
                    document.getElementById("r-result").innerHTML += (p1.stop_id + "," + p2.stop_id + "," + v);//r.join("<br/>");
                })
            }
        }
        
        
    })
}