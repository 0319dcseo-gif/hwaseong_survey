/**
 * 화성교통안전체험교육센터 고객만족도 조사 - Google Apps Script
 *
 * [최초 설정 순서]
 * 1. 새 구글 스프레드시트 생성 → 상단 [확장 프로그램] → [Apps Script] 클릭
 * 2. 기존 코드를 모두 지우고 이 파일 전체를 붙여넣고 저장(Ctrl+S)
 * 3. 상단 함수 드롭다운에서 `setupSheets` 선택 → [실행] (시트 3개 + 자동 집계 수식 생성)
 * 4. (선택) `testWriteSample` 실행 → 각 시트에 테스트 데이터가 정상 기록되는지 확인 후 테스트 행 삭제
 * 5. 우측 상단 [배포] → [새 배포] → 유형: [웹 앱]
 *    - 다음 사용자 권한으로 실행: 나(본인 계정)
 *    - 액세스 권한이 있는 사용자: 모든 사용자
 *    → [배포] 클릭 후 발급된 웹 앱 URL을 `config.js` 의 SHEET_URL 에 입력
 */

var SHEET_TAXI = '개인택시양수';
var SHEET_GENERAL = '일반과정';
var SHEET_DASHBOARD = '요약대시보드';

var GENDER_MAP = {
  '1': '남자',
  '2': '여자'
};

var BIZ_EXP_MAP = {
  '1': '택시',
  '2': '버스',
  '3': '화물',
  '4': '건설기계',
  '5': '타인에게 고용된 운전경력',
  '6': '해당없음'
};

var TRANSFER_MAP = {
  '1': '사전계약 체결',
  '2': '즉시 또는 1개월 이내',
  '3': '3개월 이내',
  '4': '6개월 이내',
  '5': '1년 이내',
  '6': '양수시점 미정'
};

var YN_MAP = {
  '1': '없음',
  '2': '있음'
};

var RATING_LABELS = [
  '1. 이용목적 부합',
  '2. 미래가치 창출',
  '3. 타 공공기관 대비 우수',
  '4. 서비스 이용 무문제',
  '5. 직원 친절도',
  '6. 정보/처리결과 안내',
  '7. 시설 쾌적성',
  '8. 수료 후 긍정 인식',
  '9. 직원 최선 다함',
  '10. 전반적 만족도'
];

// A~AC (29열)
var TAXI_HEADERS = [
  '제출일시',
  '교육입교일자',
  '연령',
  '성별코드',
  '성별',
  '사업용경험코드',
  '사업용경험',
  '사업용경력(개월)',
  '자가용경력(개월)',
  '양수계획코드',
  '양수계획',
  '문항1', '문항2', '문항3', '문항4', '문항5',
  '문항6', '문항7', '문항8', '문항9', '문항10',
  '평균점수',
  '가장만족내용',
  '교육개선여부',
  '교육개선내용',
  '시설개선여부',
  '시설개선내용',
  '기타의견여부',
  '기타의견내용'
];

// A~AB (28열)
var GENERAL_HEADERS = [
  '제출일시',
  '교육과정',
  '교육입교일자',
  '연령',
  '성별코드',
  '성별',
  '사업용경험코드',
  '사업용경험',
  '사업용경력(개월)',
  '자가용경력(개월)',
  '문항1', '문항2', '문항3', '문항4', '문항5',
  '문항6', '문항7', '문항8', '문항9', '문항10',
  '평균점수',
  '가장만족내용',
  '교육개선여부',
  '교육개선내용',
  '시설개선여부',
  '시설개선내용',
  '기타의견여부',
  '기타의견내용'
];

/**
 * 최초 1회 실행: 3개 시트(개인택시양수, 일반과정, 요약대시보드)와 자동 집계 수식을 생성합니다.
 */
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureDataSheet_(ss, SHEET_TAXI, TAXI_HEADERS);
  ensureDataSheet_(ss, SHEET_GENERAL, GENERAL_HEADERS);
  buildDashboard_(ss);
}

/**
 * (선택) Apps Script 편집기 안에서 직접 시트 기록을 테스트할 때 실행하는 함수
 */
