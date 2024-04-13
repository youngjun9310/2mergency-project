navigator.geolocation.getCurrentPosition(function (pos) {
    latitude = pos.coords.latitude;
    longitude = pos.coords.longitude;
    moveMapTo(latitude, longitude);
    posmarkers(latitude, longitude);
})

var map = new Tmapv2.Map("map_div", { // 지도가 생성될 div
center: new Tmapv2.LatLng(37.5694466853466, 126.97611808776898),    // 지도의 중심좌표
width : "750px", // 지도의 넓이
height : "750px", // 지도의 높이
zoom : 15, // 지도의 줌레벨
httpsMode: true,    // https모드 설정
})

function moveMapTo(latitude, longitude) {
  var newPosition = new Tmapv2.LatLng(latitude, longitude);
  map.setCenter(newPosition);
}

// 지도 타입 변경: ROAD
map.setMapType(Tmapv2.Map.MapType.ROAD);
/* API시작 */
// 마커 초기화
let markerStart = null;
var markerEnd = null;
var markerWp = [];
var markerPoi = [];
var markerPoint = [];
var markerArr = [], lineArr = [], labelArr = [];
var marker1 = new Tmapv2.Marker({
icon : "https://cdn.icon-icons.com/icons2/1189/PNG/512/1490793853-user-interface22_82349.png",
iconSize : new Tmapv2.Size(24, 38),
map : map
});
var marker2 = null;
var tData = new Tmapv2.extension.TData();


