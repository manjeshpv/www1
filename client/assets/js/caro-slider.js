/**
 * Created by I5 6tg on 11/15/2016.
 */
jQuery(document).ready(function ($) {

    var jssor_1_options = {
        $AutoPlay: true,
        $AutoPlaySteps: 1,
        $SlideDuration: 260,
        $SlideWidth: 200,
        $SlideSpacing: 3,
        $Cols: 4,
        $ArrowNavigatorOptions: {
            $Class: $JssorArrowNavigator$,
            $Steps: 4
        },
        $BulletNavigatorOptions: {
            $Class: $JssorBulletNavigator$,
            $SpacingX: 1,
            $SpacingY: 1
        }
    };

    var jssor_1_slider = new $JssorSlider$("jssor_1", jssor_1_options);


    /*responsive code begin*/
    /*you can remove responsive code if you don't want the slider scales while window resizing*/
    function ScaleSlider() {
        var refSize = jssor_1_slider.$Elmt.parentNode.clientWidth;
        if (refSize) {
            refSize = Math.min(refSize, 1400);
            jssor_1_slider.$ScaleWidth(refSize);
        }
        else {
            window.setTimeout(ScaleSlider, 30);
        }
    }
    ScaleSlider();
    $(window).bind("load", ScaleSlider);
    $(window).bind("resize", ScaleSlider);
    $(window).bind("orientationchange", ScaleSlider);

  var jssor_2_slider = new $JssorSlider$("jssor_2", jssor_1_options);
  function ScaleSlider1() {
    var refSize = jssor_2_slider.$Elmt.parentNode.clientWidth;
    if (refSize) {
      refSize = Math.min(refSize, 1400);
      jssor_2_slider.$ScaleWidth(refSize);
    }
    else {
      window.setTimeout(ScaleSlider, 30);
    }
  }
  ScaleSlider1();
  $(window).bind("load", ScaleSlider1);
  $(window).bind("resize", ScaleSlider1);
  $(window).bind("orientationchange", ScaleSlider1);
    /*responsive code end*/
});
