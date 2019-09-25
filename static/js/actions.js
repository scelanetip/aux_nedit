
//function to upload an image and display on screen
$(function () {
$("#files").click(function(e) {

    $(":file[name=initFile]").change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {

                $('#myImg').attr('src', e.target.result);
            };
            reader.readAsDataURL(this.files[0]);
            $("#init").hide();
            $("#home").show();
        }
    });
});
});

var canvasID, initWidth, initHeight = 0;

//function to handle SAVE IMAGE button
$(function () {
    $('#share').click(function(e){
        html2canvas(document.body).then(canvas => {
            $(canvas).attr({
                id: "myCanvas"
                }).css({
                height: '100%',
                width: '100%',
                position: 'absolute',
                zIndex: '90',
                boxSizing: 'border-box',
                background: 'slategrey'
            })

            var link = document.createElement("a");

            link.download = "canvas-to-image";
            link.href = canvas.toDataURL("image/png;base64");
            /// create a "fake" click-event to trigger the download
            if (document.createEvent) {
                e = document.createEvent("MouseEvents");
                e.initMouseEvent("click", true, true, window,
                                 0, 0, 0, 0, 0, false, false, false,
                                 false, 0, null);

                link.dispatchEvent(e);
            } else if (link.fireEvent) {
                link.fireEvent("onclick");
            }
        });

    });

});


//function to select a screen and make it appear over the image
$(function () {
$('.screen').click(function(e){

    divID =$('.canvas-div').length;

    var elementID = 'canvas-div' + divID; // Unique ID
    var delementID = 'div' + divID;
    var celementID = 'canvas' + divID;


    $('<div>').attr({
        id: delementID,
        class: 'canvas-div'
    }).css({
        height: '10vw',
        width: '15%',
        position: 'absolute',
        zIndex: 80,
        left: '26%' ,
        top: '22%',
        border: '7px solid transparent'
    }).appendTo('#workspace').draggable({ disabled: true });

    $('<div>').attr({
        id: elementID,
        class: 'canvas-border'
    }).css({
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        position: 'absolute',
        height: '100%',
        width: '100%',
        border: '10px solid rgb(61, 64, 68)',
        boxSizing: 'border-box',
        background: 'slategrey'
    }).appendTo('#'+delementID);

    var container = $('#div' + divID);
    $('<div>').attr({
        class: "pt tl"
    }).appendTo(container);
    $('<div>').attr({
        class: "pt tr"
    }).appendTo(container);
    $('<div>').attr({
        class: "pt bl"
    }).appendTo(container);
    $('<div>').attr({
        class: "pt br"
    }).appendTo(container);

    if ($(this).attr("id") == "grid"){
        console.log("grid");
        for (i=0; i<4; i++) {
            $('<div>').attr({
                id: 'grid'+i+elementID,
                class: 'grid'
            }).css({

                position: 'relative',
                width: '50%',

                boxSizing: 'border-box',
                height: '50%',
                border: '10px solid rgb(61, 64, 68)',
                zIndex: 3,
                background: 'transparent'
                //background: 'red'

            }).appendTo('#'+elementID);
        }


    }


    unperspective();

    initWidth = container.width();
    initHeight = container.height();

    //call menu action function with drag by default

    activateMenu("drag");

    $(".screen").each(function() {
        $(this).css('border', '8px solid transparent');
        $(this).attr("selected",false);

    });
    $(this).css('border', '8px solid #03a9f4');
    $(this).attr("selected",true);
    });
});

//Manage click on different TVS
$(document).ready(function() {

    $(document).on("click", ".canvas-div", function (event) {
        event.preventDefault();
        //canvasID = $(this).attr('id');
        var matches = ($(this).attr('id')).match(/(\d+)/);
        canvasID = matches[0];
        $(".canvas-div").each(function() {
            $(this).css('border', '7px solid transparent');
        });
        $("#div"+ canvasID).css('border', '7px dashed #03a9f4');

        //activateMenu("drag");
    });

});

//function to manage action menu

function activateMenu(action) {

    $("#action-menu").show();
    $(".menu").each(function() {
        $(this).css('background-color', '#fff');
        $(this).css('color', '#03a9f4')
        $(this).attr("selected",false);
    });
    $("#" + action).attr("selected",true);
    $("#" + action).css('background-color', '#03a9f4');
    $("#" + action).css('color', '#fff');

    var slidecontainer = $(".slidecontainer");
    var contentcontainer = $(".content-container");


    switch(action){
        case 'delete':
            slidecontainer.hide();
            contentcontainer.hide();
            unperspective();
            $("#div"+ canvasID).draggable({disabled: true});
            $("#div"+ canvasID).remove();
            $("#canvas-div"+ canvasID).remove();

            break;
        case 'drag':
            $("#div"+ canvasID).draggable({disabled: false});
            slidecontainer.hide();
            contentcontainer.hide();
            unperspective();
            break;
        case 'resize':
            $("#div"+ canvasID).draggable({disabled: true});
            slidecontainer.show();
            contentcontainer.hide();
            resize(canvasID);
            unperspective();
            break;
        case 'perspective':
            $("#div"+ canvasID).draggable({disabled: true});
            slidecontainer.hide();
            contentcontainer.hide();
            perspective();
            break;
        case 'content':
            $("#div"+ canvasID).draggable({disabled: true});
            slidecontainer.hide();
            unperspective();
            contentcontainer.show();
            addContent();
            break;
        default:
            $("#div"+ canvasID).draggable({disabled: false});
            slidecontainer.hide();
            contentcontainer.hide();
            unperspective();
            break;
        }

}

