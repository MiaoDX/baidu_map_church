function Route(id, color){
    this.route_id = id;
    this.route_color = color;
}


function Stop(list_info){  
    this.stop_id = list_info[0];
    this.stop_name = list_info[1];
    this.stop_lon = list_info[2];
    this.stop_lat = list_info[3];
}


// get the data
function read_data_from_csv_with_promise(csvFileName = "../data/church_copy_and_paste.csv"){
    return new Promise(function(resolve,reject){
        var stops = [];    
        // title, address, lon,lat
        d3.csv(csvFileName, function(error, links) {
            
            
            var trueindex = 0;  // deal with blank line,don't have to when csv is well defined.
            for(var i = 0; i < links.length; i ++){
                church = links[i];
                
                if(church.title == "" && typeof(church.address) == "undefined"){ //empty
                    continue;
                }
                
                l = [trueindex.toString(), church.title, church.lon, church.lat];
                stops.push(new Stop(l));
                trueindex += 1;
            }

            //return stops;
            resolve( stops );
        })        
    } );
}



/** Test read_data_from_csv_with_promise  **/

function read_data_from_csv_with_promise_test(){
    var ss = read_data_from_csv_with_promise()
    Promise.resolve(ss )
    .then(function(v){
        console.log( v );
    });
}



function read_duration_and_distance_data_from_csv_with_promise(csvFileName = "../data/calc_time_result.csv"){
    return new Promise(function(resolve,reject){
        //var duration_and_distance = [];    
        // title, address, lon,lat
        d3.csv(csvFileName, function(error, links) {
            resolve( links );
        })
    } );
}




function read_duration_and_distance_data_from_csv_with_promise_test(){
    var ss = read_duration_and_distance_data_from_csv_with_promise()
    Promise.resolve(ss)
    .then(function(v){
        console.log( v );   // 21

        //{source: "同花顺", target: "IFIND", type: "resolved", rela:"主营产品"},    
        v.forEach(function(l){
             var ans = "{source:\"" + l.via_name+"\", target:\""+l.to_name+"\",type: \"resolved\""+ ", rela:\"" + l.distance +"\"}," + "<br>";
             document.getElementById("r-result").innerHTML += ans;
        })
    }
    
);
}








