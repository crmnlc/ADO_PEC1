// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ false, false, false, false, false, false, false, false, false, false, true, false, false, false, false, false ];
var arrayMetadata    = [ [ "1", "C.4W.1", "GSM1520965_Untreated_4-weeks_1.CEL", "C.4W", "4 weeks of age", "Mouse cochlea of 4 weeks of age " ], [ "2", "C.4W.2", "GSM1520966_Untreated_4-weeks_2.CEL", "C.4W", "4 weeks of age", "Mouse cochlea of 4 weeks of age " ], [ "3", "C.4W.3", "GSM1520967_Untreated_4-weeks_3.CEL", "C.4W", "4 weeks of age", "Mouse cochlea of 4 weeks of age " ], [ "4", "C.4W.4", "GSM1520968_Untreated_4-weeks_4.CEL", "C.4W", "4 weeks of age", "Mouse cochlea of 4 weeks of age " ], [ "5", "C.4W.5", "GSM1520969_Untreated_4-weeks_5.CEL", "C.4W", "4 weeks of age", "Mouse cochlea of 4 weeks of age " ], [ "6", "C.12W.1", "GSM1520970_Control_vehicle_12-weeks_1.CEL", "C.12W", "12 weeks of age", "Mouse cochlea of 12 weeks of age with control vehicle " ], [ "7", "C.12W.2", "GSM1520971_Control_vehicle_12-weeks_2.CEL", "C.12W", "12 weeks of age", "Mouse cochlea of 12 weeks of age with control vehicle " ], [ "8", "C.12W.3", "GSM1520972_Control_vehicle_12-weeks_3.CEL", "C.12W", "12 weeks of age", "Mouse cochlea of 12 weeks of age with control vehicle " ], [ "9", "C.12W.4", "GSM1520973_Control_vehicle_12-weeks_4.CEL", "C.12W", "12 weeks of age", "Mouse cochlea of 12 weeks of age with control vehicle " ], [ "10", "C.12W.5", "GSM1520974_Control_vehicle_12-weeks_5.CEL", "C.12W", "12 weeks of age", "Mouse cochlea of 12 weeks of age with control vehicle " ], [ "11", "T.12W.1", "GSM1520975_MET_and_VA_12-weeks_1.CEL", "T.12W", "12 weeks of age", "Mouse cochlea of 12 weeks of age with L-methionine and valproic acid " ], [ "12", "T.12W.2", "GSM1520976_MET_and_VA_12-weeks_2.CEL", "T.12W", "12 weeks of age", "Mouse cochlea of 12 weeks of age with L-methionine and valproic acid " ], [ "13", "T.12W.3", "GSM1520977_MET_and_VA_12-weeks_3.CEL", "T.12W", "12 weeks of age", "Mouse cochlea of 12 weeks of age with L-methionine and valproic acid " ], [ "14", "T.12W.4", "GSM1520978_MET_and_VA_12-weeks_4.CEL", "T.12W", "12 weeks of age", "Mouse cochlea of 12 weeks of age with L-methionine and valproic acid " ], [ "15", "T.12W.5", "GSM1520979_MET_and_VA_12-weeks_5.CEL", "T.12W", "12 weeks of age", "Mouse cochlea of 12 weeks of age with L-methionine and valproic acid " ], [ "16", "T.12W.6", "GSM1520980_MET_and_VA_12-weeks_6.CEL", "T.12W", "12 weeks of age", "Mouse cochlea of 12 weeks of age with L-methionine and valproic acid " ] ];
var svgObjectNames   = [ "pca", "dens" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