//onclick control in action menu

$(function () {
$('.menu').click(function(e){
    action = $(this).attr('id');
    activateMenu(action);
    });
});

//RESIZE FUNCTION
function resize(){
    var ranger = $("#myRange");
    var width = initWidth;
    var height = initHeight;

    ranger.change(function(){
        var image =  $("#div"+ canvasID);

        width = image.width();
        height = image.height();

        image.width(initWidth * (ranger.val() / 50));
        image.height( initHeight * (ranger.val() / 50));

    });
}


//PERSPECTIVE FUNCTIONS
function unperspective(){
var pts = $(".pt");
pts.hide();
}

function perspective(){
    var elementID = "#canvas-div" + canvasID;
    var x = $(elementID).position();
    //var container = $("#workspace");
    var container = $('#div' + canvasID);
    var img = $(elementID);
    //var img = $("#image-section");

    var pts = $('#div' + canvasID).find(".pt");

    var IMG_WIDTH = $(elementID).width();
    var IMG_HEIGHT = $(elementID).height();

//    var IMG_WIDTH = $("#image-section").width();
//    var IMG_HEIGHT = $("#image-section").height();
    pts.show();


    var transform = new PerspectiveTransform(img[0], IMG_WIDTH, IMG_HEIGHT, true);
    var tl = pts.filter(".tl").css({
        left : transform.topLeft.x,
        top : transform.topLeft.y
    });
    var tr = pts.filter(".tr").css({
        left : transform.topRight.x,
        top : transform.topRight.y
    });
    var bl = pts.filter(".bl").css({
        left : transform.bottomLeft.x,
        top : transform.bottomLeft.y
    });
    var br = pts.filter(".br").css({
        left : transform.bottomRight.x,
        top : transform.bottomRight.y
    });
    var target;
    var targetPoint;

    function onMouseMove(e) {
        $("#div"+ canvasID).css('border', '7px solid transparent');
        targetPoint.x = e.pageX - container.offset().left ;
        targetPoint.y = e.pageY - container.offset().top ;
//        console.log(targetPoint.x,targetPoint.y);
        target.css({
            left : targetPoint.x,
            top : targetPoint.y
        });

        // check the polygon error, if it's 0, which mean there is no error
        if(transform.checkError()==0){
            transform.update();
            img.show();
        }else{
            console.log(transform.checkError())
            img.hide();
        }
    }

    pts.mousedown(function(e) {
        target = $(this);
        targetPoint = target.hasClass("tl") ? transform.topLeft : target.hasClass("tr") ? transform.topRight : target.hasClass("bl") ? transform.bottomLeft : transform.bottomRight;
        onMouseMove.apply(this, Array.prototype.slice.call(arguments));
        $(window).mousemove(onMouseMove);
        $(window).mouseup(function() {
            $(window).unbind('mousemove', onMouseMove);
        })
    });
}


//ADD CONTENT FUNCTION
function addContent(){

    $("#canvas-div"+ canvasID).css('background', 'url(http://blog.angeloff.name/compass-canvas/assets/images/example-2.png)');
    $(":file").change(function () {
        if (this.files && this.files[0]) {


            var celementID = 'canvas-div' + canvasID;

            filename = this.files[0].name;
            var re = /(?:\.([^.]+))?$/;
            var ext = re.exec(filename)[1];

            if (ext=="png" || ext=="jpeg" || ext=="jpg") {
                $('#video'+canvasID).remove();
                $('#img'+canvasID).remove();

                $('<img>').attr({
                    id: "img"+canvasID,
                    src: "static/"+ filename
                }).css({
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    left: '0',
                    boxSizing: 'border-box',
                    zIndex: 2
                }).appendTo('#canvas-div' + canvasID);
            }else{
                $('#video'+canvasID).remove();
                $('#img'+canvasID).remove();
                $('<video>').attr({
                    id: "video"+canvasID
                }).css({
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    left: '0',
                    boxSizing: 'border-box',
                    border: '10px solid transparent',
                    zIndex: 2
                }).appendTo('#canvas-div' + canvasID);


                $('<source>').attr({
                    src: "static/"+ filename,
                    type: "video/mp4"
                }).appendTo('#video'+canvasID);


                $('#video'+canvasID)[0].autoplay = true;
                $('#video'+canvasID)[0].controls = true;
                $('#video'+canvasID)[0].loop = true;

                $("#canvas-div"+ canvasID).css('background', 'black');

            }

        }
    });
}