// (장소API) 주소 찾기
//경로 탐색 우클릭 시 인접도로 검색
map.addListener("contextmenu", function onContextmenu(evt) {
var mapLatLng = evt.latLng;
//기존 마커 삭제
marker1.setMap(null);
var markerPosition = new Tmapv2.LatLng(
        mapLatLng._lat, mapLatLng._lng);
//마커 올리기
marker1 = new Tmapv2.Marker({
    position : markerPosition,
    // icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_p.png",
    iconHTML: `
    <div class='_t_marker' style="position:relative;" >
        <img src="https://cdn.icon-icons.com/icons2/1189/PNG/512/1490793853-user-interface22_82349.png" style="width:48px;height:48px;position:absolute;"/>
        <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 8px;line-height: 19px;">
        P</div>
    </div>
    `,
    offset: new Tmapv2.Point(24, 38),
    iconSize : new Tmapv2.Size(24, 38),
    map : map
});
var lon = mapLatLng._lng;
var lat = mapLatLng._lat;
if(labelArr.length > 0){
    for(var i in labelArr){
        labelArr[i].setMap(null);
    }
    labelArr = [];
}
// poi 마커 지우기
if(markerPoi.length > 0){
    for(var i in markerPoi){
        markerPoi[i].setMap(null);
    }
    markerPoi = [];
}
var params = {
    appKey : 'WriPLFWas18xUYsFCelxl1og5A9pHFRd2yf11y1U',
    lon,
    lat
}
const option = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(params),
};
$.ajax({
    method:"GET",
    url:"https://apis.openapi.sk.com/tmap/road/nearToRoad?version=1",//가까운 도로 찾기 api 요청 url입니다.
    async:false,
    data:{
        appKey : "l7xx846db5f3bc1e48d29b7275a745d501c8",
        lon,
        lat
    },
    success:function(response){
        
        var resultHeader, resultlinkPoints;
        
        if(response.resultData.header){
            resultHeader = response.resultData.header;
            resultlinkPoints = response.resultData.linkPoints;
            
            var tDistance = resultHeader.totalDistance;
            var tTime = resultHeader.speed;	
            var rName = resultHeader.roadName;
            
            
            // 기존 라인 지우기
            if(lineArr.length > 0){
                for(var k=0; k<lineArr.length ; k++){
                    lineArr[k].setMap(null);
                }
                //지운뒤 배열 초기화
                lineArr = [];
            }
            
            var drawArr = [];
            
            // Tmapv2.LatLng객체로 이루어진 배열을 만듭니다.
            for(var i in resultlinkPoints){
                var lineLatLng = new Tmapv2.LatLng(resultlinkPoints[i].location.latitude, resultlinkPoints[i].location.longitude);
                
                drawArr.push(lineLatLng);
            }
            
            //그리기
            var polyline_ = new Tmapv2.Polyline({
                    path : drawArr,	//만든 배열을 넣습니다.
                    strokeColor : "#FF0000",
                    strokeWeight: 6,
                    map : map
            });
            
            //라인 정보를 배열에 담습니다.
            lineArr.push(polyline_);
            let resultStr = `
                <div class="_result_panel_bg">
                    <div class="_result_panel_area">
                        <div class="__reverse_geocoding_result" style="flex-grow: 1;" id="content">
                            <p class="_result_text_line">총거리 : ${tDistance}m</p>
                            <p class="_result_text_line">제한속도 : ${tTime}km/h</p>
                            <p class="_result_text_line">도로명 : ${rName}</p>
                            <p class="_result_text_line"></p>
                        </div>
                        <div>
                            <div class="_search_item_button_panel" id="footer">
                                    <div class="_search_item_button" id="footer_button">
                                        <button onclick="enterDest('start', '${rName}', '${lon}', '${lat}');">출발</button>
                                    </div>
                                    <div class="_search_item_button" id="footer_button">
                                        <button onclick="enterDest('end', '${rName}', '${lon}', '${lat}');">도착</button>
                                    </div>
                                        <div class="_search_item_button" id="footer_button">
                                            <button onclick="enterDest('wp', '${rName}', '${lon}', '${lat}');">경유</button>
                                        </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            var resultDiv = document.getElementById("apiResult");
            resultDiv.innerHTML = resultStr;
            
        }else{
            $("#result").text("가까운 도로 검색 결과가 없습니다.");
        }
    },
    error:function(request,status,error){
        console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
    }
});
// tData.getAddressFromGeoJson(lat, lon, optionObj, params);
});
map.addListener("click", function onClick(evt) {
var mapLatLng = evt.latLng;
//기존 마커 삭제
marker1.setMap(null);
// 기존 라인 지우기
if(lineArr.length > 0){
    for(var k=0; k<lineArr.length ; k++){
        lineArr[k].setMap(null);
    }
    //지운뒤 배열 초기화
    lineArr = [];
}
var markerPosition = new Tmapv2.LatLng(
        mapLatLng._lat, mapLatLng._lng);
//마커 올리기
marker1 = new Tmapv2.Marker({
    position : markerPosition,
    // icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_p.png",
    iconHTML: `
    <div class='_t_marker' style="position:relative;" >
        <img src="https://cdn.icon-icons.com/icons2/1189/PNG/512/1490793853-user-interface22_82349.png" style="width:48px;height:48px;position:absolute;"/>
        <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 8px;line-height: 19px;">
        P</div>
    </div>
    `,
    offset: new Tmapv2.Point(24, 38),
    iconSize : new Tmapv2.Size(24, 38),
    map : map
});
var lon = mapLatLng._lng;
var lat = mapLatLng._lat;

var optionObj = {
    coordType: "WGS84GEO",       //응답좌표 타입 옵션 설정 입니다.
    addressType: "A10"           //주소타입 옵션 설정 입니다.
};
var params = {
    onComplete:function(result) { //데이터 로드가 성공적으로 완료 되었을때 실행하는 함수 입니다.
        // 기존 팝업 지우기
        if(labelArr.length > 0){
            for(var i in labelArr){
                labelArr[i].setMap(null);
            }
            labelArr = [];
        }
        
        // poi 마커 지우기
        if(markerPoi.length > 0){
            for(var i in markerPoi){
                markerPoi[i].setMap(null);
            }
            markerPoi = [];
        }
        $("#searchAddress").val('');
        $("._btn_radio").removeClass('__color_blue_fill');
        var arrResult = result._responseData.addressInfo;
        var fullAddress = arrResult.fullAddress.split(",");
        var newRoadAddr = fullAddress[2];
        var jibunAddr = fullAddress[1];
        if (arrResult.buildingName != '') {//빌딩명만 존재하는 경우
            jibunAddr += (' ' + arrResult.buildingName);
        }
        let resultStr = `
        <div class="_result_panel_bg">
            <div class="_result_panel_area">
                <div class="__reverse_geocoding_result" style="flex-grow: 1;" id="content">
                    <p class="_result_text_line">새주소 : ${newRoadAddr}</p>
                    <p class="_result_text_line">지번주소 : ${jibunAddr}</p>
                    <p class="_result_text_line">좌표 (WSG84) : ${lat}, ${lon}</p>
                    <p class="_result_text_line"></p>
                </div>
                <div>
                    <div class="_search_item_button_panel" id="footer">
                            <div class="_search_item_button" id="footer_button">
                                <button onclick="enterDest('start', '${newRoadAddr}', '${lon}', '${lat}');">출발</button>
                            </div>
                            <div class="_search_item_button" id="footer_button">
                                <button onclick="enterDest('end', '${newRoadAddr}', '${lon}', '${lat}');">도착</button>
                            </div>
                                <div class="_search_item_button" id="footer_button">
                                    <button onclick="enterDest('wp', '${newRoadAddr}', '${lon}', '${lat}');">경유</button>
                                </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        
        var resultDiv = document.getElementById("apiResult");
        resultDiv.innerHTML = resultStr;
    },      
    onProgress:function() {},   //데이터 로드 중에 실행하는 함수 입니다.
    onError:function() {        //데이터 로드가 실패했을때 실행하는 함수 입니다.
        alert("onError");
    }             
};
tData.getAddressFromGeoJson(lat, lon, optionObj, params);
});
// (장소API) 통합 검색 함수
function searchPois() {
var searchKeyword = $("#searchAddress").val();
var optionObj = {
    resCoordType : "WGS84GEO",
    reqCoordType : "WGS84GEO",
    count: 10
};
var params = {
    onComplete: function(result) {
        // 데이터 로드가 성공적으로 완료되었을 때 발생하는 이벤트입니다.
        var resultpoisData = result._responseData.searchPoiInfo.pois.poi;
        // 기존 마커, 팝업 제거
        reset();
        $("._btn_radio").removeClass('__color_blue_fill');
        if(marker1) {
            marker1.setMap(null);
        }
        
        var innerHtml =    // Search Reulsts 결과값 노출 위한 변수
        `
        <div class="_result_panel_bg _scroll_padding">
            <div class="_result_panel_scroll">
        `;
        var positionBounds = new Tmapv2.LatLngBounds();        //맵에 결과물 확인 하기 위한 LatLngBounds객체 생성
        
        for(var k in resultpoisData){
            // POI 정보의 ID
            var id = resultpoisData[k].id;
            
            var name = resultpoisData[k].name;
            
            var lat = Number(resultpoisData[k].noorLat);
            var lon = Number(resultpoisData[k].noorLon);
            
            var frontLat = Number(resultpoisData[k].frontLat);
            var frontLon = Number(resultpoisData[k].frontLon);
            
            var markerPosition = new Tmapv2.LatLng(lat, lon);
            
            var fullAddressRoad = resultpoisData[k].newAddressList.newAddress[0].fullAddressRoad;
            
            const marker3 = new Tmapv2.Marker({
                position : markerPosition,
                //icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + k + ".png",
                iconHTML:`
                    <div class='_t_marker' style="position:relative;" >
                    <img src="https://cdn.icon-icons.com/icons2/317/PNG/512/map-marker-icon_34392.png" style="width:48px;height:48px;position:absolute;"/>
                    <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 15px;line-height: 19px;">
                    ${Number(k)+1}</div>
                    </div>
                `,
                iconSize : new Tmapv2.Size(24, 38),
                title : name,
                label: `<span style="display:none;">${k}_${id}</span>`,
                map:map
            });
            
            // 마커 클릭 이벤트 추가
            marker3.addListener("click", function(evt) {
                for(let tMarker of markerPoi) {
                    const labelInfo = $(tMarker.getOtherElements()).text();
                    const forK = labelInfo.split("_")[0];
                    tMarker.setIconHTML(`
                        <div class='_t_marker' style="position:relative;" >
                        <img src="https://cdn.icon-icons.com/icons2/317/PNG/512/map-marker-icon_34392.png" style="width:48px;height:48px;position:absolute;"/>
                        <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 15px;line-height: 19px;">
                        ${Number(forK)+1}</div>
                        </div>
                    `);
                     // marker z-index 초기화
                     $(tMarker.getOtherElements()).next('div').css('z-index', 100);
                }
                // 선택한 marker z-index 처리 
                $(marker3.getOtherElements()).next('div').css('z-index', 101);
                const labelInfo = $(marker3.getOtherElements()).text();
                const thisK = labelInfo.split("_")[0];
                const thisId = labelInfo.split("_")[1];
                marker3.setIconHTML(`
                    <div class='_t_marker' style="position:relative;" >
                    <img src="https://cdn.icon-icons.com/icons2/317/PNG/512/map-marker-icon_34392.png" style="width:48px;height:48px;position:absolute;"/>
                    <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 15px;line-height: 19px;">
                    ${Number(thisK)+1}</div>
                    </div>
                `);
                poiDetail(thisId, thisK);
            });
            
            innerHtml += `
                <div class="_search_item" id="poi_${k}">
                    <div class="_search_item_poi">
                        <div class="_search_item_poi_icon _search_item_poi_icon_grey">
                            <div class="_search_item_poi_icon_text">${Number(k)+1}</div>
                        </div>
                    </div>
                    <div class="_search_item_info">
                        <p class="_search_item_info_title">${name}</p>
                        <p class="_search_item_info_address">${fullAddressRoad}</p>
                        <p class="_search_item_info_address">중심점 : ${lat}, ${lon}</p>
                        <p class="_search_item_info_address">입구점 : ${frontLat}, ${frontLon}</p>
                    </div>
                    <div class="_search_item_button_panel">
                        <div class="_search_item_button __color_blue">
                            <button onclick='poiDetail("${id}", "${k}");'>상세정보</button>
                        </div>
                    </div>
                    <div class="_search_item_button_panel" id="footer">
                        <div class="_search_item_button" id="footer_button">
                            <button onclick="enterDest('start', '${name}', '${lon}', '${lat}');">출발</button>
                        </div>
                        <div class="_search_item_button" id="footer_button">
                            <button onclick="enterDest('end', '${name}', '${lon}', '${lat}');">도착</button>
                        </div>
                        <div class="_search_item_button" id="footer_button">
                            <button onclick="enterDest('wp', '${name}', '${lon}', '${lat}');">경유</button>
                        </div>
                    </div>
                </div>
                ${(resultpoisData.length-1) === Number(k) ? "": `<div class="_search_item_split"></div>`}
            `;
            markerPoi.push(marker3);
            positionBounds.extend(markerPosition);    // LatLngBounds의 객체 확장
        }
        
        innerHtml += "</div></div>";
        $("#apiResult").html(innerHtml);    //searchResult 결과값 노출
        map.panToBounds(positionBounds);    // 확장된 bounds의 중심으로 이동시키기
        map.zoomOut();
    },
    onProgress: function() {},
    onError: function(){}
}
tData.getPOIDataFromSearchJson(searchKeyword, optionObj, params);

}    

// POI 상세검색 함수
function poiDetail(poiId, thisK) {
for(let tMarker of markerPoi) {
    const labelInfo = $(tMarker.getOtherElements()).text();
    const forK = labelInfo.split("_")[0];
    tMarker.setIconHTML(`
        <div class='_t_marker' style="position:relative;" >
        <img src="https://cdn.icon-icons.com/icons2/317/PNG/512/map-marker-icon_34392.png" style="width:48px;height:48px;position:absolute;"/>
        <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 15px;line-height: 19px;">
        ${Number(forK)+1}</div>
        </div>
    `);
     // marker z-index 초기화
     $(tMarker.getOtherElements()).next('div').css('z-index', 100);
}
markerPoi[thisK].setIconHTML(`
    <div class='_t_marker' style="position:relative;" >
    <img src="https://cdn.icon-icons.com/icons2/165/PNG/256/mapmarker_marker_outside_azure_23007.png" style="width:48px;height:48px;position:absolute;"/>
    <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 15px;line-height: 19px;">
    ${Number(thisK)+1}</div>
    </div>
`);
// 선택한 marker z-index 처리 
$(markerPoi[thisK].getOtherElements()).next('div').css('z-index', 101);
var scrollOffset = $("#poi_"+thisK)[0].offsetTop - $("._result_panel_scroll")[0].offsetTop
$("._result_panel_scroll").animate({scrollTop: scrollOffset}, 'slow');
$("._result_panel_scroll ._search_item_poi_icon").removeClass("_search_item_poi_icon_blue");
$("#poi_"+thisK).find('._search_item_poi_icon').addClass("_search_item_poi_icon_blue");
// 기존 라벨 지우기
if(labelArr.length > 0){
    for(var i in labelArr){
        labelArr[i].setMap(null);
    }
    labelArr = [];
}

var optionObj = {
    resCoordType: "WGS84GEO"
}
var params = {
    onComplete: function(result) {
        // 응답받은 POI 정보
        var detailInfo = result._responseData.poiDetailInfo;
        var name = detailInfo.name;
        var bldAddr = detailInfo.bldAddr;
        var tel = detailInfo.tel;
        var bizCatName = detailInfo.bizCatName;
        var parkingString = (detailInfo.parkFlag === "0"? "주차 불가능": (detailInfo.parkFlag === "1" ? "주차 가능": ""));
        var zipCode = detailInfo.zipCode;
        var lat = Number(detailInfo.lat);
        var lon = Number(detailInfo.lon);
        var bldNo1 = detailInfo.bldNo1;
        var bldNo2 = detailInfo.bldNo2;
        
        var labelPosition = new Tmapv2.LatLng(lat, lon);
        if(bldNo1 !== "") {
            bldAddr += ` ${bldNo1}`;
        }
        if(bldNo2 !== "") {
            bldAddr += `-${bldNo2}`;
        }
        var content = `
            <div class="_tmap_preview_popup_text">
                <div class="_tmap_preview_popup_info" id="explanation">
                    <div class="_tmap_preview_popup_title">${name}</div>
                    <div class="_tmap_preview_popup_address">${bldAddr}</div>
                    <div class="_tmap_preview_popup_address">${zipCode}</div>
                    <div class="_tmap_preview_popup_address">${bizCatName}</div>
        `;
        // 상세보기 클릭 시 지도에 표출할 popup창
/*                     var content = "<div style=' border-radius:10px 10px 10px 10px;background-color:#2f4f4f; position: relative;"
                + "line-height: 15px; padding: 5 5px 2px 4; right:65px; width:150px; padding: 5px;'>"
                + "<div style='font-size: 11px; font-weight: bold ; line-height: 15px; color : white'>"
                + name
                + "</br>"
                + address 
                + "</br>"
                + bizCatName;
*/                            
        if(tel !== "") {
            content += `<div class="_tmap_preview_popup_address">${tel}</div>`;
        }
        if(parkingString !== "") {
            content += `<div class="_tmap_preview_popup_address">${parkingString}</div>`;
        }
        
        content += "</div></div>";
    
        var labelInfo2 = new Tmapv2.InfoWindow({
            position: labelPosition, //Popup 이 표출될 맵 좌표
            content: content, //Popup 표시될 text
            border:'0px solid #FF0000', //Popup의 테두리 border 설정.
            background: false,
            offset: new Tmapv2.Point(-12, -6),
            type: 2, //Popup의 type 설정.
            align: Tmapv2.InfoWindowOptions.ALIGN_CENTERTOP,
            map: map //Popup이 표시될 맵 객체
        });
/* 
        var labelInfo2 = new Tmapv2.Label({
            position : labelPosition,
            content : content,
            zIndex: 999,
            align: 'ct',
            map : map
        });
         */
        //popup 생성

        // LABEL이 마커보다 상위에 표시되도록 수정함. 
        $("#map_div ._tmap_preview_popup_text").parent().parent().css('z-index', 10);
        // popup들을 담을 배열에 팝업 저장
        labelArr.push(labelInfo2);
        
        map.setCenter(labelPosition);
    },
    onProgress: function() {},
    onError: function() {}
}
tData.getPOIDataFromIdJson(poiId,optionObj, params);
}        

// 지도에 그릴 모드 선택
var drawMode = "apiRoutesMulti_0";
// 경로 API [검색] 버튼 동작
async function apiSearchRoutes() {
marker1.setMap(null);
var startx = $("#startx").val();
var starty = $("#starty").val();
var endx = $("#endx").val();
var endy = $("#endy").val();
if($("._btn_action").hasClass('__color_grey')) {
    return false;
}
if(startx === "" || starty === "" || endx === "" || endy === "") {
    alert("정확한 주소를 입력하세요.");
    return false;
}


$("#apiResult").empty();
reset();

await routesPedestrian();
await routesCarInit();

}

// (경로API) 보행자 경로 안내 API
function routesPedestrian() {
return new Promise(function(resolve, reject) {
    // 출발지, 목적지의 좌표를 조회
    var startx = $("#startx").val();
    var starty = $("#starty").val();
    var endx = $("#endx").val();
    var endy = $("#endy").val();
    var startLatLng = new Tmapv2.LatLng(starty, startx);
    var endLatLng = new Tmapv2.LatLng(endy, endx);
    // 경유지 좌표 파라미터 생성
    var viaPoints = [];
    $(".waypoint_input").each(function(idx) {
        var pos = $(this).find("input[name='multipos']").val();
        if(pos === "") {
            return true;
        }
        var viaX = pos.split(',')[0];
        var viaY = pos.split(',')[1];
        viaPoints.push(viaX + "," + viaY);
    });
    var passList = viaPoints.join("_");
    var optionObj = {
        reqCoordType: "WGS84GEO",
        resCoordType: "WGS84GEO",
            passList: passList,
    };
    var params = {
        onComplete: function (result) {
            var resultData = result._responseData.features;
            //결과 출력
            var appendHtml = `
                <div class="_route_item" id="box1">
                    <div class="_route_item_type ${drawMode === "apiRoutesPedestrian" ? "__color_blue" : ""}" onclick="routesRedrawMap('apiRoutesPedestrian');" style="cursor:">보행자 경로 안내</div>
                    <div class="_route_item_info" onclick="routesRedrawMap('apiRoutesPedestrian');">${((resultData[0].properties.totalTime) / 60).toFixed(0)}분 | ${((resultData[0].properties.totalDistance) / 1000).toFixed(1)}km</div>
                </div>
            `;
            // $("#apiResult").append(appendHtml);
            writeApiResultHtml("apiRoutesPedestrian", appendHtml);
            if (drawMode === "apiRoutesPedestrian") {
                //기존 그려진 라인 & 마커가 있다면 초기화
                reset();
                // 시작마커설정
                markerStart = new Tmapv2.Marker({
                    position: new Tmapv2.LatLng(starty, startx),
                    // icon: "http://topopen.tmap.co.kr/imgs/start.png",
                    iconHTML: `
                    <div class='_t_marker' style="position:relative;" >
                        <img src="https://cdn.icon-icons.com/icons2/3205/PNG/512/gps_place_marker_pointer_location_pin_map_navigation_direction_icon_195752.png" style="width:48px;height:48px;position:absolute;"/>
                        <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 8px;line-height: 19px;">
                        출발</div>
                    </div>
                    `,
                    offset: new Tmapv2.Point(24, 38),
                    iconSize: new Tmapv2.Size(24, 38),
                    map: map
                });
                // 도착마커설정
                markerEnd = new Tmapv2.Marker({
                    position: new Tmapv2.LatLng(endy, endx),
                    // icon: "http://topopen.tmap.co.kr/imgs/arrival.png",
                    iconHTML: `
                    <div class='_t_marker' style="position:relative;" >
                        <img src="https://cdn.icon-icons.com/icons2/1283/PNG/512/1497619936-jd21_85172.png" style="width:48px;height:48px;position:absolute;"/>
                        <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 8px;line-height: 19px;">
                        도착</div>
                    </div>
                    `,
                    offset: new Tmapv2.Point(24, 38),
                    iconSize: new Tmapv2.Size(24, 38),
                    map: map
                });
                // markerArr.push(marker_s);
                // markerArr.push(marker_e);
                // GeoJSON함수를 이용하여 데이터 파싱 및 지도에 그린다.
                var jsonObject = new Tmapv2.extension.GeoJSON();
                var jsonForm = jsonObject.read(result._responseData);
                jsonObject.drawRoute(map, jsonForm, {}, function (e) {
                    // 경로가 표출된 이후 실행되는 콜백 함수.
                    for (var m of e.markers) {
                        markerArr.push(m);
                    }
                    for (var l of e.polylines) {
                        lineArr.push(l);
                    }
                    var positionBounds = new Tmapv2.LatLngBounds(); //맵에 결과물 확인 하기 위한 LatLngBounds객체 생성
                    for (var polyline of e.polylines) {
                        for (var latlng of polyline.getPath().path) {
                            positionBounds.extend(latlng);  // LatLngBounds의 객체 확장
                        }
                    }
                    map.panToBounds(positionBounds);
                    map.zoomOut();
                });
            }
            resolve();
        },
        onProgress: function () {
        },
        onError: function () {
            alert('보행자 경로 - 결과 값이 없습니다.');

        }
    };
    tData.getRoutePlanForPeopleJson(startLatLng, endLatLng, "출발지", "도착지", optionObj, params);
});
}

// (경로API) 자동차 경로 안내 API
/* 
mode: 
- 0: 교통최적+추천(기본값)
- 1: 교통최적+무료우선
- 2: 교통최적+최소시간
- 3: 교통최적+초보
- 4: 교통최적+고속도로우선
- 10: 최단거리+유/무료
- 12: 이륜차도로우선
- 19: 교통최적+어린이보호구역 회피
*/
async function routesCarInit() {
var modes = [0, 1, 2, 3, 4, 10, 12, 19];
for(var mode of modes) {
    await routesCar(mode)
        .then(v =>{ console.log("complete routePlan: mode: ", v); });
    await sleep(500).then(() => console.log("done!"));
}
}
function routesCar(mode) {
// 각 searchOption별로 비동기 호출하기 때문에 promise객체로 동작보장
// (한개의 경로만 조회할 시 아래의 promise 필요X)
return new Promise(function(resolve, reject) {
    // 출발지, 목적지의 좌표를 조회
    var startx = $("#startx").val();
    var starty = $("#starty").val();
    var endx = $("#endx").val();
    var endy = $("#endy").val();
    var modes = {
        0: "교통최적+추천(기본값)",
        1: "교통최적+무료우선",
        2: "교통최적+최소시간",
        3: "교통최적+초보",
        4: "교통최적+고속도로우선",
        10: "최단거리+유/무료",
        12: "이륜차도로우선",
        19: "교통최적+어린이보호구역 회피"
    }
    // 경유지 좌표 파라미터 생성
    var viaPoints = [];
    $(".waypoint_input").each(function(idx) {
        var pos = $(this).find("input[name='multipos']").val();
        if(pos === "") {
            return true;
        }
        var viaX = pos.split(',')[0];
        var viaY = pos.split(',')[1];
        viaPoints.push(viaX + "," + viaY);
    });
    var passList = viaPoints.join("_");
    var s_latlng = new Tmapv2.LatLng (starty, startx);
    var e_latlng = new Tmapv2.LatLng (endy, endx);
    var optionObj = {
        reqCoordType:"WGS84GEO", //요청 좌표계 옵셥 설정입니다.
        resCoordType:"WGS84GEO",  //응답 좌표계 옵셥 설정입니다.
        trafficInfo:"Y",
        passList: passList,
        searchOption: mode
    };
    var params = {
        onComplete: function(result) {
            var resultData = result._responseData.features;
            var appendHtml = `
                <div class="_route_item" id="box1">
                    <div class="_route_item_type ${drawMode === "apiRoutesCar_" + mode || drawMode === "apiRoutesMulti_" + mode ? "__color_blue" : ""}" onclick="routesRedrawMap('apiRoutesCar', '${mode}');">${modes[mode]}</div>
                    <div class="_route_item_info">
                        ${(resultData[0].properties.totalTime / 60).toFixed(0)}분 
                        | ${(resultData[0].properties.totalDistance / 1000).toFixed(1)}km 
                        | ${resultData[0].properties.totalFare}원 
                        | 택시 ${resultData[0].properties.taxiFare}원</div>
                </div>
            `;
            writeApiResultHtml("apiRoutesCar_"+mode, appendHtml);
            if(drawMode === "apiRoutesCar_" + mode || drawMode === "apiRoutesMulti_" + mode) {
                reset();
                var positionBounds = new Tmapv2.LatLngBounds(); //맵에 결과물 확인 하기 위한 LatLngBounds객체 생성
                for ( var i in resultData) { //for문 [S]
                    var geometry = resultData[i].geometry;
                    var properties = resultData[i].properties;
                    if (geometry.type == "LineString") {
                        //교통 정보도 담음
                        // chktraffic.push(geometry.traffic);
                        var sectionInfos = [];
                        var trafficArr = geometry.traffic || [];
                        for ( var j in geometry.coordinates) {
                            var latlng = new Tmapv2.LatLng(geometry.coordinates[j][1], geometry.coordinates[j][0]);
                            positionBounds.extend(latlng);  // LatLngBounds의 객체 확장
                            sectionInfos.push(latlng);
                        }
                        drawLine(sectionInfos, trafficArr);
                    } else {
                        var markerPosition = new Tmapv2.LatLng(geometry.coordinates[1], geometry.coordinates[0]);
                        if (properties.pointType == "S") { //출발지 마커
                            markerStart = new Tmapv2.Marker({
                                position : markerPosition,
                                iconHTML: `
                                <div class='_t_marker' style="position:relative;" >
                                    <img src="https://cdn.icon-icons.com/icons2/3205/PNG/512/gps_place_marker_pointer_location_pin_map_navigation_direction_icon_195752.png" style="width:48px;height:48px;position:absolute;"/>
                                    <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 8px;line-height: 19px;">
                                    출발</div>
                                </div>
                                `,
                                offset: new Tmapv2.Point(24, 38),
                                iconSize : new Tmapv2.Size(24, 38),
                                map : map
                            });
                        } else if (properties.pointType == "E") { //도착지 마커
                            markerEnd = new Tmapv2.Marker({
                                position : markerPosition,
                                iconHTML: `
                                <div class='_t_marker' style="position:relative;" >
                                    <img src="https://cdn.icon-icons.com/icons2/1283/PNG/512/1497619936-jd21_85172.png" style="width:48px;height:48px;position:absolute;"/>
                                    <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 8px;line-height: 19px;">
                                    도착</div>
                                </div>
                                `,
                                offset: new Tmapv2.Point(24, 38),
                                iconSize : new Tmapv2.Size(24, 38),
                                map : map
                            });
                        } else { //각 포인트 마커
                            var marker_p = new Tmapv2.Marker({
                                position : markerPosition,
                                icon : "http://topopen.tmap.co.kr/imgs/point.png",
                                iconSize : new Tmapv2.Size(8, 8),
                                zIndex:1,
                                map : map
                            });
                    
                            markerPoint.push(marker_p);
                        }
                    }
                }//for문 [E]
                map.panToBounds(positionBounds);
                map.zoomOut();
                resolve(mode);
            } else {
                resolve(mode);
            }
        },
        onProgress: function() {},
        onError: function() {}
    };
    tData.getRoutePlanJson(s_latlng, e_latlng, optionObj, params);
});
}
function sleep(ms) {
return new Promise((r) => setTimeout(r, ms));
}
//마커 생성하기
function addMarkers(infoObj) {
var size = new Tmapv2.Size(24, 38);//아이콘 크기 설정합니다.

if (infoObj.pointType == "P") { //포인트점일때는 아이콘 크기를 줄입니다.
    size = new Tmapv2.Size(8, 8);
}

marker_p = new Tmapv2.Marker({
    position : new Tmapv2.LatLng(infoObj.lat, infoObj.lng),
    icon : infoObj.markerImage,
    iconSize : size,
    map : map
});

markerArr.push(marker_p);
}
//라인그리기
function drawLine(arrPoint, traffic) {
var polyline_;

    // 교통정보 혼잡도를 체크
    // strokeColor는 교통 정보상황에 다라서 변화
    // traffic :  0-정보없음, 1-원활, 2-서행, 3-지체, 4-정체  (black, green, yellow, orange, red)

    var lineColor = "";

    if (traffic != "0") {
        if (traffic.length == 0) { //length가 0인것은 교통정보가 없으므로 검은색으로 표시

            lineColor = "#06050D";
            //라인그리기[S]
            polyline_ = new Tmapv2.Polyline({
                path : arrPoint,
                strokeColor : lineColor,
                strokeWeight : 6,
                map : map
            });
            lineArr.push(polyline_);
            //라인그리기[E]
        } else { //교통정보가 있음

            if (traffic[0][0] != 0) { //교통정보 시작인덱스가 0이 아닌경우
                var trafficObject = "";
                var tInfo = [];

                for (var z = 0; z < traffic.length; z++) {
                    trafficObject = {
                        "startIndex" : traffic[z][0],
                        "endIndex" : traffic[z][1],
                        "trafficIndex" : traffic[z][2],
                    };
                    tInfo.push(trafficObject)
                }

                var noInfomationPoint = [];

                for (var p = 0; p < tInfo[0].startIndex; p++) {
                    noInfomationPoint.push(arrPoint[p]);
                }

                //라인그리기[S]
                polyline_ = new Tmapv2.Polyline({
                    path : noInfomationPoint,
                    strokeColor : "#06050D",
                    strokeWeight : 6,
                    map : map
                });
                //라인그리기[E]
                lineArr.push(polyline_);

                for (var x = 0; x < tInfo.length; x++) {
                    var sectionPoint = []; //구간선언

                    for (var y = tInfo[x].startIndex; y <= tInfo[x].endIndex; y++) {
                        sectionPoint.push(arrPoint[y]);
                    }

                    if (tInfo[x].trafficIndex == 0) {
                        lineColor = "#06050D";
                    } else if (tInfo[x].trafficIndex == 1) {
                        lineColor = "#61AB25";
                    } else if (tInfo[x].trafficIndex == 2) {
                        lineColor = "#FFFF00";
                    } else if (tInfo[x].trafficIndex == 3) {
                        lineColor = "#E87506";
                    } else if (tInfo[x].trafficIndex == 4) {
                        lineColor = "#D61125";
                    }

                    //라인그리기[S]
                    polyline_ = new Tmapv2.Polyline({
                        path : sectionPoint,
                        strokeColor : lineColor,
                        strokeWeight : 6,
                        map : map
                    });
                    //라인그리기[E]
                    lineArr.push(polyline_);
                }
            } else { //0부터 시작하는 경우

                var trafficObject = "";
                var tInfo = [];

                for (var z = 0; z < traffic.length; z++) {
                    trafficObject = {
                        "startIndex" : traffic[z][0],
                        "endIndex" : traffic[z][1],
                        "trafficIndex" : traffic[z][2],
                    };
                    tInfo.push(trafficObject)
                }

                for (var x = 0; x < tInfo.length; x++) {
                    var sectionPoint = []; //구간선언

                    for (var y = tInfo[x].startIndex; y <= tInfo[x].endIndex; y++) {
                        sectionPoint.push(arrPoint[y]);
                    }

                    if (tInfo[x].trafficIndex == 0) {
                        lineColor = "#06050D";
                    } else if (tInfo[x].trafficIndex == 1) {
                        lineColor = "#61AB25";
                    } else if (tInfo[x].trafficIndex == 2) {
                        lineColor = "#FFFF00";
                    } else if (tInfo[x].trafficIndex == 3) {
                        lineColor = "#E87506";
                    } else if (tInfo[x].trafficIndex == 4) {
                        lineColor = "#D61125";
                    }

                    //라인그리기[S]
                    polyline_ = new Tmapv2.Polyline({
                        path : sectionPoint,
                        strokeColor : lineColor,
                        strokeWeight : 6,
                        map : map
                    });
                    //라인그리기[E]
                    lineArr.push(polyline_);
                }
            }
        }
    } 
}
// 경유지 추가 컨트롤 함수
function onMultiButton(btn) {
// 삭제 버튼이면 li 지움
if($(btn).hasClass('wp_clear')) {
    $(btn).parent().prev('.__space_10_h').remove();
    $(btn).parent().remove();
    // 경유지를 지우고 남은 마지막 버튼을 추가버튼으로 변경
    var cnt0 = $(".waypoint_input").length;
    $(".waypoint_input:last").removeClass('wp_add wp_clear');
    $(".waypoint_input:last").addClass('wp_add');
/*                 
    $("#multiInput").find("button").each(function(idx) {
        if((cnt0-1) === idx) {
            $(this).removeClass();
            $(this).addClass('add');
        }
    });
*/
    
    // 마커 다시 그리기
    if(markerWp.length > 0){
        for(var i in markerWp){
            if(markerWp[i]) {
                markerWp[i].setMap(null);
            }
        }
        markerWp = [];
    }
    $(".waypoint_input").each(function(idx) {
        // 차례번호 재생성
        $(this).attr('data-idx', idx);
        var pos = $(this).find("input[name='multipos']").val();
        if(pos === "") {
            return true;
        }
        var viaX = pos.split(',')[0];
        var viaY = pos.split(',')[1];
        markerWp[idx] = new Tmapv2.Marker({
            position : new Tmapv2.LatLng(viaY, viaX),
            icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + idx + ".png",
            iconSize : new Tmapv2.Size(24, 38),
            map:map
        });
    });
    return false;
}
// 경유지 value empty체크
var val = $(btn).parent().find("input[type='text']").val();
if(val === "") {
    alert("경유지를 입력하세요.");
    return false;
}
// 기존 버튼들은 삭제 버튼으로 변경
$(".waypoint_input > button").each(function() {
    $(this).removeClass('wp_add wp_clear');
    $(this).addClass('wp_clear');
});
$("#wpList").append(`
    <div class="__space_10_h"></div>
    <div class="waypoint_input _map_overlay_row" data-idx="0" id="stopover">
        <input type="hidden" name="multipos" />
        <input type="text" class="_search_entry _search_entry_short" onkeyup="onKeyupSearchPoi(this);" placeholder="경유지를 입력하세요." style="padding-right: 45px;">
        <button class="wp_add" onclick="onMultiButton(this);"></button>
    </div>
`);
// 총 개수가 5개 이상이면 - 로 변경
var cnt2 = $(".waypoint_input").length;
if(cnt2 >= 5) {
    $(".waypoint_input > button").each(function() {
        $(this).removeClass('wp_add wp_clear');
        $(this).addClass('wp_clear');
    })
}
// 차례번호 재생성
$(".waypoint_input").each(function(idx) {
    $(this).removeClass('wp_add wp_clear');
    $(this).attr('data-idx', idx);
});
$(".waypoint_input").removeClass('texton');
$(".waypoint_input:last").addClass("texton");
}
function clickSearchPois(buttonObj) {
const $input = $(buttonObj).prev('input');
if($(buttonObj).hasClass('_search_address_btn')) {
    $("#searchAddress").val($input.val());
    searchPois();
} else if($(buttonObj).parent('div').hasClass('waypoint_input')) {
    // 경유지 제거
    const $_deleteObj = $(buttonObj).parent('div.waypoint_input');
    clearWaypoint($_deleteObj[0]);
} else {
    const type = $input.attr('id') || '';
    if(type === "searchStartAddress") {
        $("#startx").val('');
        $("#starty").val('');
        if(markerStart) {
            markerStart.setMap(null);
        }

    } else if(type === "searchEndAddress") {
        $("#endx").val('');
        $("#endy").val('');
        if(markerEnd) {
            markerEnd.setMap(null);
        }
    }
    $input.val('');
    $("#searchAddress").val('');
    $(buttonObj).removeClass('_delete_address_btn');
    $(buttonObj).addClass('_search_address_btn');
    $("._btn_action").addClass('__color_grey');
/*                 if(($("#searchStartAddress").val() === "") || ($("#searchEndAddress").val() === "")) {
        console.log("remove1");
        $("._btn_action").addClass('__color_grey');
    } else {
        console.log("remove2");
        $("._btn_action").removeClass('__color_grey');
    }
*/            }
}

//(경로API공통) 엔터키 통합검색 함수
function onKeyupSearchPoi(inputText) {
$("._btn_action").addClass('__color_grey');
if($(inputText).next('button').hasClass('_delete_address_btn')) {
    $(inputText).val('');
}
$(inputText).next('button').removeClass('_delete_address_btn');
$(inputText).next('button').addClass('_search_address_btn');
// Get the parent div.waypoint_input element
const $_deleteObj = $(inputText).parent('div.waypoint_input');
// Get the current size
var currentSize = $(".waypoint_input._wp_not_empty").length;
// Check if currentSize is greater than 0 and data-idx is not equal to currentSize
if (currentSize > 0 && $_deleteObj.data('idx') !== currentSize) {
    const inputValue = $(inputText).val();
    // Check if the input value is null or empty
    if (inputValue === null || inputValue === '' && inputText.id !== 'searchStartAddress' && inputText.id !== 'searchEndAddress') {
        // Call clearWaypoint
        clearWaypoint($_deleteObj[0]);
    }
}
if (window.event.keyCode == 13) {
    // 엔터키가 눌렸을 때 실행하는 반응
    var isWaypoint = $(inputText).parent('div.waypoint_input').length === 1;
    if(isWaypoint) {
        // 경유지입력시 엔터키대상 li에대해 class추가
        $(".waypoint_input").each(function() {
            $(this).removeClass('texton');
        });
        $(inputText).parent('div.waypoint_input').addClass('texton');
    }
    $("#searchAddress").val($(inputText).val());
    searchPois();
}
}

// (경로API공통) 지도위의 경로 안내 효과 다시그림
function routesRedrawMap(mode, carmode) {

if (mode === "apiRoutesPedestrian") {
    drawMode = mode;
    routesPedestrian();
} else if (mode === "apiRoutesCar" || mode === "apiRoutesMulti") {
    drawMode = mode+"_"+carmode;
    routesCar(carmode);
}
$("#apiResult").find('._route_item_type').removeClass('__color_blue');
$("#apiResult").find('#'+drawMode).find('._route_item_type').addClass('__color_blue');
}
// (경로API공통) 출발지와 도착지의 좌표를 설정한다.
function enterDest(type, address, x, y) {
marker1.setMap(null);
// 기존 라인 지우기
if(lineArr.length > 0){
    for(var i in lineArr) {
        lineArr[i].setMap(null);
    }
    //지운뒤 배열 초기화
    lineArr = [];
}
// 경로찾기 point 마커 지우기
if(markerPoint.length > 0){
    for(var i in markerPoint){
        markerPoint[i].setMap(null);
    }
    markerPoint = [];
}
if(type === 'start') {
    if(markerStart) {
        markerStart.setMap(null);
    }
    $("#startx").val(x);
    $("#starty").val(y);
    $("#searchStartAddress").val(address);
    $("#searchStartAddress").next('button').removeClass('_search_address_btn');
    $("#searchStartAddress").next('button').addClass('_delete_address_btn');
    
    markerStart = new Tmapv2.Marker({
        position : new Tmapv2.LatLng(y, x),
        // icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
        iconHTML: `
        <div class='_t_marker' style="position:relative;" >
            <img src="https://cdn.icon-icons.com/icons2/3205/PNG/512/gps_place_marker_pointer_location_pin_map_navigation_direction_icon_195752.png" style="width:48px;height:48px;position:absolute;"/>
            <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 8px;line-height: 19px;">
            출발</div>
        </div>
        `,
        offset: new Tmapv2.Point(24, 38),
        iconSize : new Tmapv2.Size(24, 38),
        map : map
    });
} else if(type === 'end') {
    if(markerEnd) {
        markerEnd.setMap(null);
    }
    $("#endx").val(x);
    $("#endy").val(y);
    $("#searchEndAddress").val(address);
    $("#searchEndAddress").next('button').removeClass('_search_address_btn');
    $("#searchEndAddress").next('button').addClass('_delete_address_btn');
    
    markerEnd = new Tmapv2.Marker({
        position : new Tmapv2.LatLng(y, x),
        // icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
        iconHTML: `
        <div class='_t_marker' style="position:relative;" >
            <img src="https://cdn.icon-icons.com/icons2/1283/PNG/512/1497619936-jd21_85172.png" style="width:48px;height:48px;position:absolute;"/>
            <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 8px;line-height: 19px;">
            도착</div>
        </div>
        `,
        offset: new Tmapv2.Point(24, 38),
        iconSize : new Tmapv2.Size(24, 38),
        map : map
    });
} else if(type === 'wp') {
    const currentSize = $(".waypoint_input").length;
    const prependHtml = `
    <div class="__space_10_h"></div>
    <div class="waypoint_input _wp_not_empty _map_overlay_row" data-idx="0" id="stopover">
        <input type="hidden" name="multipos" value="${x},${y}">
        <input type="text" value="${address}" class="_search_entry _search_entry_short" onkeyup="onKeyupSearchPoi(this);" placeholder="경유지를 입력하세요." style="padding-right: 45px;">
        <button onclick="clickSearchPois(this);" class="_delete_address_btn" style="margin-top: 14px; margin-bottom: 14px; pointer-events: all; cursor: pointer;">1번 경유지</button>
        <div style="width: 90px;"></div>
    </div>
    `;
    const emptyHtml = `
    <div class="__space_10_h"></div>
    <div class="waypoint_input _map_overlay_row" data-idx="0" id="stopover">
        <input type="hidden" name="multipos" />
        <input type="text" class="_search_entry _search_entry_short" onkeyup="onKeyupSearchPoi(this);" placeholder="경유지를 입력하세요." style="padding-right: 45px;">
        <button onclick="clickSearchPois(this);" class="_search_address_btn" style="margin-top: 14px; margin-bottom: 14px; pointer-events: all; cursor: pointer;">2번 경유지</button>
        <div style="width: 90px;"></div>
    </div>
    `;
    if(currentSize < 5) {
        const $_deleteObj = $("#wpList .waypoint_input:last");
        $_deleteObj.prev('.__space_10_h').remove();
        $_deleteObj.remove();
        $("#wpList").append(prependHtml);
        $("#wpList").append(emptyHtml);
    } else {
        const $_deleteObj = $("#wpList .waypoint_input:last");
        $_deleteObj.prev('.__space_10_h').remove();
        $_deleteObj.remove();
        $("#wpList").append(prependHtml);
    }
    redrawRouteMarker();
}
/* 검색버튼 활성화/비활성화 체크  */
var startx = $("#startx").val();
var starty = $("#starty").val();
var endx = $("#endx").val();
var endy = $("#endy").val();
if(startx === "" || starty === "" || endx === "" || endy === "") {
    $("._btn_action").addClass('__color_grey');
} else {
    $("._btn_action").removeClass('__color_grey');
}

// reset();
}
function clearWaypoint(destObj) {
const currentSize = $(".waypoint_input._wp_not_empty").length;
console.log("clearWaypoint: ", currentSize);
const emptyHtml = `
    <div class="__space_10_h"></div>
    <div class="waypoint_input _map_overlay_row" data-idx="0" id="stopover">
        <input type="hidden" name="multipos" />
        <input type="text" class="_search_entry _search_entry_short" onkeyup="onKeyupSearchPoi(this);" placeholder="경유지를 입력하세요." style="padding-right: 45px;">
        <button onclick="clickSearchPois(this);" class="_search_address_btn" style="margin-top: 14px; margin-bottom: 14px; pointer-events: all; cursor: pointer;"></button>
        <div style="width: 90px;"></div>
    </div>
    `;
const $_deleteObj = $(destObj);
$_deleteObj.prev('.__space_10_h').remove();
$_deleteObj.remove();
if(currentSize === 5) {
$("#wpList").append(emptyHtml);
}
redrawRouteMarker();
}
/* 경로검색시 경유지 마커 다시 그림 */
function redrawRouteMarker() {
if(markerWp.length > 0){
    for(var i in markerWp) {
        markerWp[i].setMap(null);
    }
    //지운뒤 배열 초기화
    markerWp = [];
}
$(".waypoint_input").each(function(idx) {
    // 차례번호 재생성
    $(this).attr('data-idx', idx);
    var pos = $(this).find("input[name='multipos']").val();
    if(pos === "") {
        return true;
    }
    var viaX = pos.split(',')[0];
    var viaY = pos.split(',')[1];
    markerWp[idx] = new Tmapv2.Marker({
        position : new Tmapv2.LatLng(viaY, viaX),
        // icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + idx + ".png",
        iconHTML: `
        <div class='_t_marker' style="position:relative;" >
            <img src="https://cdn.icon-icons.com/icons2/3205/PNG/512/pin_place_pointer_marker_direction_gps_navigation_map_location_icon_195711.png" style="width:48px;height:48px;position:absolute;"/>
            <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 8px;line-height: 19px;">
            ${idx+1}</div>
        </div>
        `,
        offset: new Tmapv2.Point(24, 38),
        iconSize : new Tmapv2.Size(24, 38),
        map:map
    });
});
}
// (경로API공통) API 결과값 기록
function writeApiResultHtml(type, string) {
if($("#apiResult div#results").length === 0) {
    $("#apiResult").empty();
    $("#apiResult").html(`
        <div class="_result_panel_bg">
            <div class="_result_panel_scroll">
                <div class="__space_10_h"></div>
                <div id="results"></div>
                <div id="apiRoutesPedestrian"></div>
                <div id="apiRoutesCar"></div>
                <div id="apiRoutesMulti"></div>
            </div>
        </div>
    `);
}
if(type.startsWith("apiRoutesCar_")) {
    if($("#apiResult #apiRoutesCar").find("#"+type).length === 0 ) {
        $("#apiResult #apiRoutesCar").append(`<div id="${type}">${string}</div>`);
    }
} else if(type.startsWith("apiRouteSequential_") || type.startsWith("routesOptimization")) {
    if($("#apiResult #apiRoutesMulti").find("#"+type).length === 0 ) {
        $("#apiResult #apiRoutesMulti").append(`<div id="${type}">${string}</div>`);
    }
} else {
    $("#apiResult").find("#"+type).html(string);
}
}   
// (API 공통) 맵에 그려져있는 라인, 마커, 팝업을 지우는 함수
function reset() {
// 기존 라인 지우기
if(lineArr.length > 0){
    for(var i in lineArr) {
        lineArr[i].setMap(null);
    }
    //지운뒤 배열 초기화
    lineArr = [];
}

if(marker1){
    marker1.setMap(null);
}

for (let i = 0; i < markerWp.length; i++) {
markerWp[i].setMap(null); // 모든 마커를 지도에서 제거
}
markerWp = [];

// 기존 마커 지우기
if(markerStart) {
    markerStart.setMap(null);
}

if(markerArr.length > 0){
    for(var i in markerArr){
        markerArr[i].setMap(null);
    }
    markerArr = [];
}
// poi 마커 지우기
if(markerPoi.length > 0){
    for(var i in markerPoi){
        markerPoi[i].setMap(null);
    }
    markerPoi = [];
}
// 경로찾기 point 마커 지우기
if(markerPoint.length > 0){
    for(var i in markerPoint){
        markerPoint[i].setMap(null);
    }
    markerPoint = [];
}

// 기존 팝업 지우기
if(labelArr.length > 0){
    for(var i in labelArr){
        labelArr[i].setMap(null);
    }
    labelArr = [];
}
}

function posmarkers(latitude, longitude){
    // console.log(response)
    marker2 = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(latitude, longitude), //Marker의 중심좌표 설정.
        map: map //Marker가 표시될 Map 설정..
    });
    // var resultHeader = response.resultData.header;
    // tDistance = resultHeader.totalDistance;
    // tTime = resultHeader.speed;	
    // rName = resultHeader.roadName;
    // console.log(tDistance)
    // console.log(tTime)
    // console.log(rName)
}

