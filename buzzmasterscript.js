function updateData(){
	var original_json = {
		"qr": {
			"demo:7472241585": {
				"4658477906": {
					"54710": ["Ronnie"],
					"58021": ["😜👍🏼"],
					"65393": ["Blond", "Bock"]
				},
				"4775120743": {
					"54710": ["Meindert"],
					"58021": ["Bierspray🍻"],
					"65393": ["Pils", "IPA"]
				},
				"5091938239": {
					"54710": ["Michiel 2"]
				},
				"5273956329": {
					"54710": ["Chdjtifg"],
					"65393": ["Blond", "IPA"]
				},
				"5285005072": {
					"54710": ["Tom"]
				},
				"5602215462": {
					"54710": ["Luc"],
					"58021": ["Ik ben een 🤡"],
					"65393": ["Bock", "IPA"]
				},
				"5841984172": {
					"54710": ["Rutger Mollee"],
					"58021": ["Eigen bier eerst!"],
					"65393": ["Blond", "Witbier"]
				},
				"6029152399": {
					"54710": ["Rens de Jong"],
					"58021": ["Ik weet niet meer. Heel veel mensen! "],
					"65393": ["Pils", "IPA"]
				},
				"6648182052": {
					"54710": ["Maarten"],
					"58021": [""],
					"65393": ["Blond", "Triple"]
				},
				"6966862376": {
					"54710": ["Michiel"],
					"58021": ["Af en toe bier uit de kraan laten stromen"],
					"65393": ["Blond", "IPA"]
				},
				"6989123921": {
					"54710": ["Tom"]
				},
				"7749027221": {
					"54710": ["Fidhbe"],
					"65393": ["Triple"]
				},
				"7900767133": {
					"54710": ["Tom"],
					"58021": ["Horeca binnen lopen"],
					"65393": ["Pils", "Triple"]
				},
				"7935881595": {
					"54710": ["Tom"]
				},
				"7982062806": {
					"54710": ["Michiel Ubuntu"]
				},
				"8493678725": {
					"54710": ["Kim"],
					"58021": ["🍺🍺🍺🍺🍺🍺🍺🍺🍺🍺🍺"],
					"65393": ["Witbier", "Triple"]
				}
			}
		},
		"s": "{\"1\":\"3\"}",
		"cr": {},
		"r": 200,
		"o": {}
	}; 
	var i,beer_type_list = "",comment_box = "",people_list="";
	

		/* Looping through the original JSON */
	for (i in original_json.qr["demo:7472241585"]) {
		/* Beer type list from JSON (including duplicate values) */
		beer_type_list += (original_json.qr["demo:7472241585"][i]["65393"] ) + ",";
		/* New JSON string to show corresponding connent box on bar chart click */
		people_list +='{"personName":"'+original_json.qr["demo:7472241585"][i]["54710"]+'",'
		               + '"beerName":"'+original_json.qr["demo:7472241585"][i]["65393"]+'",'
		               + '"personComment":"'+original_json.qr["demo:7472241585"][i]["58021"]+'"},';
		/* Display comment boxes with all comments */
	     if(((original_json.qr['demo:7472241585'][i]['58021']) == "" )
	    	   || ((original_json.qr['demo:7472241585'][i]['58021']) == "undefined") 
	    	   || ((original_json.qr['demo:7472241585'][i]['58021']) == undefined)){}
	     else{
		     comment_box +=  "<div class='comment_box'>"
		      + "<div class='comment_name_header'>" + original_json.qr['demo:7472241585'][i]['54710'] + "</div>"
		      +	"<div class='comment_text'><p>"+original_json.qr['demo:7472241585'][i]['58021'] +"</p></div></div>";
	     }
	}
	/* To remove last coma in the string */
	beer_type_list = beer_type_list.substring(0, beer_type_list.length-1);
	/* Converting string to JSON to use in graph ploting  */
	people_list = '['+people_list.substring(0, people_list.length-1)+']';
	people_list = JSON.parse(people_list);
	
	/* Calling function to get beer type and count */
	var chartPoints = beerCount(beer_type_list);
	var beer_count_list = chartPoints[1];
	/* To calculate percentage */
	var count_total = 0;
	for(var i=0;i< beer_count_list.length;i++){
		count_total += beer_count_list[i];
	}
	/* Creating JSON to draw bar chart */
	var beerJson = "[";
	for(var i=0;i < chartPoints[0].length;i++){
		if(chartPoints[0][i] == "undefined"){
			beerJson = beerJson + '{"beerName":"Others","beerCount":"'+chartPoints[1][i]+'"},';
		}else{
			beerJson = beerJson + '{"beerName":"'+chartPoints[0][i]+'","beerCount":"'+chartPoints[1][i]+'"},';
		}
	}
	beerJson = beerJson.substring(0, beerJson.length-1) + "]";
	beerJson = JSON.parse(beerJson);
	
	/* Creating graph in the left container */
	
	var svg = d3.select(".leftcontainer").append("svg")
	          .attr("height","600px")
	          .attr("width","100%");
	
	/* Select, append to SVG, and add attributes to rectangles for bar chart */
	svg.selectAll("rect")
	    .data(beerJson)
	    .enter()
	    .append("rect")
	    .attr("class", "bar")
	    .on("click",function(d){ // Onclick function to show corresponding comments
	    	comment_box = "";
	    	if(d.beerName == "Others"){
	    		document.getElementById("rightHeading").innerHTML = "";
	    		document.getElementById("commentContainer").innerHTML = "<div class='no_comment_box'><h2>No Comments</h2></div>";
	    	}
	        for (var i=0;i < people_list.length;i++){
				if(((people_list[i].beerName).search(d.beerName) != -1) 
						&& (people_list[i].personComment != "") && (people_list[i].personComment != "undefined"))
					{
						comment_box +=  "<div class='comment_box'>"
						      + "<div class='comment_name_header'>" + people_list[i].personName + "</div>"
						      +	"<div class='comment_text'><p>"+people_list[i].personComment +"</p></div></div>";
						document.getElementById("rightHeading").innerHTML = "Comments";
						document.getElementById("commentContainer").innerHTML = comment_box;
					}
					
	         }
	        	
	     })
	    .attr("height", function(d, i) {return (d.beerCount * 100)})
	    .attr("width","85")
	    .attr("x", function(d, i) {return (i * 90) + 25})
	    .attr("y", function(d, i) {return 700 - (d.beerCount * 100)});
	/* To show the beer name on bar chart */
	svg.selectAll("text.title")
		.data(beerJson)
		.enter()
		.append("text")
		.attr("class", "text")
		.text(function(d){return d.beerName;})
		.attr("x",function(d,i){return (i * 90) + 45;})
		.attr("y", function(d,i){return  730 - (d.beerCount * 100) ;});
	/* To show percentage on the bar chart */
	svg.selectAll("text.value")
		.data(beerJson)
		.enter()
		.append("text")
		.attr("class", "text")
		.text(function(d){
			return ((d.beerCount / count_total) * 100).toFixed(2) + "%"})
		.attr("x", function(d, i) {return (i * 90) + 45})
		.attr("y", function(d, i) {return 760 - (d.beerCount * 100)});
	
	/* Code to display all comments at first page load*/
	if(document.getElementById("commentContainer").innerHTML == ""){
		document.getElementById("rightHeading").innerHTML = "All Comments";
		document.getElementById("commentContainer").innerHTML = comment_box;
	}
	
	/*setInterval(function() {
		location.reload();
	}, 50000);*/
}
/* Function to remove the duplicate beer values and also to count each beer type */
function beerCount(beer_type_list) {
    var beer_name = [], beer_count = [], previous;
    var beer_array = beer_type_list.split(",");
    beer_array.sort();
    for ( var i = 0; i < beer_array.length; i++ ) {
        if ( beer_array[i] !== previous ) {
        	beer_name.push(beer_array[i]);
        	beer_count.push(1);
        } else {
        	beer_count[beer_count.length-1]++;
        }
        previous = beer_array[i];
    }
    return [beer_name, beer_count];
}