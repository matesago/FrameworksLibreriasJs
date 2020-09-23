 $(document).ready(function(){
	 var nHorizontales = 0,
	     nVerticales = 0,
	     nuevaBusqueda = 0,
	     lencolum = ["","","","","","",""],
	     lenrest = ["","","","","","",""],
	     maximo = 0,
	     matriz = 0,
	     intervalo = 0,
	     eliminar = 0,
	     nuevosDulces = 0,
	     tiempo = 0,
	     i = 0,
	     contadorTotal = 0,
	     espera = 0,
	     score = 0,
	     mov = 0,
	     min = 2,
		 seg = 0
		 
     //----------------------------------------------------------------------------------------------
	 $(".btn-reinicio").click(function(){
		 i = 0;
		 score = 0;
		 mov = 0;
		 $(".panel-score").css("width","25%");
		 $(".panel-tablero").show();
		 $(".time").show();
		 $("#score-text").html("0");
		 $("#movimientos-text").html("0");
		 $(this).html("Reiniciar")
		 clearInterval(intervalo);
		 clearInterval(eliminar);
		 clearInterval(nuevosDulces);
		 clearInterval(tiempo);
		 min = 2;
		 seg = 0;
		 vaciarTablero();
		 intervalo=setInterval(function(){
		 	 llenarTablero()
		 },600);
		 tiempo=setInterval(function(){
		 	 conteoRegresivo()
		 },1000);		
	 })
     /* ----------------------------------------------------------------------------------------*/
	 function llenarTablero(){
		i = i + 1
		 var numero = 0;
		 var imagen = 0;
		 $(".elemento").draggable({disabled:true});
		 if(i < 8 ){
		  	 for(var j = 1;j < 8; j++){
				 if($(".col-"+j).children("img:nth-child("+i+")").html() == null){
					 numero=Math.floor(Math.random() * 4) + 1;
					 imagen="image/"+numero+".png";
					 $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>").css("justify-content","flex-start")
				 }
			 }
		 }
		 if(i == 8){
			 clearInterval(intervalo);
			 eliminar=setInterval(function(){
			     eliminarImaganes()
			 },150);
	     }
	 };
     /* ----------------------------------------------------------------------------------------*/
	 function conteoRegresivo(){
		/**
		 * Cuenta regresivamente dos mimnutos, segundo por segundo, 
		 */
		 if(seg != 0){
			seg = seg-1;
		 }
		 if(seg == 0){
			if(min == 0){
				clearInterval(eliminar);
				clearInterval(nuevosDulces);
				clearInterval(intervalo);
				clearInterval(tiempo);
				$(".panel-tablero").hide("drop","slow",animacion);
				$(".time").hide();
			 }
			 seg = 59;
			 min = min - 1;
		 }
		$("#timer").html("0" + min + ":" + seg);
	 };
     /* ----------------------------------------------------------------------------------------*/
	 function animacion(){
		 /**
		 * Animación para los movimientos
		 */
		 $( ".panel-score" ).animate({width:'100%'},3000);
		 $(".termino").css({"display":"block","text-align":"center"});
	 };
     /* ----------------------------------------------------------------------------------------*/
	 function vaciarTablero(){
		 /**
		 * Borrar todas las imágenes del tablero
		 */
		 for(var j=1;j<8;j++){
			$(".col-"+j).children("img").detach();
		 }
	 };

	 /* ----------------------------------------------------------------------------------------*/
	 function eliminarImaganes(){
		 /**
		  * Eliminar las imagenes
		  */
		 matriz=0;
		 nHorizontales=busquedaHorizontal();
		 nVerticales=busquedaVertical();
		 for(var j = 1;j < 8; j++){
			 matriz=matriz+$(".col-"+j).children().length;
		 }
			
		 //Condicional si no encuentra 3 dulces o más, llamamos a la función para volver a completar el juego
		 if(nHorizontales == 0 && nVerticales == 0 && matriz != 49){
			 clearInterval(eliminar);
			 nuevaBusqueda = 0;
			 nuevosDulces = setInterval(function(){
				 nuevosdulces()
			 },600);
		 }

		 if(nHorizontales == 1||nVerticales == 1){
			 $(".elemento").draggable({disabled:true});
			 $("div[class^='col']").css("justify-content","flex-end");
			 $(".activo").hide("pulsate",1000,function(){
				 var scoretmp=$(".activo").length;
				 $(".activo").remove("img");
				 score=score+scoretmp*10;
				 $("#score-text").html(score);//Cambiamos la puntuación
			 });
		}
		 if(nHorizontales == 0 && nVerticales == 0 && matriz == 49){
			 $(".elemento").draggable({
				 disabled:false,
				 containment:".panel-tablero",
				 revert:true,
				 revertDuration:0,
				 snap:".elemento",
				 snapMode:"inner",
				 snapTolerance:40,
				 start:function(event,ui){
					 mov=mov+1;
					 $("#movimientos-text").html(mov);}
			 });
		 }
		 $(".elemento").droppable({
			 drop:function (event,ui){
				 var dropped = ui.draggable;
				 var droppedOn = this;
				 espera = 0;
				 do{
					espera = dropped.swap($(droppedOn));
				 }while(espera == 0);
				 nHorizontales=busquedaHorizontal();
				 nVerticales=busquedaVertical();
				 if(nHorizontales == 0 && nVerticales == 0){
					 dropped.swap($(droppedOn));
				 }
				 if(nHorizontales == 1 || nVerticales == 1){
					 clearInterval(nuevosDulces);
					 clearInterval(eliminar);
					 eliminar=setInterval(function(){
						 eliminarImaganes()
					 },150);
				 }
			 },
		 });
	 };
	 //----------------------------------------------------------------------------------------------
	 jQuery.fn.swap=function(b){
		 /**
		 * Intercambia las imagenes
		 */
		 b = jQuery(b)[0];
		 var a = this[0];
		 var t = a.parentNode.insertBefore(document.createTextNode(''),a);
		 b.parentNode.insertBefore(a,b);
		 t.parentNode.insertBefore(b,t);
		 t.parentNode.removeChild(t);
		 return this;
	 };
	 //----------------------------------------------------------------------------------------------
	 function nuevosdulces(){
		 /**
		 * Crear nuevas imágenes en la medida en que se van eliminando
		 */
		 $(".elemento").draggable({disabled:true});
		 $("div[class^='col']").css("justify-content","flex-start")
		 for(var j = 1; j < 8; j++){
			 lencolum[j-1]=$(".col-"+j).children().length;
		 }
		 if (nuevaBusqueda == 0){
			 for(var j = 0; j < 7; j++){
				 lenrest[j]=(7-lencolum[j]);
			 }
			 maximo = Math.max.apply(null,lenrest);
			 contadorTotal=maximo;}
		 if(maximo != 0){
			 if(nuevaBusqueda == 1){
				for(var j=1;j<8;j++){
					 if(contadorTotal>(maximo-lenrest[j-1])){
						$(".col-"+j).children("img:nth-child("+(lenrest[j-1])+")").remove("img");
					 }
				 }
			 }
			 if(nuevaBusqueda == 0){
				 nuevaBusqueda=1;
				 for(var k = 1; k < 8; k++){
					 for(var j=0;j<(lenrest[k-1]-1);j++){
						$(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>");
					 }
				 }
			 }
			 for(var j = 1;j < 8;j++){
				 if(contadorTotal > (maximo-lenrest[j-1])){
					numero=Math.floor(Math.random()*4)+1;
					imagen="image/"+numero+".png";
					$(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>");
				 }
			 }
		 }
		 if(contadorTotal == 1){
			 clearInterval(nuevosDulces);
			 eliminar=setInterval(function(){
				 eliminarImaganes()
			 },150);
		 }
		 contadorTotal = contadorTotal - 1;
	 };
     //----------------------------------------------------------------------------------------------
	 function busquedaHorizontal(){
		 /**
		 * Búsqueda hprozpntal de imágenes o dulces que sean iguales en grupos de minimo 3
		 */
		 var horizontalesEncontrados = 0;
		 for(var j = 1; j < 8; j++){
			for(var k = 1;k < 6; k++){
				 var res1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src");
				 var res2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src");
				 var res3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src");
				 if((res1 == res2) && (res2 == res3) && (res1 != null) && (res2 != null) && (res3 != null)){
					 $(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
					 $(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
					 $(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo");
					 horizontalesEncontrados = 1;
				}
			}
		 }
		 return horizontalesEncontrados;
	 };
     //----------------------------------------------------------------------------------------------
	 function busquedaVertical(){
		/**
		 * Búsqueda hprozontal de imágenes o dulces que sean iguales en grupos de minimo 3
		 */
		 var verticalesEncontrados = 0;
		 for(var l = 1; l < 6; l++){
			 for(var k = 1;k < 8;k++){
				 var res1=$(".col-"+k).children("img:nth-child("+l+")").attr("src");
				 var res2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src");
				 var res3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src");
				 if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
					 $(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo");
					 $(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo");
					 $(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo");
					 verticalesEncontrados=1;
				 }
			 }
		 }
		 return verticalesEncontrados;
	 };
 });