function startmarkers(latitude, longitude){
    reset();
    markerStart = new Tmapv2.Marker({
        position : new Tmapv2.LatLng(latitude, longitude),
                    iconHTML: `
                    <div class='_t_marker' style="position:relative;" >
                        <img src="https://cdn.icon-icons.com/icons2/3205/PNG/512/gps_place_marker_pointer_location_pin_map_navigation_direction_icon_195752.png" style="width:48px;height:48px;position:absolute;"/>
                        <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 8px;line-height: 19px;">
                        출발</div>
                    </div>
                    `,
                    offset: new Tmapv2.Point(24, 38),
                    iconSize: new Tmapv2.Size(48, 48),
                    map: map
    });
}

function stopmarkers(latitude, longitude){
    stopmarker_remove();
    markerEnd = new Tmapv2.Marker({
        position : new Tmapv2.LatLng(latitude, longitude),
        iconHTML: `
                    <div class='_t_marker' style="position:relative;" >
                        <img src="https://cdn.icon-icons.com/icons2/1283/PNG/512/1497619936-jd21_85172.png" style="width:48px;height:48px;position:absolute;"/>
                        <div style="position:absolute; width:48px;height:42px; display:flex; align-items:center; justify-content: center; color:#FAFBFF; font-family: 'SUIT';font-style: normal;font-weight: 700;font-size: 8px;line-height: 19px;">
                        도착</div>
                    </div>
                    `,
        offset: new Tmapv2.Point(24, 38),
        iconSize: new Tmapv2.Size(24, 38),
        map : map
});
}

