var photoflkMgr={
flkPhotoArr:[],
showFlkPhoto:function(item_photo){
	photoflkMgr.flkPhotoArr=item_photo;
	$("#photo .close").html('&times;');
	$("#photo").append('<div id="FlkPhotoContainer"><div>');
	var photostr="";
	for(var i=0;i<photoflkMgr.flkPhotoArr.length;i++){
		photostr+='<img src="'+photoflkMgr.flkPhotoArr[i]+'"/>';
	}
	 $("#FlkPhotoContainer").append(photostr);
	 //alert(photostr);
	 //接下来就展示图片浏览的插件
	 jQuery(function(){
		$('#FlkPhotoContainer').fotorama({
        width: 800, // Width of container
        height: 600, // Height of container
        startImg: 10, // Initial image
        transitionDuration: 400, // Duration of transition
        touchStyle: false, // 如果要设置成可以拖拽的话，那sortable就不能拖拽了
        // pseudoClick: true, // Slide between images by click (if touchStyle = true)
        loop: true, // Loop for images (if touchStyle = false)
        // backgroundColor: null, // Custom background color
        margin: 10, // Margin between images
        // minPadding: 10, // Min padding
        // alwaysPadding: false, // Apply padding for images
         preload: 3, // Amount of pre-loaded images from each end of the active image
         //resize: false, // Resize images
        // zoomToFit: true, // Zoom to fit
        // cropToFit: false, // Crop to fit
        // vertical: false, // Vertical thumbs
        // verticalThumbsRight: false, // Vertical thumbs at right
        // arrows: true, // Draw arrows
        arrowsColor: '#3399cc', // Arrows color
        thumbs: true, // Draw thumbs
        // thumbsBackgroundColor: null, // Thumbs Background Color
        // thumbColor: null, // Thumb Color
        // thumbsPreview: true, // Thumb Preview
        thumbSize: 50, // Thumb size (height)
        // thumbMargin: 5, // Thumb margins
        thumbBorderWidth: 1, // Thumb border width
        // thumbBorderColor: null, // Thumb Border Color
        caption: true // Display captions
        //html: "aaa"  // You can full html code of gallery here
        // onShowImg: null, // Custom function when we select image
		//onShowImg:function(){
		//	alert("11");
		//},
        // shadows: true // Display shadows
    });
	});
	var photoLeft=$("#rssContain").width()/2-400;
	var photoTop=$(window).height()/2-300;
	$("#photo").css({
		position:"absolute",
		left:photoLeft,
		top:photoTop,
		zIndex:100,
		display:"block"
	});
	$("#photo").show();
	//绑定关闭事件
	$("#photo .close").bind("click",function(event){
		event.preventDefault();
		$("#overlay").hide();
		$("#photo").hide();
	});
	//$(".rsscon").sortable("refresh");
}
}