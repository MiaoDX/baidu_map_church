function calc_time_with_promise(p_1, p_2){
    return new Promise(function(resolve,reject){
           // 百度地图API功能

            var output = "从 A 到 B 时间";
            var searchComplete = function (results){
                if (transit.getStatus() != BMAP_STATUS_SUCCESS){
                    return ;
                }
                var plan = results.getPlan(0);
            /** Don't see the different ?? **/
//                    var duration = plan.getDuration(true);  //获取时间
//                    var distance = plan.getDistance(true);  //获取距离
                var duration = plan.getDuration();  //获取时间
                var distance = plan.getDistance();  //获取距离

                console.log("duration", duration);
                console.log("distance", distance);


                //if(duration != "" && distance != ""){
                    resolve([duration, distance]);
                //}
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

/** False try,inner `new` is just won't OK.
**
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
*/

function final_test(){
    var stops = [];
    var ss = read_data_from_csv_with_promise("../data/church_only_ten.csv")
    Promise.resolve(ss)
    .then(function(stops_get){
        //console.log( v );   // 21
        stops = stops_get;
        var calc_time_with_promise_list = []
        
        var stopsPoints = []
        
        stops.forEach(function(sp){
            stopsPoints.push(new BMap.Point(sp.stop_lon, sp.stop_lat))
        })
        
        
//        var p_1,p_2;
//        var outScope = stops.length - 1, innnerScope = stops.length - 2;
        var outScope = stops.length - 1, innnerScope = stops.length;
        for(var via = 0; via < outScope; via ++){
            for(var to = via+1; to < innnerScope; to ++){

                
/**  innner `new` won't be accesed
**
//                var viaStop = stops[via];
//                var toStop = stops[to];         
//                var p_1 = new BMap.Point(viaStop.stop_lon,viaStop.stop_lat);
//                var p_2 = new BMap.Point(to.stop_lon,to.stop_lat);
                
                //calc_time_with_promise_list.push(calc_time_with_promise(p_1, p_2));
*/             
         
                calc_time_with_promise_list.push(calc_time_with_promise(stopsPoints[via], stopsPoints[to]));
                
                if(via == outScope-1 && to == innnerScope-1){


                    return Promise.all(calc_time_with_promise_list);
                }
            }
        }        
    }).then(function(v){
        console.log( "haha2",v );   // 21
       
        var outScope = stops.length - 1, innnerScope = stops.length;
        var vindex = 0;
        for(var via = 0; via < outScope; via ++){
            for(var to = via+1; to < innnerScope; to ++){
                var viaStop = stops[via];
                var toStop = stops[to]; 
                document.getElementById("r-result").innerHTML += (viaStop.stop_id + "," + viaStop.stop_name + "," + toStop.stop_id + "," + toStop.stop_name + "," + v[vindex]+"<br>");//r.join("<br/>");        
                vindex ++;
            }
        }
        
    })
    .catch(function(err){
        console.log(err)
        throw new Error(err)
    })
}