// function getAddress(latitude, longitude) {
//     const geocoder = new Tmapv2.Geocoder();
//     const latlng = new Tmapv2.LatLng(latitude, longitude);

//     geocoder.getAddress(latlng, function(result) {
//         const address = result.formatted_address; // 좌표에 해당하는 주소
//         document.getElementById('searchStartAddress').value = address; // input 태그에 주소를 자동으로 기입
//     });
// }

function onComplete(latitude, longitude) {
    console.log(this._responseData); //json으로 데이터를 받은 정보들을 콘솔창에서 확인할 수 있습니다.
    var result ='현재 지도의 중심 좌표주소 : ' + this._responseData.addressInfo.fullAddress; //출력될 결과 주소 정보 입니다.

    var marker = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(latitude,longitude),
        label:result
    });

    console.log(marker);

    marker.setMap(map);
    map.setCenter(new Tmapv2.LatLng(latitude,longitude));
}

// 출발시
document.getElementById('250m').addEventListener('click',  function (evt){
    var latLng = evt.view;
    console.log(latLng);

    var lon = latLng.longitude;
    var lat = latLng.latitude;
    

    var optionObj = {
        coordType: "WGS84GEO",       //응답좌표 타입 옵션 설정 입니다.
        addressType: "A10"           //주소타입 옵션 설정 입니다.
    };

    var params = {
        onComplete:function(result) { 
            console.log("출발시: ",result);
            var arrResult = result._responseData.addressInfo;
            var fullAddress = arrResult.fullAddress.split(",");
            var newRoadAddr = fullAddress[2];
            $("#searchStartAddress").val(newRoadAddr);
            var jibunAddr = fullAddress[1];

    },      
    onProgress:function() {},   //데이터 로드 중에 실행하는 함수 입니다.
    onError:function() {        //데이터 로드가 실패했을때 실행하는 함수 입니다.
        alert("onError");
    }             
};
tData.getAddressFromGeoJson(lat, lon, optionObj, params);
});


