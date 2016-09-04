"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var read_service_1 = require('./read.service');
var http_1 = require('@angular/http');
var AppComponent = (function () {
    function AppComponent(getData_) {
        this.getData_ = getData_;
    }
    AppComponent.prototype.ngOnInit = function () { this.search(); };
    AppComponent.prototype.search = function (term) {
        var _this = this;
        var self = this;
        this.fields = ["Manufacturer", "Cylinders", "EngineSize", "Fuel.tank.capacity", "Price"];
        this.chartObject = d3.histogramChart()
            .bins(d3.scale.linear().ticks(20))
            .containerId("#chart");
        this.getData_.fetchData('app/data/cars.json').subscribe(function (data) {
            _this.originalData = JSON.parse(JSON.stringify(data));
            _this.items = data;
            _this.visProperty = 'Cylinders';
            _this.selectdimensions = ['Cylinders', 'EngineSize', 'Price'];
            _this.render(_this.selectdimensions[0]);
        });
    };
    AppComponent.prototype.render = function (dimension) {
        var _this = this;
        var data_ = irwinHallDistribution(this.items, dimension);
        var minMax = d3.extent(data_);
        var linearScale = d3.scale.linear().domain(minMax).range([0, 1]);
        var revLinearScale = d3.scale.linear().domain([0, 1]).range(minMax);
        d3.select("#chart")
            .datum(data_.map(function (d) {
            return linearScale(d);
        }))
            .call(this.chartObject.minMax(minMax)
            .tickFormat(function (d) {
            return parseFloat(revLinearScale(d)).toFixed(2);
        })
            .brushCallBck(function (extent) {
            _this.extent = extent;
            _this.items = _this.originalData.filter(function (d) {
                return d[_this.visProperty] <= extent[1] && d[_this.visProperty] >= extent[0];
            });
        }));
    };
    AppComponent.prototype.detail = function (item) {
        this.dataObject = item;
        this.arrayOfKeys = Object.keys(this.dataObject).filter(function (d) { return d !== ""; });
    };
    AppComponent.prototype.changeInDim = function (dimension) {
        this.visProperty = dimension;
        this.render(dimension);
        console.log(dimension);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-app',
            templateUrl: 'app/home/demo.html',
            providers: [http_1.HTTP_PROVIDERS, read_service_1.getData]
        }), 
        __metadata('design:paramtypes', [read_service_1.getData])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
function irwinHallDistribution(data, property) {
    var distribution = [];
    data.forEach(function (d) {
        distribution.push(d[property]);
    });
    return distribution;
}
//# sourceMappingURL=app.component.js.map