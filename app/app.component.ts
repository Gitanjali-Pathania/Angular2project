import { Component } from '@angular/core';
import { Component } from '@angular/core';
import { getData } from './read.service';
import { HTTP_PROVIDERS } from '@angular/http';
@Component({
  selector: 'my-app',
  templateUrl: 'app/home/demo.html',
  providers: [HTTP_PROVIDERS,getData]
})
export class AppComponent {
	
	items: Observable<string[]>;
	fields: Observable<string[]> ;

	constructor (private getData_: getData) {}
	
	ngOnInit() { this.search(); }
	
	search (term: string) {
		let self = this;
		this.fields = ["Manufacturer","Cylinders","EngineSize","Fuel.tank.capacity","Price"];

		this.chartObject = d3.histogramChart()
								    .bins(d3.scale.linear().ticks(20))
								    .containerId("#chart");


	    this.getData_.fetchData('app/data/cars.json').subscribe(data => { 
	    						this.originalData = JSON.parse(JSON.stringify(data));
	    						this.items = data;
	    						this.visProperty = 'Cylinders';
	    						this.selectdimensions = ['Cylinders','EngineSize','Price'];
	    						
	    						this.render(this.selectdimensions[0]);

	    						});

	    


	}

	render (dimension: string){
								var data_ = irwinHallDistribution(this.items,dimension);

	    						var minMax = d3.extent(data_);
	    						
	    						var linearScale = d3.scale.linear().domain(minMax).range([0,1]);
	    						var revLinearScale = d3.scale.linear().domain([0,1]).range(minMax);
	    						

	    						d3.select("#chart")
								    .datum(data_.map(function(d){
								    	return linearScale(d);
								    }))
								  	.call(this.chartObject.minMax(minMax)
								  		.tickFormat(function(d){
								    		return parseFloat(revLinearScale(d)).toFixed(2);
									    })
									    .brushCallBck(extent =>{
									    	this.extent = extent;
									    	
									    	this.items = this.originalData.filter(d => {
									    		return d[this.visProperty] <= extent[1] && d[this.visProperty] >= extent[0];
									    	});
									    	

									    }));
	}

	detail (item: Object){

		this.dataObject = item;
		this.arrayOfKeys = Object.keys(this.dataObject).filter(function(d){return d !==""});

	}

	changeInDim (dimension : string){
		this.visProperty = dimension;
		this.render(dimension);
		console.log(dimension)
	}


	function irwinHallDistribution(data,property) {

	 	var distribution = [];

		  data.forEach(function(d){
		  	distribution.push(d[property]);
		  })
	  return distribution;
	}

	
}