// 마커 도착시 찍어야함
// document.getElementById('250m').addEventListener('click', function (evt){
//     var latLng = evt.view;
//     console.log(latLng);

//     var lon = latLng.longitude;
//     var lat = latLng.latitude;

//     stopmarkers(lat, lon);
//     console.log(stopmarkers(lat, lon));

    

//     var optionObj = {
//         coordType: "WGS84GEO",       //응답좌표 타입 옵션 설정 입니다.
//         addressType: "A10"           //주소타입 옵션 설정 입니다.
//     };

//     var params = {
//         onComplete:function(result) { 
//             console.log("도착시: ", result);
//             var arrResult = result._responseData.addressInfo;
//             var fullAddress = arrResult.fullAddress.split(",");
//             var newRoadAddr = fullAddress[2];
//             $("#searchStartAddress").val(newRoadAddr);
//             var jibunAddr = fullAddress[1];

//     },      
//     onProgress:function() {},   //데이터 로드 중에 실행하는 함수 입니다.
//     onError:function() {        //데이터 로드가 실패했을때 실행하는 함수 입니다.
//         alert("onError");
//     }             
// };
// tData.getAddressFromGeoJson(lat, lon, optionObj, params);
// });



document.getElementById('250m').addEventListener('click', function stopmarkers (latitude, longitude, evt) {
    console.log(latitude);
    console.log(longitude);
    console.log(evt);
})


