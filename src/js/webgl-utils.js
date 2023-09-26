WebGLUtils = function() {

  /**
   * 실패 메시지를 위한 HTML 생성 (msg 문자열 실패메시지)
   * @param {string} canvasContainerId canvasContainerId 
   * @return {string} HTML
   */
  var makeFailHTML = function(msg) {
    return '' +
      '<table style="background-color: #8CE; width: 100%; height: 100%;"><tr>' +
      '<td align="center">' +
      '<div style="display: table-cell; vertical-align: middle;">' +
      '<div style="">' + msg + '</div>' +
      '</div>' +
      '</td></tr></table>';
  };
  
  /**
   * webgl browser 가져오기 위한 문자열 
   * @type {string}
   * WebGL을 지원하지 않는 브라우저의 경우 표시 (업그레이드 링크 포함)
   */
  var GET_A_WEBGL_BROWSER = '' +
    'This page requires a browser that supports WebGL.<br/>' +
    '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';
  
  /**
   * 하드웨어 조건 확인 및 실패 메시지 제공
   * @type {string}
   */
  var OTHER_PROBLEM = '' +
    "It doesn't appear your computer can support WebGL.<br/>" +
    '<a href="http://get.webgl.org/troubleshooting/">Click here for more information.</a>';
  
  /**
   * WebGL context를 생성하는 함수 - setupWebGL를 정의
   * 생성이 실패하면 <canvas> 태그의 컨테이너 내용을 WebGL에 대한 올바른 링크를 포함한 오류 메시지로 변경
   * @param {Element} canvas. 컨텍스트를 생성할 canvas 요소
   * @param {WebGLContextCreationAttirbutes} opt_attribs 생성 시 전달할 선택적인 속성
   * @param {function:(msg)} opt_onError 생성 중 오류가 발생할 경우 호출할 함수
   * @return {WebGLRenderingContext} 생성된 컨텍스트
   */
  
    var setupWebGL = function(canvas, opt_attribs, opt_onError) {
    function handleCreationError(msg) { //오류 처리
      var container = canvas.parentNode; //웹 페이지의 UI에 오류 메시지를 표시하기 위해서는 오류 메시지를 <canvas> 대신에 부모 요소인 컨테이너에 표시
      if (container) {
        var str = window.WebGLRenderingContext ? 
             OTHER_PROBLEM :
             GET_A_WEBGL_BROWSER; //WebGL 지원이 없을 경우 
        if (msg) {
          str += "<br/><br/>Status: " + msg;
        }
        container.innerHTML = makeFailHTML(str); 
      }
    };
  
    opt_onError = opt_onError || handleCreationError; //opt_onError가 주어지지 않으면 기본으로 handleCreationError 사용
  
    if (canvas.addEventListener) { //canvas가 이벤트리스너를 지원하는 경우
      canvas.addEventListener("webglcontextcreationerror", function(event) { //오류 이벤트에 대한 리스너 등록
            opt_onError(event.statusMessage); 
          }, false);
    }
    var context = create3DContext(canvas, opt_attribs); //webgl context 생성 
    if (!context) { //없으면 오류
      if (!window.WebGLRenderingContext) {
        opt_onError("");
      }
    }
    return context;
  };
  
  /**
   * webgl context 생성
   * @param {!Canvas} canvas canvas WebGL 컨텍스트를 가져올 Canvas 태그입니다. 만약 전달되지 않으면 새로운 Canvas 태그가 생성
   * @return {!WebGLContext} 생성된 컨텍스트
   */
  //<canvas> 요소에서 WebGL 컨텍스트를 가져오거나 생성하고, 해당 컨텍스트를 반환
  var create3DContext = function(canvas, opt_attribs) {
    //다양한 컨텍스트 타입 시도
    //함수는 각 이름을 시도하고, 해당 컨텍스트를 가져오는 데 성공하면 반복문을 종료하고 컨텍스트를 반환
    var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var context = null;
    for (var ii = 0; ii < names.length; ++ii) {
      try {
        context = canvas.getContext(names[ii], opt_attribs); //canvas의 메소드 getContext 이용
      } catch(e) {}
      if (context) {
        break;
      }
    }
    return context;
  }
  // 함수와 변수를 캡슐화
  return {
    create3DContext: create3DContext,
    setupWebGL: setupWebGL
  };
  }();
  
  /**
   *  requestAnimationFrame 함수를 사용할 수 있도록 하는 크로스 브라우저 호환성을 제공하는 코드
   *  브라우저에서 애니메이션 및 그래픽 업데이트를 위한 타이머 이벤트를 스케줄링하기 위한 기능을 제
   */
  window.requestAnimFrame = (function() {
    //지원하는 브라우저에서는 원래의 requestAnimationFrame 함수를 사용하고, 지원하지 않는 브라우저에서는 대체로 사용할 함수를 정의
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            //만약 모든 브라우저에서 지원되지 않으면, 애니메이션 프레임을 대략적으로 60FPS(프레임/초)로 시뮬레이션
             window.setTimeout(callback, 1000/60);
           };
  })();
  
  