function Route(id, color){
    this.route_id = id;
    this.route_color = color;
}


function Stop(list_info){
//     this.stop_id = id;
//     this.stop_name = name;
//     this.stop_lat = lat;
//     this.stop_lon = lon;
  
    this.stop_id = list_info[0];
    this.stop_name = list_info[1];
    this.stop_lon = list_info[2];
    this.stop_lat = list_info[3];
  
    this.hello = function () {
       //alert('Hello, ' + this.stop_id + '!');
      console.log(('Hello, ' + this.stop_id + '!'));
    }
}

//l = ['1',2,3,4]
//var xiaoming2 = new Stop(l);
//xiaoming2.hello();




// get the data

function read_data_from_csv_with_promise(csvFileName = "../../data/church_copy_and_paste.csv"){
    return new Promise(function(resolve,reject){
        var stops = [];    
        // title, address, lon,lat
        d3.csv(csvFileName, function(error, links) {
            
            
            var trueindex = 0;
            for(var i = 0; i < links.length; i ++){
                church = links[i];
                
                if(church.title == "" && typeof(church.address) == "undefined"){ //empty
                    continue;
                }
                
                l = [trueindex.toString(), church.title, church.lon, church.lat];
                stops.push(new Stop(l));
                trueindex += 1;
            }
        //    stops.forEach(function (e){
        //      console.log(e.stop_name);
        //    })

            //return stops;
            resolve( stops );
        })        
    } );
}



//var ss = read_data_from_csv_with_promise()
//Promise.resolve(ss )
//.then(function(v){
//    console.log( v );   // 21
//}
//    function fulfilled(val){
//        console.log( val.length ); // 42
//    },
//    function rejected(err){
//        // never gets here
//    }
//    
//);



