function testWriteSample() {
  setupSheets();
  var today = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd');
  var r1 = saveSurveyResponse_({
    submissionId: 'TEST-TAXI-' + Date.now(),
    surveyType: 'taxi',
    eduDate: today,
    age: '54',
    gender: '1',
    bizExp: '1',
    bizMonths: '36',
    privMonths: '180',
    transfer: '2',
    r1: '10', r2: '9', r3: '10', r4: '9', r5: '10',
    r6: '10', r7: '9', r8: '10', r9: '10', r10: '10',
    satisfiedText: '체험교육',
    imp_edu_yn: '1', imp_edu_text: '',
    imp_facility_yn: '1', imp_facility_text: '',
    imp_etc_yn: '2', imp_etc_text: '[연동테스트] 택시 설문 샘플 데이터입니다.'
  });
  var r2 = saveSurveyResponse_({
    submissionId: 'TEST-GEN-' + Date.now(),
    surveyType: 'general',
    courseName: '신규버스운전자 양성교육',
    eduDate: today,
    age: '42',
    gender: '1',
    bizExp: '2',
    bizMonths: '12',
    privMonths: '120',
    r1: '9', r2: '9', r3: '10', r4: '10', r5: '10',
    r6: '9', r7: '10', r8: '10', r9: '10', r10: '10',
    satisfiedText: '교수진',
    imp_edu_yn: '1', imp_edu_text: '',
    imp_facility_yn: '1', imp_facility_text: '',
    imp_etc_yn: '2', imp_etc_text: '[연동테스트] 일반과정 설문 샘플 데이터입니다.'
  });
  Logger.log('택시 테스트 결과: ' + JSON.stringify(r1));
  Logger.log('일반 테스트 결과: ' + JSON.stringify(r2));
}

/**
 * POST 요청 처리 (메인 제출 방식)
 */
function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    var result = saveSurveyResponse_(data);
    return jsonResponse_(result);
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

/**
 * GET 요청 처리 (연동 진단 ping + 폴백 제출 + 브라우저 상태 확인)
 */
function doGet(e) {
  var params = (e && e.parameter) ? e.parameter : {};

  // 1) 담당자 페이지(qr.html)에서 연결 상태를 확인할 때 (?action=ping)
  if (params.action === 'ping') {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var taxiSheet = ss.getSheetByName(SHEET_TAXI);
    var genSheet = ss.getSheetByName(SHEET_GENERAL);
    var dashSheet = ss.getSheetByName(SHEET_DASHBOARD);

    var info = {
      ok: true,
      spreadsheetName: ss.getName(),
      serverTime: Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'),
      sheets: {
        taxi: taxiSheet ? Math.max(0, taxiSheet.getLastRow() - 1) : -1,
        general: genSheet ? Math.max(0, genSheet.getLastRow() - 1) : -1,
        dashboard: !!dashSheet
      }
    };
    return jsonResponse_(info, params.callback);
  }

  // 2) 브라우저에서 웹 앱 URL만 직접 열었을 때
  if (!params.eduDate && params.r1 === undefined) {
    return ContentService
      .createTextOutput('화성교통안전체험교육센터 고객만족도 조사 서버가 정상 작동 중입니다.')
      .setMimeType(ContentService.MimeType.TEXT);
  }

  // 3) GET 방식 폴백 저장
  try {
    var result = saveSurveyResponse_(params);
    return jsonResponse_(result, params.callback);
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) }, params.callback);
  }
}

