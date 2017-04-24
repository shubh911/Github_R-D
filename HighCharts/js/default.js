var primaryData=[{
        name: 'Brands',
        colorByPoint: true,
        data: [{
            name: 'Microsoft Internet Explorer',
            y: 56.33
        }, {
            name: 'Chrome',
            y: 24.03,
            sliced: true,
            selected: true
        }, {
            name: 'Firefox',
            y: 10.38
        }, {
            name: 'Safari',
            y: 4.77
        }, {
            name: 'Opera',
            y: 0.91
        }, {
            name: 'Proprietary or Undetectable',
            y: 0.2
        }]
    }];
var secondaryData=[{
						name:'Chrome',
						male:5,
						female:95
					},
					{
						name:'Microsoft Internet Explorer',
						male:30,
						female:70
					},
					{
						name:'Firefox',
						male:45,
						female:55
					},
					{
						name:'Safari',
						male:5,
						female:95
					},
					{
						name:'Opera',
						male:35,
						female:65
					},
					{
						name:'Proprietary or Undetectable',
						male:75,
						female:25
					}];
//To Create the first Pie Chart
Highcharts.chart('first', {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    title: {
        text: 'Browser market shares January, 2015 to May, 2015'	//can also give  the subtitle
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'	//Brand 98.3%
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
			point: {	//Don't' Change  the position of the point and event function or it will stop functioning
				events: {
                    click: function() {
						showTheSecondGraph(this.name);
                    }
                }
            },
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',	//{} is like angular expression they 
                style: {													//	get the value from series 
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            },
			
            
          }
        }
    },
		  
    series: primaryData

});

//To Show The Second Graph
function showTheSecondGraph(tempName){
	for(var i=0;i<secondaryData.length;i++){
		if(secondaryData[i].name===tempName){
		//Extracting the data for Second Graph
			selectedDataToShow={
								male:secondaryData[i].male,
								female:secondaryData[i].female
							   };
		}					   
	}
	//To Create the Second Bar Graph
		Highcharts.chart('second', {
		chart: {
			type: 'column'
		},
		title: {
			text: 'Secondary Chart'
		},
		xAxis: {
			categories: [
				'Gender'
			],
			crosshair: true
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Poularity(MILLIONS)'
			}
		},
		 tooltip: {//Dosen't understand posiion part of this tooltip
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
		series: [{
			name: 'Male',
			data: [selectedDataToShow.male]
		}, {
			name: 'Female',
			data: [selectedDataToShow.female]
		}]
	});
	
};