function random(latitude, longitude){
const radius = 250;
const d2r = Math.PI / 180;
const r2d = 180 / Math.PI;
// 이거를 drawingObject라는 원의 크기를 키워주는 대로 그 값대로 지름을 정해서 계산하게 해주기!!
// 이걸 해결하려면, getDrawingObject() 함수에 redius를 담당하는 값이 있는지 보고 그 값을 지정해주면 인식해서 그 내로 경로가 생성이 가능할듯
const earth_rad = 6378000; // 지구 반지름 근사값

const r = Math.random() * radius;
const rlat = (r / earth_rad) * r2d;
const rlng = rlat / Math.cos(latitude * d2r);

const theta = Math.PI * (Math.random() * 2);
const x = latitude + (rlat * Math.sin(theta));
const y = longitude + (rlng * Math.cos(theta));
console.log("stops lat : ",x);
console.log("stops long : ",y);
moveMapTo(x, y);
stopmarkers(x, y);
const end = markerEnd.getPosition();
$("#searchEndAddress").val('도착역');
}

function stopmarker_remove(){
    if(markerEnd){
        markerEnd.setMap(null);
    }
}
 



function radius250m() {
navigator.geolocation.getCurrentPosition(function (pos) {
const latitude = pos.coords.latitude;
const longitude = pos.coords.longitude;

onComplete(latitude, longitude);
// prompt 로 입력값을 받아서 if 문으로 숫자를 걸러줘서 랜덤경로를 지정하거나,
// 버튼을 따로 250, 500, 1000, 1500 등등을 따로 또 만들어서 redius 값을 지정해주거나 둘 중 하나 하면 될듯!!
startmarkers(latitude, longitude);


random(latitude, longitude);
// const d2r = Math.PI / 180;
// const r2d = 180 / Math.PI;
// // 이거를 drawingObject라는 원의 크기를 키워주는 대로 그 값대로 지름을 정해서 계산하게 해주기!!
// // 이걸 해결하려면, getDrawingObject() 함수에 redius를 담당하는 값이 있는지 보고 그 값을 지정해주면 인식해서 그 내로 경로가 생성이 가능할듯
// const earth_rad = 6378000; // 지구 반지름 근사값

// const r = Math.random() * radius;
// const rlat = (r / earth_rad) * r2d;
// const rlng = rlat / Math.cos(latitude * d2r);

// const theta = Math.PI * (Math.random() * 2);
// const y = longitude + (rlng * Math.cos(theta));
// const x = latitude + (rlat * Math.sin(theta));
// moveMapTo(x, y);

// $("#startx").val(x);
// $("#starty").val(y);
// $("#searchStartAddress").val(address);
// $("#searchStartAddress").next('button').removeClass('_search_address_btn');
// $("#searchStartAddress").next('button').addClass('_delete_address_btn');

})
}