function jsonResponse_(obj, callback) {
  var json = JSON.stringify(obj);
  if (callback && /^[a-zA-Z0-9_$.]+$/.test(callback)) {
    return ContentService
      .createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 동시 제출 충돌 방지(LockService) + 중복 저장 방지(submissionId 캐시) 기반 저장
 */
function saveSurveyResponse_(data) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    var cache = CacheService.getScriptCache();
    var subId = data.submissionId ? String(data.submissionId) : '';
    if (subId) {
      var cached = cache.get('sub_' + subId);
      if (cached) {
        var prev = JSON.parse(cached);
        prev.duplicate = true;
        return prev;
      }
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var isTaxi = (data.surveyType === 'taxi') || (!data.courseName && !!data.transfer);
    var sheetName = isTaxi ? SHEET_TAXI : SHEET_GENERAL;
    var headers = isTaxi ? TAXI_HEADERS : GENERAL_HEADERS;
    var sheet = ensureDataSheet_(ss, sheetName, headers);

    var now = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
    var scores = [];
    var sum = 0;
    var count = 0;
    for (var i = 1; i <= 10; i++) {
      var raw = data['r' + i];
      var num = (raw !== undefined && raw !== '') ? Number(raw) : '';
      scores.push(num);
      if (typeof num === 'number' && !isNaN(num)) {
        sum += num;
        count++;
      }
    }
    var avg = count > 0 ? Math.round((sum / count) * 100) / 100 : '';

    var genderCode = String(data.gender || '');
    var bizCode = String(data.bizExp || '');
    var transferCode = String(data.transfer || '');
    var impEduCode = String(data.imp_edu_yn || '');
    var impFacCode = String(data.imp_facility_yn || '');
    var impEtcCode = String(data.imp_etc_yn || '');

    var row;
    if (isTaxi) {
      row = [
        now,
        data.eduDate || '',
        data.age ? Number(data.age) : '',
        genderCode,
        GENDER_MAP[genderCode] || '',
        bizCode,
        BIZ_EXP_MAP[bizCode] || '',
        data.bizMonths !== '' && data.bizMonths !== undefined ? Number(data.bizMonths) : '',
        data.privMonths !== '' && data.privMonths !== undefined ? Number(data.privMonths) : '',
        transferCode,
        TRANSFER_MAP[transferCode] || ''
      ]
        .concat(scores)
        .concat([
          avg,
          data.satisfiedText || '',
          YN_MAP[impEduCode] || impEduCode,
          data.imp_edu_text || '',
          YN_MAP[impFacCode] || impFacCode,
          data.imp_facility_text || '',
          YN_MAP[impEtcCode] || impEtcCode,
          data.imp_etc_text || ''
        ]);
    } else {
      row = [
        now,
        data.courseName || '',
        data.eduDate || '',
        data.age ? Number(data.age) : '',
        genderCode,
        GENDER_MAP[genderCode] || '',
        bizCode,
        BIZ_EXP_MAP[bizCode] || '',
        data.bizMonths !== '' && data.bizMonths !== undefined ? Number(data.bizMonths) : '',
        data.privMonths !== '' && data.privMonths !== undefined ? Number(data.privMonths) : ''
      ]
        .concat(scores)
        .concat([
          avg,
          data.satisfiedText || '',
          YN_MAP[impEduCode] || impEduCode,
          data.imp_edu_text || '',
          YN_MAP[impFacCode] || impFacCode,
          data.imp_facility_text || '',
          YN_MAP[impEtcCode] || impEtcCode,
          data.imp_etc_text || ''
        ]);
    }

    sheet.appendRow(row);
    var savedRow = sheet.getLastRow();
    var response = { ok: true, sheet: sheetName, row: savedRow, duplicate: false };

    if (subId) {
      cache.put('sub_' + subId, JSON.stringify(response), 600);
    }
    return response;
  } finally {
    lock.releaseLock();
  }
}

/**
 * 데이터 시트가 없으면 생성하고 헤더 스타일을 적용합니다.
 */
function ensureDataSheet_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange
      .setBackground('#0f4c5c')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');
    sheet.setRowHeight(1, 32);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
  return sheet;
}

/**
 * 실시간 자동 집계 대시보드 시트를 생성합니다.
 */
