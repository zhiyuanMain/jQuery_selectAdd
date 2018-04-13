/***************************
*
*name:selectAdd
*version:1.0.0
*author:xingzhiyuan
*e-mail:h_xingzhiyuan@163.com
*date:2016/05/26
*the function:
*		This plugin can help you select and display some two-layer data,like:provinces and cities,
*	something which is interseting or your are wild about. I will update all the time in order to make it perfect.
****************************/

(function($){
	$.fn.selectAdd = function(options){
		var _$this = $(this);
		var _$id = _$this.attr("id");
		var defaults = {
			data   : {},			//json格式
			action : "expand",		//expand展开闭合式 check勾选式
			selectBoxId : _$id+"box", //选择div的id
			displayBoxId : _$id+"disBox", //展示div的id
			hasDeletd    : false,		//是否有清空功能
			deleteId : _$id+"btnClean",	//清除按钮id
			checkArray: [],				//已选择的数据
			ajaxUrl: "",			//ajaxurl ajax请求url
			callBack : function(){},	//自定义回调函数
		};
		var options = $.extend(defaults,options);		
		if(options.hasDeletd){
			_$this.append('<button id="'+options.deleteId+'">清空</button>');
		}
		if(options.ajaxUrl){
			options.data = myJson;
		}		
		if(options.action == "check"){
			//to do list
			_$this.addClass("ui-areapick");
			function addProvince(text,id,childNum){
				var addProvince = 
					'<div class="province">'+
						'<div class="locator">'+
							'<div class="city-box" id="'+_$id+'ctrlareaPickregionsub_'+id+'" style="display: none;">'+
								'<table border="0" cellspacing="0" cellpadding="0" width="">'+									
								'</table>'+
							'</div>'+
							'<b id="'+_$id+'ctrlareaPickregioninfo_'+id+'" style="display: none;"><em>0</em>/'+childNum+'</b>'+
						'</div>'+
						'<div class="text" id="'+_$id+'ctrlareaPickregionwrapper_'+id+'" style="z-index: 0;">'+
							'<input type="checkbox" id="'+_$id+'ctrlareaPickregion_'+id+'" '+_$id+'data-parentId="0">'+
							'<label for="'+_$id+'ctrlareaPickregion_'+id+'">'+text+'</label>'+
						'</div>'+
					'</div>';
				return addProvince;
			}
			function addCity(text,id,parentid){
				var addCity = 
					'<td width="">'+
						'<div class="city">'+
							'<input type="checkbox" id="'+_$id+'ctrlareaPickregion_'+id+'" '+_$id+'data-parentId="'+parentid+'">'+
							'<label for="'+_$id+'ctrlareaPickregion_'+id+'">'+text+'</label>'+
						'</div>'+
					'</td>';
				return addCity;
			}
			//append province
			for(var a in options.data){
				var paramText = options.data[a].text;
				var paramId = options.data[a].id;
				var paramChildNum = options.data[a].children.length;
				_$this.append(addProvince(paramText,paramId,paramChildNum));
			}
			//append city
			for(var a in options.data){
				var finalHtml = "";
				for(var b in options.data[a].children){
					var paramText =  options.data[a].children[b].text;
					var paramId = options.data[a].children[b].id;
					var paramParentid = options.data[a].id;
					if(parseInt(b) % 2 == 0){			//偶数
						finalHtml += "<tr>"+addCity(paramText,paramId,paramParentid);
					}else{
						finalHtml += addCity(paramText,paramId,paramParentid)+"</tr>";
					}
				}
				$("#"+_$id+"ctrlareaPickregionsub_"+options.data[a].id).find("table").append(finalHtml);
			}
			//hover action
			$("#"+_$id+" .province").hover(function(){
				var obj = $(this).find($("div[id^="+_$id+"ctrlareaPickregionwrapper_]"));
				var $thidId = obj.attr("id").split("_")[1];
				obj.addClass("hover").css({"z-index":"999"});
				$("#"+_$id+"ctrlareaPickregionsub_"+$thidId).css("display","block");
			},function(){
				var obj = $(this).find($("div[id^="+_$id+"ctrlareaPickregionwrapper_]"));
				var $thidId = obj.attr("id").split("_")[1];
				obj.removeClass("hover").css({"z-index":"0"});
				$("#"+_$id+"ctrlareaPickregionsub_"+$thidId).css("display","none");
			})
			//click province
			$("#"+_$id+" input[id^='"+_$id+"ctrlareaPickregion_']").change(function(){
				var $this = $(this);
				var $id = $this.attr("id").split("_")[1];
				var $parentId = $this.attr(_$id+"data-parentid");
				if($parentId == 0){	//	province
					if($this.prop("checked")){
						$("#"+_$id+"ctrlareaPickregionsub_"+$id+" > table input").prop("checked","checked");
						$("#"+_$id+"ctrlareaPickregioninfo_"+$id).css("display","block").find("em").html($("#"+_$id+"ctrlareaPickregionsub_"+$id+" > table input").length);
					}else{
						$("#"+_$id+"ctrlareaPickregionsub_"+$id+" > table input").removeAttr("checked");
						$("#"+_$id+"ctrlareaPickregioninfo_"+$id).css("display","none").find("em").html(0);
					}
				}else{	//city
					if($this.prop("checked")){
						$("#"+_$id+"ctrlareaPickregion_"+$parentId).prop("checked","checked");//check parent
						$("#"+_$id+"ctrlareaPickregioninfo_"+$parentId).css("display","block").find("em").html($("#"+_$id+"ctrlareaPickregionsub_"+$parentId+" > table input:checked").length);
					}else{
						$("#"+_$id+"ctrlareaPickregioninfo_"+$parentId).css("display","block").find("em").html($("#"+_$id+"ctrlareaPickregionsub_"+$parentId+" > table input:checked").length);
						if($("#"+_$id+"ctrlareaPickregionsub_"+$parentId).find("input:checked").length <= 0){
							$("#"+_$id+"ctrlareaPickregion_"+$parentId).removeAttr("checked");
							$("#"+_$id+"ctrlareaPickregioninfo_"+$parentId).css("display","none").find("em").html("0");
						}
					}
				}
			})
			//reset
			$("#"+options.deleteId).on("click",function(){
				$("input[id^='"+_$id+"ctrlareaPickregion_']").removeAttr("checked").change();
			})
			//checked array
			if(options.checkArray.length > 0){
				for (var i = 0; i < options.checkArray.length; i++) {
					$("input[id^='"+_$id+"ctrlareaPickregion_"+options.checkArray[i]+"']").prop("checked","checked").change();
				};
			}

		}else if(options.action == "expand"){
			_$this.append('<div id="'+options.selectBoxId+'" class="floatLeft"></div>');
			_$this.append('<div id="'+options.displayBoxId+'" class="floatLeft"></div>');
			function modelPar1(id,text){
				var modelPar1 = 
				'<div class="ui-multi-column-select-list-item" '+
						'id="'+_$id+'aClass_'+id+'" '+_$id+'parentid="0" '+_$id+'data-text="'+text+'" '+_$id+'layer="2">'+
				  	'<ul class="clearfix">'+
					    '<li class="level0" style="width:305px;">'+
					      '<span class="myToggle toggle-add mgright10" '+_$id+'myId="'+id+'"></span>'+
					      '<span class="bigLeftText">'+text+'</span>'+
					    '</li>'+
					    '<li class="level0">'+
					      '<span class="pointer"></span>'+
					    '</li>'+
				  	'</ul>'+
				'</div>';
				return modelPar1;
			}
			function modelPar2(id,text){
				var modelPar2 = 
				'<div class="ui-multi-column-select-list-item" '+
						'id="'+_$id+'aClass_'+id+'" '+_$id+'parentid="0" '+_$id+'data-text="'+text+'" '+_$id+'layer="1">'+
				  	'<ul class="clearfix">'+
					    '<li class="level0" style="width:305px;">'+

					      '<span class="bigLeftText">'+text+'</span>'+
					    '</li>'+
					    '<li class="level0">'+
					      '<span class="pointer"></span>'+
					    '</li>'+
				  	'</ul>'+
				'</div>';
				return modelPar2;
			}
			function modelChild(id,text,parenttext,parentid){
				var modelChild = 
				'<div class="ui-multi-column-select-list-item"'+
						'id="'+_$id+'bClass_'+id+'" '+_$id+'parentid="'+parentid+'" '+_$id+'data-text="'+text+'" '+_$id+'data-parent-text="'+parenttext+'">'+
				    '<ul class="clearfix">'+
				      '<li class="level1" style="width:285px;padding-left:30px;">'+
				        '<span title="'+text+'" class="">'+text+'</span>'+
				      '</li>'+
				      '<li class="level1">'+
				        '<span class="pointer"></span>'+
				      '</li>'+
				    '</ul>'+
				 '</div>';
				 return modelChild;
			}
			function middleBox(id){
				var middleBox = '<div class="middleBox hide" id="'+_$id+'mClass_'+id+'">';
				return middleBox;
			}
			for(var a in options.data){
				options.data[a].children != ""?$("#"+options.selectBoxId).append(modelPar1(options.data[a].id,options.data[a].text)):$("#"+options.selectBoxId).append(modelPar2(options.data[a].id,options.data[a].text));
				if(options.data[a].children != ""){
					$("#"+options.selectBoxId).append(middleBox(options.data[a].id));
					var $middBox = $("#"+_$id+"mClass_"+options.data[a].id);
					for(var b in options.data[a].children){
						$middBox.append(modelChild(options.data[a].children[b].id,options.data[a].children[b].text,options.data[a].text,options.data[a].children[b].parentid));
					}

				}else{
					continue;
				}
			}
			/************************
			*
			*read action
			*
			************************/
			//toggle
			$("div[id^='"+_$id+"aClass_'] .myToggle").on("click",function(e){
				var $this = $(this);
				$this.toggleClass("toggle-minus");
				var boxId = $this.attr(_$id+"myid");
				if($("#"+_$id+"mClass_"+boxId)){
					$("#"+_$id+"mClass_"+boxId).toggle();
				}
				return false;
			})
			//hover
			$("div[id^='"+_$id+"aClass'],div[id^='"+_$id+"bClass']").hover(function(){
				$(this).addClass("ui-multi-column-select-list-item-hover");
			},function(){
				$(this).removeClass("ui-multi-column-select-list-item-hover");
			})
			//click
			$("div[id^='"+_$id+"aClass'],div[id^='"+_$id+"bClass']").on("click",function(e){
				var $this = $(this);
				e.preventDefault();
				if($this.hasClass("ui-multi-column-select-list-item-selected")){
					return;
				}
				$this.addClass("ui-multi-column-select-list-item-selected");
				var $id = $this.attr("id").split("_")[1];
				var $parentid = $this.attr(_$id+"parentid");
				var $text = $this.attr(_$id+"data-text");
				var $layer = $this.attr(_$id+"layer");
				if($parentid == 0){	//click aClass
					$("#"+_$id+"aDisplayClass_"+$id).remove();
					$("#"+_$id+"mDisplayClass_"+$id).remove();
					if($layer == 1){
						$("#"+options.displayBoxId).append(modelDisplayPar2($id,$text));
					}
					if($layer == 2){
						$("#"+options.displayBoxId).append(modelDisplayPar1($id,$text));
						$("#"+options.displayBoxId).append(middleDisplayBox($id))
						for(var a in options.data){
							if(options.data[a].id == $id){
								for(var b in options.data[a].children){
									$("#"+_$id+"mDisplayClass_"+$id).append(modelDisplayChild(options.data[a].children[b].id,options.data[a].children[b].text,options.data[a].children[b].parentid))
								}
							}
						}
						//left selected
						$("#"+_$id+"mClass_"+$id).find("div[id^='"+_$id+"bClass']").addClass("ui-multi-column-select-list-item-selected");
						//close
						$("#"+_$id+"aDisplayClass_"+$id+" > span").addClass("ui-inst-del-toggle-add ");
						$("#"+_$id+"mDisplayClass_"+$id).addClass("hide");
					}

				}else{		//click bClass
					$parenttext = $this.attr(_$id+"data-parent-text");
					if(!$("#"+_$id+"aDisplayClass_"+$parentid).length){ //parent not exit
						$("#"+options.displayBoxId).append(modelDisplayPar1($parentid,$parenttext));
						$("#"+options.displayBoxId).append(middleDisplayBox($parentid));
						for(var a in options.data){
							if(options.data[a].id == $parentid){
								for(var b in options.data[a].children){
									if(options.data[a].children[b].id == $id){
										$("#"+_$id+"mDisplayClass_"+$parentid).append(modelDisplayChild(options.data[a].children[b].id,options.data[a].children[b].text,options.data[a].children[b].parentid))
									}
									
								}
							}
						}
						//open
						$("#"+_$id+"aDisplayClass_"+$parentid).addClass("ui-inst-del-open");
					}else{		//exit
						for(var a in options.data){
							if(options.data[a].id == $parentid){
								for(var b in options.data[a].children){
									if(options.data[a].children[b].id == $id){
										$("#"+_$id+"mDisplayClass_"+$parentid).append(modelDisplayChild(options.data[a].children[b].id,options.data[a].children[b].text,options.data[a].children[b].parentid))
									}
									
								}
							}
						}
					}
					//if all selected
					var nowLength,length;
					length = $("#"+_$id+"mClass_"+$parentid+" > div").length;
					nowLength = $("#"+_$id+"mClass_"+$parentid+" > div.ui-multi-column-select-list-item-selected").length;
					if(nowLength == length){
						$("#"+_$id+"aClass_"+$parentid).addClass("ui-multi-column-select-list-item-selected");
						$("#"+_$id+"aDisplayClass_"+$parentid).removeClass("ui-inst-del-open");
						$("#"+_$id+"mDisplayClass_"+$parentid).hide();
					}
				}
			})
			//display
			function modelDisplayPar1(id,text){
				var modelDisplayPar1 = 
				'<div id="'+_$id+'aDisplayClass_'+id+'" class="myPar_Display ui-inst-del-item clearfix">'+
				    '<span class="ui-inst-del-toggle-add" '+_$id+'myid="'+id+'"></span>'+
				    '<div index="1" class="ui-inst-del-text-wrap">'+
				        '<span class="delMe ui-inst-del-del-icon skin-link-del-new" type="a" '+_$id+'data-id="'+id+'"></span>'+
				        '<span class="ui-inst-del-item-text" title="'+text+'">'+text+'</span>'+
				    '</div>'+
				'</div>';
				return modelDisplayPar1;
			}
			function modelDisplayPar2(id,text){
				var modelDisplayPar2 = 
				'<div id="'+_$id+'aDisplayClass_'+id+'" class="myPar_Display ui-inst-del-item clearfix">'+
				    '<span class="ui-inst-del-toggle-add ui-inst-del-toggle-hide" '+_$id+'myid="'+id+'"></span>'+
				    '<div index="0" class="ui-inst-del-text-wrap ">'+
				        '<span class="delMe ui-inst-del-del-icon skin-link-del-new" type="a" '+_$id+'data-id="'+id+'"></span>'+
				        '<span class="ui-inst-del-item-text" title="'+text+'">'+text+'</span>'+
				    '</div>'+
				'</div>';
				return modelDisplayPar2;
			}
			function middleDisplayBox(id){
				var middleDisplayBox = '<div id="'+_$id+'mDisplayClass_'+id+'" class="padleft20"></div>';
				return middleDisplayBox;
			}
			function modelDisplayChild(id,text,parentid){
				var modelDisplayChild = '<div id="'+_$id+'bDisplayClass_'+id+'" class="myChild_Display ui-inst-del-item clearfix">'+
				    '<span class="ui-inst-del-toggle-add ui-inst-del-toggle-hide"></span>'+
				    '<div index="0" class="ui-inst-del-text-wrap">'+
				        '<span class="delMe ui-inst-del-del-icon skin-link-del-new" type="b" '+_$id+'data-id="'+id+'" '+_$id+'data-parent-id="'+parentid+'"></span>'+
				        '<span class="ui-inst-del-item-text" title="'+text+'">'+text+'</span>'+
				    '</div>'+
				'</div>';
				return modelDisplayChild;

			}
			/************************
			*
			*display action
			*
			************************/
			//hover
			function dHover(action,obj){
				if (action == "mouseover") {
					$(document).on(action,"#"+options.displayBoxId+" "+obj,function(){
				    	$(this).addClass("ui-inst-del-item-hover");
					})
				}
				if(action == "mouseout"){
					$(document).on(action,"#"+options.displayBoxId+" "+obj,function(){
				    	$(this).removeClass("ui-inst-del-item-hover");
					})
				}
				
			}
			dHover("mouseover",".myPar_Display");
			dHover("mouseout",".myPar_Display");
			dHover("mouseover",".myChild_Display");
			dHover("mouseout",".myChild_Display");
			//tooggle
			$(document).on("click","div[id^='"+_$id+"aDisplayClass'] > span",function(){
			    var $this = $(this);
			    var $parent = $this.parent(".myPar_Display");
				$parent.toggleClass("ui-inst-del-open");
				var boxId = $this.attr(_$id+"myid");
				if($("#"+_$id+"mDisplayClass_"+boxId)){
					$("#"+_$id+"mDisplayClass_"+boxId).toggle();
				}
				return false;
			});
			//click
			$(document).on("click",".delMe",function(){
				var $this = $(this);
				var $type = $this.attr("type");
				if($type == "a"){		//delete class A
					var $dataid = $this.attr(_$id+"data-id");
					$("#"+_$id+"aDisplayClass_"+$dataid).remove();
					$("#"+_$id+"mDisplayClass_"+$dataid).remove();
					$("#"+_$id+"aClass_"+$dataid).removeClass("ui-multi-column-select-list-item-selected");
					$("#"+_$id+"mClass_"+$dataid+" > div").removeClass("ui-multi-column-select-list-item-selected");
				}else if($type == "b"){	//delete class B
					var $id = $this.attr(_$id+"data-id");
					var $parentid = $this.attr(_$id+"data-parent-id");
					$("#"+_$id+"bDisplayClass_"+$id).remove();
					$("#"+_$id+"aClass_"+$parentid).removeClass("ui-multi-column-select-list-item-selected");
					$("#"+_$id+"bClass_"+$id).removeClass("ui-multi-column-select-list-item-selected");
					//if all deleted
					if(!$("#"+_$id+"mDisplayClass_"+$parentid).html()){
						$("#"+_$id+"mDisplayClass_"+$parentid).remove();
						$("#"+_$id+"aDisplayClass_"+$parentid).remove();
					}
				}
			})
			//reset
			$("#"+options.deleteId).click(function(){
				$("#"+options.displayBoxId).html("");
				$("div[id^='"+_$id+"aClass_'],div[id^='"+_$id+"bClass_']").removeClass("ui-multi-column-select-list-item-selected")
			})
			//call
			for (var i = options.checkArray.length - 1; i >= 0; i--) {
				if($("#"+_$id+"aClass_"+options.checkArray[i]).length){
					$("#"+_$id+"aClass_"+options.checkArray[i]).click();
				}else if($("#"+_$id+"bClass_"+options.checkArray[i]).length){
					$("#"+_$id+"bClass_"+options.checkArray[i]).click();
				}
			}
			
		}
	}
	
})(jQuery);