function radius500m() {
navigator.geolocation.getCurrentPosition(function (pos) {
const latitude = pos.coords.latitude;
const longitude = pos.coords.longitude;
// prompt 로 입력값을 받아서 if 문으로 숫자를 걸러줘서 랜덤경로를 지정하거나,
// 버튼을 따로 250, 500, 1000, 1500 등등을 따로 또 만들어서 redius 값을 지정해주거나 둘 중 하나 하면 될듯!!
startmarkers(latitude, longitude);
const radius = 500;

const d2r = Math.PI / 180;
const r2d = 180 / Math.PI;
// 이거를 drawingObject라는 원의 크기를 키워주는 대로 그 값대로 지름을 정해서 계산하게 해주기!!
// 이걸 해결하려면, getDrawingObject() 함수에 redius를 담당하는 값이 있는지 보고 그 값을 지정해주면 인식해서 그 내로 경로가 생성이 가능할듯
const earth_rad = 6378000; // 지구 반지름 근사값

const r = Math.random() * radius;
const rlat = (r / earth_rad) * r2d;
const rlng = rlat / Math.cos(latitude * d2r);

const theta = Math.PI * (Math.random() * 2);
const y = longitude + (rlng * Math.cos(theta));
const x = latitude + (rlat * Math.sin(theta));
moveMapTo(x, y);

startmarkers(x, y);
});
}