function buildDashboard_(ss) {
  var dash = ss.getSheetByName(SHEET_DASHBOARD);
  if (!dash) {
    dash = ss.insertSheet(SHEET_DASHBOARD, 0);
  } else {
    dash.clear();
  }

  dash.getRange('A1').setValue('화성교통안전체험교육센터 고객만족도 실시간 집계 대시보드');
  dash.getRange('A1:D1').merge()
    .setBackground('#0f4c5c')
    .setFontColor('#ffffff')
    .setFontSize(14)
    .setFontWeight('bold')
    .setVerticalAlignment('middle');
  dash.setRowHeight(1, 38);

  // 1. 전체 현황
  dash.getRange('A3:D3').setValues([['구분', '응답 건수', '전체 평균 점수 (10점 만점)', '100점 환산']]);
  styleSubHeader_(dash.getRange('A3:D3'));

  dash.getRange('A4:D6').setValues([
    [
      '개인택시 양수교육',
      "=COUNTA('개인택시양수'!A2:A)",
      "=IFERROR(AVERAGE('개인택시양수'!V2:V), 0)",
      '=C4*10'
    ],
    [
      '일반 · 버스 · 화물 교육',
      "=COUNTA('일반과정'!A2:A)",
      "=IFERROR(AVERAGE('일반과정'!U2:U), 0)",
      '=C5*10'
    ],
    [
      '전체 합계 / 가중평균',
      '=B4+B5',
      '=IF(B6=0, 0, (B4*C4+B5*C5)/B6)',
      '=C6*10'
    ]
  ]);
  dash.getRange('B4:B6').setNumberFormat('#,##0"명"');
  dash.getRange('C4:C6').setNumberFormat('0.00');
  dash.getRange('D4:D6').setNumberFormat('0.0"점"');
  dash.getRange('A6:D6').setBackground('#e6f2f4').setFontWeight('bold');

  // 2. 문항별 평균 점수
  dash.getRange('A8:D8').setValues([['평가 문항 (0~10점)', '개인택시 양수', '일반·버스·화물', '전체 평균']]);
  styleSubHeader_(dash.getRange('A8:D8'));

  var taxiCols = ['L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U'];
  var genCols = ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
  var qRows = [];
  for (var i = 0; i < 10; i++) {
    var r = 9 + i;
    qRows.push([
      RATING_LABELS[i],
      "=IFERROR(AVERAGE('개인택시양수'!" + taxiCols[i] + '2:' + taxiCols[i] + '), 0)',
      "=IFERROR(AVERAGE('일반과정'!" + genCols[i] + '2:' + genCols[i] + '), 0)',
      '=IF($B$6=0, 0, ($B$4*B' + r + '+$B$5*C' + r + ')/$B$6)'
    ]);
  }
  dash.getRange(9, 1, 10, 4).setValues(qRows);
  dash.getRange('B9:D18').setNumberFormat('0.00');

  // 3. 가장 만족스러운 항목 집계
  dash.getRange('A20:D20').setValues([['가장 만족스러운 내용', '개인택시 양수', '일반·버스·화물', '합계']]);
  styleSubHeader_(dash.getRange('A20:D20'));

  var satItems = ['체험교육', '교수진', '시설'];
  var satRows = satItems.map(function (item, idx) {
    var rowIdx = 21 + idx;
    return [
      item,
      "=COUNTIF('개인택시양수'!W2:W, A" + rowIdx + ')',
      "=COUNTIF('일반과정'!V2:V, A" + rowIdx + ')',
      '=B' + rowIdx + '+C' + rowIdx
    ];
  });
  satRows.push([
    '기타(직접입력)',
    '=MAX(0, B4-SUM(B21:B23))',
    '=MAX(0, B5-SUM(C21:C23))',
    '=B24+C24'
  ]);
  dash.getRange(21, 1, 4, 4).setValues(satRows);
  dash.getRange('B21:D24').setNumberFormat('#,##0"명"');

  // 4. 일반과정 세부 교육과정별 집계
  dash.getRange('A26:D26').setValues([['일반과정 세부 교육과정', '응답 건수', '평균 점수', '100점 환산']]);
  styleSubHeader_(dash.getRange('A26:D26'));

  var courses = [
    '버스기본교육',
    '버스심화교육',
    '버스자격교육',
    '신규버스운전자 양성교육',
    '일반기본교육',
    '일반심화교육',
    '화물기본교육',
    '화물자격교육'
  ];
  var courseRows = courses.map(function (name, idx) {
    var rowIdx = 27 + idx;
    return [
      name,
      "=COUNTIF('일반과정'!B2:B, A" + rowIdx + ')',
      "=IFERROR(AVERAGEIF('일반과정'!B2:B, A" + rowIdx + ", '일반과정'!U2:U), 0)",
      '=C' + rowIdx + '*10'
    ];
  });
  dash.getRange(27, 1, courseRows.length, 4).setValues(courseRows);
  dash.getRange('B27:B34').setNumberFormat('#,##0"명"');
  dash.getRange('C27:C34').setNumberFormat('0.00');
  dash.getRange('D27:D34').setNumberFormat('0.0"점"');

  dash.setColumnWidth(1, 270);
  dash.setColumnWidth(2, 130);
  dash.setColumnWidth(3, 180);
  dash.setColumnWidth(4, 130);
}

function styleSubHeader_(range) {
  range
    .setBackground('#dce9ec')
    .setFontColor('#0a3440')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
}