function radius1000m() {
navigator.geolocation.getCurrentPosition(function (pos) {
const latitude = pos.coords.latitude;
const longitude = pos.coords.longitude;
// prompt 로 입력값을 받아서 if 문으로 숫자를 걸러줘서 랜덤경로를 지정하거나,
// 버튼을 따로 250, 500, 1000, 1500 등등을 따로 또 만들어서 redius 값을 지정해주거나 둘 중 하나 하면 될듯!!
startmarkers(latitude, longitude);
const radius = 1000;

const d2r = Math.PI / 180;
const r2d = 180 / Math.PI;
// 이거를 drawingObject라는 원의 크기를 키워주는 대로 그 값대로 지름을 정해서 계산하게 해주기!!
// 이걸 해결하려면, getDrawingObject() 함수에 redius를 담당하는 값이 있는지 보고 그 값을 지정해주면 인식해서 그 내로 경로가 생성이 가능할듯
const earth_rad = 6378000; // 지구 반지름 근사값

const r = Math.random() * radius;
const rlat = (r / earth_rad) * r2d;
const rlng = rlat / Math.cos(latitude * d2r);

const theta = Math.PI * (Math.random() * 2);
const y = longitude + (rlng * Math.cos(theta));
const x = latitude + (rlat * Math.sin(theta));
moveMapTo(x, y);

startmarkers(x, y);
});
}


function radius_free() {
navigator.geolocation.getCurrentPosition(function (pos) {
const latitude = pos.coords.latitude;
const longitude = pos.coords.longitude;
let submit = Number(prompt('원하는 반경을 입력 해주세요.'));
startmarkers(latitude, longitude);

const radius = submit;

const d2r = Math.PI / 180;
const r2d = 180 / Math.PI;
// 이거를 drawingObject라는 원의 크기를 키워주는 대로 그 값대로 지름을 정해서 계산하게 해주기!!
// 이걸 해결하려면, getDrawingObject() 함수에 redius를 담당하는 값이 있는지 보고 그 값을 지정해주면 인식해서 그 내로 경로가 생성이 가능할듯
const earth_rad = 6378000; // 지구 반지름 근사값

const r = Math.random() * radius;
const rlat = (r / earth_rad) * r2d;
const rlng = rlat / Math.cos(latitude * d2r);

const theta = Math.PI * (Math.random() * 2);
const y = longitude + (rlng * Math.cos(theta));
const x = latitude + (rlat * Math.sin(theta));
moveMapTo(x, y);

startmarkers(x, y);
});
}